# BBA — Batalhão de Bombeiros Ambiental

App mobile para vistoria de árvores com formulário de avaliação de risco, pontuação automática, recomendação de supressão ou manutenção, login por CPF/senha e painel de administração de usuários.

**Versão atual:** 1.0.4  
**Pasta do projeto:** `c:\Users\leonardo.costa\Documents\python\bba`

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend | Python + Flask |
| Banco de dados | SQLite (web) / localStorage (APK offline) |
| Frontend | HTML/CSS/JS (mobile-first) |
| APK | WebView Android 100% offline |

## Acesso e usuários

| Item | Valor |
|------|-------|
| Login admin padrão | CPF `000.000.000-00` · senha `admin123` |
| Perfis | Administrador, Chefe de Socorro, Condutor de viatura, Comandante de guarnição |
| Assinatura do laudo | Apenas **Chefe de Socorro** |

O administrador cadastra usuários em **Admin** (nome, matrícula, CPF, posto, perfil, senha).

## Instalação — versão web (Flask)

```powershell
cd c:\Users\leonardo.costa\Documents\python\bba
.\venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

Acesse: http://localhost:5000 (redireciona para login)

Banco: `instance/vistorias.db` (tabela `usuarios` criada automaticamente)

## Instalação — APK offline (celular)

Arquivo pronto: **`dist/BBA-1.0.4.apk`**

```powershell
.\scripts\build_apk.ps1
```

Não precisa de PC, Wi-Fi ou Flask. Dados e usuários ficam no celular (localStorage).

## Estrutura principal

```
bba/
├── config.yaml              # Critérios, limiares, prefeitura
├── app/                     # Flask (web)
│   ├── auth_utils.py        # Postos, perfis, hash CPF/senha
│   ├── database.py          # SQLite + usuarios
│   ├── routes.py            # Login, admin, vistorias
│   └── templates/           # login, admin, perfil, arvores...
├── android/app/src/main/assets/www/   # App offline (APK)
│   ├── login.html, admin.html, perfil.html
│   └── js/auth.js           # Login e CRUD usuários offline
├── dist/BBA-1.0.4.apk       # APK para instalar
├── scripts/build_apk.ps1    # Gerar novo APK
└── run.py
```

## Pontuação (vistoria de árvores)

6 critérios de **0 a 3** · máximo **18 pontos**

| Pontuação | Recomendação |
|-----------|-------------|
| 0–5 | Manutenção preventiva |
| 6–10 | Podas / acompanhamento |
| 11–14 | Intervenção urgente |
| 15–18 | Supressão recomendada |

Ajuste em **`config.yaml`**.

## Recursos implementados

- Login CPF + senha (obrigatório)
- Administração de usuários (postos e perfis militares)
- Vistoria de árvores com GPS, fotos e histórico
- Assinatura digital — somente Chefe de Socorro
- Exportação PDF do laudo
- APK offline instalável sem Play Store

## Próximos ajustes possíveis

- Remover hint de senha admin do login em produção
- Sincronização web ↔ celular
- Novos módulos (Treinamentos, Viaturas, etc.)
- Alteração de senha pelo próprio usuário
