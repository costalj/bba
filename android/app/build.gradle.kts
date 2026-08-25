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
        versionCode = 19
        versionName = "1.0.19"
    }

    buildTypes {
        release {
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
