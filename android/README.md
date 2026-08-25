# BBA — APK para Android

## Download / distribuição

O arquivo para compartilhar no Google Drive:

| Arquivo | Descrição |
|---------|-----------|
| `dist/BBA-1.0.0.apk` | App Android (WebView + brasão BBA) |

Instruções completas: **`dist/LEIA-ME.txt`**

## Gerar o APK

```powershell
.\scripts\configurar_ip.ps1   # IP do PC na Wi-Fi
.\scripts\build_apk.ps1       # compila → dist/BBA-1.0.0.apk
```

## Testar

1. `python run.py` no PC
2. Instale `dist/BBA-1.0.0.apk` no celular (mesma Wi-Fi)
3. Abra o app **BBA**

## Estrutura

```
bba/
├── dist/                  ← APK para download
├── scripts/
│   ├── build_apk.ps1
│   └── configurar_ip.ps1
└── android/               ← projeto Android Studio
```
