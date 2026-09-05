plugins {
    id("com.android.application")
}

android {
    namespace = "com.vistoria.arborea"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.vistoria.arborea"
        minSdk = 24
        targetSdk = 34
        versionCode = 27
        versionName = "1.0.27"
    }

    signingConfigs {
        create("bba") {
            storeFile = file("../keystore/bba.jks")
            storePassword = "bba2024release"
            keyAlias = "bba"
            keyPassword = "bba2024release"
        }
    }

    buildTypes {
        debug {
            signingConfig = signingConfigs.getByName("bba")
        }
        release {
            signingConfig = signingConfigs.getByName("bba")
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

dependencies {
    implementation("androidx.appcompat:appcompat:1.6.1")
}
