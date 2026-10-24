pluginManagement {
    repositories {
        gradlePluginPortal()
        mavenCentral()
        maven("https://plugins.gradle.org/m2/")
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        mavenCentral()
        maven("https://jitpack.io")
        maven("https://plugins.gradle.org/m2/")
    }
}

rootProject.name = "dewey"

include(
    "openapi",
    "openapi-models",
    "server",
    "auth",
    "auth-models",
    "client",
    "taglib",
)
