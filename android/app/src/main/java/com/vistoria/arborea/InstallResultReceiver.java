package com.vistoria.arborea;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInstaller;
import android.widget.Toast;

public class InstallResultReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null) return;
        int status = intent.getIntExtra(PackageInstaller.EXTRA_STATUS, PackageInstaller.STATUS_FAILURE);
        String message = intent.getStringExtra(PackageInstaller.EXTRA_STATUS_MESSAGE);
        switch (status) {
            case PackageInstaller.STATUS_SUCCESS:
                Toast.makeText(context, "Atualização instalada com sucesso.", Toast.LENGTH_LONG).show();
                break;
            case PackageInstaller.STATUS_FAILURE_ABORTED:
                Toast.makeText(context, "Instalação cancelada.", Toast.LENGTH_LONG).show();
                break;
            case PackageInstaller.STATUS_FAILURE_CONFLICT:
                Toast.makeText(
                    context,
                    "Conflito de assinatura. Desinstale o BBA e instale a versão do GitHub.",
                    Toast.LENGTH_LONG
                ).show();
                break;
            case PackageInstaller.STATUS_FAILURE_INCOMPATIBLE:
                Toast.makeText(context, "APK incompatível com este aparelho.", Toast.LENGTH_LONG).show();
                break;
            default:
                Toast.makeText(
                    context,
                    "App não atualizado: " + (message != null ? message : "erro desconhecido"),
                    Toast.LENGTH_LONG
                ).show();
                break;
        }
    }
}
