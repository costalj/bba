package com.vistoria.arborea;

import android.app.Activity;
import android.app.PendingIntent;
import android.content.ClipData;
import android.content.Intent;
import android.content.pm.PackageInstaller;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.webkit.JavascriptInterface;
import android.widget.Toast;
import androidx.core.content.FileProvider;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;

public class UpdateBridge {

    private static final int MAX_REDIRECTS = 8;

    private final Activity activity;
    private volatile boolean downloading = false;

    public UpdateBridge(Activity activity) {
        this.activity = activity;
    }

    @JavascriptInterface
    public void downloadAndInstall(String url, String fileName) {
        if (url == null || url.trim().isEmpty()) {
            toast("URL de atualização inválida.");
            return;
        }
        if (downloading) {
            toast("Download já em andamento…");
            return;
        }
        if (!canInstallPackages()) {
            activity.runOnUiThread(this::openInstallPermissionSettings);
            return;
        }

        String name = fileName == null || fileName.trim().isEmpty()
            ? "BBA-update.apk"
            : fileName.trim();
        if (!name.toLowerCase().endsWith(".apk")) {
            name += ".apk";
        }
        final String finalName = name;

        downloading = true;
        toast("Baixando atualização…");

        new Thread(() -> {
            try {
                File apk = downloadApk(url.trim(), finalName);
                activity.runOnUiThread(() -> {
                    downloading = false;
                    installApk(apk);
                });
            } catch (Exception e) {
                activity.runOnUiThread(() -> {
                    downloading = false;
                    toast("Erro ao baixar: " + e.getMessage());
                });
            }
        }).start();
    }

    private boolean canInstallPackages() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            return true;
        }
        return activity.getPackageManager().canRequestPackageInstalls();
    }

    private void openInstallPermissionSettings() {
        toast("Permita instalar apps desconhecidos para o BBA e tente novamente.");
        try {
            Intent intent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES);
            intent.setData(Uri.parse("package:" + activity.getPackageName()));
            activity.startActivity(intent);
        } catch (Exception e) {
            toast("Abra Configurações → Apps → BBA → Instalar apps desconhecidos.");
        }
    }

    private File downloadApk(String urlStr, String fileName) throws Exception {
        HttpURLConnection conn = openConnectionFollowRedirects(urlStr);
        try {
            int code = conn.getResponseCode();
            if (code >= 400) {
                throw new Exception("HTTP " + code);
            }

            File dir = new File(activity.getExternalFilesDir(null), "updates");
            if (dir == null) {
                dir = new File(activity.getCacheDir(), "updates");
            }
            if (!dir.exists() && !dir.mkdirs()) {
                throw new Exception("Pasta temporária indisponível");
            }

            File out = new File(dir, fileName);
            try (InputStream in = conn.getInputStream(); FileOutputStream fos = new FileOutputStream(out)) {
                byte[] buf = new byte[8192];
                int n;
                while ((n = in.read(buf)) >= 0) {
                    fos.write(buf, 0, n);
                }
            }

            validateApkFile(out);
            return out;
        } finally {
            conn.disconnect();
        }
    }

    private HttpURLConnection openConnectionFollowRedirects(String urlStr) throws Exception {
        String current = urlStr;
        for (int i = 0; i < MAX_REDIRECTS; i++) {
            URL url = new URL(current);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setInstanceFollowRedirects(false);
            conn.setConnectTimeout(30000);
            conn.setReadTimeout(180000);
            conn.setRequestProperty("User-Agent", "BBA-Android-Update");
            conn.setRequestProperty("Accept", "application/octet-stream");
            conn.connect();

            int code = conn.getResponseCode();
            if (code == HttpURLConnection.HTTP_MOVED_PERM
                || code == HttpURLConnection.HTTP_MOVED_TEMP
                || code == HttpURLConnection.HTTP_SEE_OTHER
                || code == 307
                || code == 308) {
                String location = conn.getHeaderField("Location");
                conn.disconnect();
                if (location == null || location.isEmpty()) {
                    throw new Exception("Redirecionamento inválido");
                }
                current = location.startsWith("http") ? location : new URL(url, location).toString();
                continue;
            }
            return conn;
        }
        throw new Exception("Muitos redirecionamentos");
    }

    private void validateApkFile(File apk) throws Exception {
        if (!apk.exists() || apk.length() < 4096) {
            throw new Exception("Arquivo APK muito pequeno");
        }
        try (FileInputStream in = new FileInputStream(apk)) {
            byte[] header = new byte[4];
            if (in.read(header) != 4) {
                throw new Exception("Arquivo APK inválido");
            }
            if (header[0] != 'P' || header[1] != 'K') {
                throw new Exception("Download não é um APK válido");
            }
        }
    }

    private void installApk(File apk) {
        try {
            if (!canInstallPackages()) {
                openInstallPermissionSettings();
                return;
            }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                installWithPackageInstaller(apk);
            } else {
                installWithIntent(apk);
            }
        } catch (Exception e) {
            try {
                installWithIntent(apk);
            } catch (Exception fallback) {
                toast("Erro ao iniciar instalação: " + e.getMessage());
            }
        }
    }

    private void installWithPackageInstaller(File apk) throws Exception {
        PackageInstaller installer = activity.getPackageManager().getPackageInstaller();
        PackageInstaller.SessionParams params = new PackageInstaller.SessionParams(
            PackageInstaller.SessionParams.MODE_FULL_INSTALL
        );
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            params.setRequireUserAction(PackageInstaller.SessionParams.USER_ACTION_REQUIRED);
        }

        int sessionId = installer.createSession(params);
        PackageInstaller.Session session = installer.openSession(sessionId);
        try (OutputStream out = session.openWrite("bba-update", 0, apk.length());
             FileInputStream in = new FileInputStream(apk)) {
            byte[] buf = new byte[65536];
            int n;
            while ((n = in.read(buf)) >= 0) {
                out.write(buf, 0, n);
            }
            session.fsync(out);
        }

        Intent callback = new Intent(activity, InstallResultReceiver.class);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            flags |= PendingIntent.FLAG_MUTABLE;
        } else {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }
        PendingIntent pendingIntent = PendingIntent.getBroadcast(activity, sessionId, callback, flags);
        session.commit(pendingIntent.getIntentSender());
        session.close();
        toast("Confirme a instalação na tela do Android.");
    }

    private void installWithIntent(File apk) throws Exception {
        Uri uri = FileProvider.getUriForFile(
            activity,
            activity.getPackageName() + ".fileprovider",
            apk
        );

        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setDataAndType(uri, "application/vnd.android.package-archive");
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        intent.setClipData(ClipData.newRawUri("", uri));

        PackageManager pm = activity.getPackageManager();
        List<ResolveInfo> matches = pm.queryIntentActivities(intent, 0);
        for (ResolveInfo info : matches) {
            activity.grantUriPermission(
                info.activityInfo.packageName,
                uri,
                Intent.FLAG_GRANT_READ_URI_PERMISSION
            );
        }

        activity.startActivity(intent);
        toast("Confirme a instalação na tela do Android.");
    }

    private void toast(String message) {
        activity.runOnUiThread(() ->
            Toast.makeText(activity, message, Toast.LENGTH_LONG).show()
        );
    }
}
