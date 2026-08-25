package com.vistoria.arborea;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.webkit.JavascriptInterface;
import android.widget.Toast;
import androidx.core.content.FileProvider;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class UpdateBridge {

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
        URL url = new URL(urlStr);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setConnectTimeout(30000);
        conn.setReadTimeout(180000);
        conn.setInstanceFollowRedirects(true);
        conn.setRequestProperty("User-Agent", "BBA-Android-Update");
        conn.connect();

        int code = conn.getResponseCode();
        if (code >= 400) {
            throw new Exception("HTTP " + code);
        }

        File dir = new File(activity.getCacheDir(), "updates");
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
        } finally {
            conn.disconnect();
        }

        if (!out.exists() || out.length() < 1024) {
            throw new Exception("Arquivo APK inválido");
        }
        return out;
    }

    private void installApk(File apk) {
        try {
            if (!canInstallPackages()) {
                openInstallPermissionSettings();
                return;
            }

            Uri uri = FileProvider.getUriForFile(
                activity,
                activity.getPackageName() + ".fileprovider",
                apk
            );

            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(uri, "application/vnd.android.package-archive");
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            activity.startActivity(intent);
            toast("Confirme a instalação na tela do Android.");
        } catch (Exception e) {
            toast("Erro ao iniciar instalação: " + e.getMessage());
        }
    }

    private void toast(String message) {
        activity.runOnUiThread(() ->
            Toast.makeText(activity, message, Toast.LENGTH_LONG).show()
        );
    }
}
