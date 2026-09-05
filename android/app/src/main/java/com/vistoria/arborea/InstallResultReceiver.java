package com.vistoria.arborea;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInstaller;
import android.os.Build;
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
            case PackageInstaller.STATUS_PENDING_USER_ACTION:
                Intent confirm = intent.getParcelableExtra(Intent.EXTRA_INTENT);
                if (confirm == null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    confirm = intent.getParcelableExtra(Intent.EXTRA_INTENT, Intent.class);
                }
                if (confirm != null) {
                    confirm.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    try {
                        context.startActivity(confirm);
                    } catch (Exception e) {
                        Toast.makeText(
                            context,
                            "Abra a notificação do Android para confirmar a instalação.",
                            Toast.LENGTH_LONG
                        ).show();
                    }
                } else {
                    Toast.makeText(
                        context,
                        "Confirme a instalação na notificação do Android.",
                        Toast.LENGTH_LONG
                    ).show();
                }
                break;
            case PackageInstaller.STATUS_FAILURE_ABORTED:
                Toast.makeText(context, "Instalação cancelada.", Toast.LENGTH_LONG).show();
                break;
            case PackageInstaller.STATUS_FAILURE_BLOCKED:
                Toast.makeText(
                    context,
                    "Instalação bloqueada. Permita instalar apps desconhecidos para o BBA.",
                    Toast.LENGTH_LONG
                ).show();
                break;
            case PackageInstaller.STATUS_FAILURE_CONFLICT:
                Toast.makeText(
                    context,
                    "Assinatura diferente. Desinstale o BBA e instale a versão do GitHub uma vez.",
                    Toast.LENGTH_LONG
                ).show();
                break;
            case PackageInstaller.STATUS_FAILURE_INCOMPATIBLE:
                Toast.makeText(context, "APK incompatível com este aparelho.", Toast.LENGTH_LONG).show();
                break;
            case PackageInstaller.STATUS_FAILURE_INVALID:
                Toast.makeText(context, "Arquivo APK inválido ou download incompleto.", Toast.LENGTH_LONG).show();
                break;
            case PackageInstaller.STATUS_FAILURE_STORAGE:
                Toast.makeText(context, "Espaço insuficiente para instalar a atualização.", Toast.LENGTH_LONG).show();
                break;
            default:
                Toast.makeText(
                    context,
                    "Não foi possível atualizar"
                        + (message != null && !message.isEmpty() ? ": " + message : " (código " + status + ")"),
                    Toast.LENGTH_LONG
                ).show();
                break;
        }
    }
}
