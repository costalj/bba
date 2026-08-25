package com.vistoria.arborea;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.widget.Toast;
import androidx.core.content.FileProvider;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public class PdfBridge {

    private final Activity activity;
    private final StringBuilder buffer = new StringBuilder();
    private String filename = "laudo.pdf";

    public PdfBridge(Activity activity) {
        this.activity = activity;
    }

    @JavascriptInterface
    public void pdfStart(String name) {
        buffer.setLength(0);
        filename = (name == null || name.isEmpty()) ? "laudo.pdf" : name;
    }

    @JavascriptInterface
    public void pdfAppend(String chunk) {
        if (chunk != null) {
            buffer.append(chunk);
        }
    }

    @JavascriptInterface
    public void pdfFinish() {
        activity.runOnUiThread(() -> {
            try {
                byte[] pdfBytes = Base64.decode(buffer.toString(), Base64.DEFAULT);
                if (pdfBytes.length == 0) {
                    throw new IOException("PDF vazio");
                }

                File dir = new File(activity.getCacheDir(), "pdfs");
                if (!dir.exists() && !dir.mkdirs()) {
                    throw new IOException("Nao foi possivel criar pasta temporaria");
                }

                File file = new File(dir, filename);
                try (FileOutputStream fos = new FileOutputStream(file)) {
                    fos.write(pdfBytes);
                }

                Uri uri = FileProvider.getUriForFile(
                    activity,
                    activity.getPackageName() + ".fileprovider",
                    file
                );

                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.setDataAndType(uri, "application/pdf");
                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                activity.startActivity(Intent.createChooser(intent, "Abrir PDF"));
            } catch (Exception e) {
                Toast.makeText(
                    activity,
                    "Erro ao abrir PDF: " + e.getMessage(),
                    Toast.LENGTH_LONG
                ).show();
            } finally {
                buffer.setLength(0);
            }
        });
    }
}
