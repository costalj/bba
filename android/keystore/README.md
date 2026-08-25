# Keystore BBA

Arquivo: `bba.jks` — assinatura compartilhada entre builds locais e GitHub Actions.

Todos os APKs publicados na Release usam esta chave, permitindo **atualizar por cima** sem desinstalar.

Se o celular tinha um APK antigo compilado na máquina de outro desenvolvedor (assinatura diferente), é necessário **desinstalar uma vez** e instalar a versão do GitHub.

Senha do repositório (interno BBA): ver `android/app/build.gradle.kts` (`signingConfigs`).
