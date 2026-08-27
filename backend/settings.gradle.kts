pluginManagement {
    repositories {
        mavenLocal()
        gradlePluginPortal()
        mavenCentral()
        maven { url = uri("https://maven.aliyun.com/repository/gradle-plugin") }
    }
}

dependencyResolutionManagement {
    repositories {
        maven { url = uri("https://maven.aliyun.com/repository/public") }
        mavenCentral()
        maven { url = uri("https://repo.spring.io/milestone") }
        maven {
            url = uri("https://nexus.arorms.cn/repository/maven-public/")
            credentials {
                username = providers.gradleProperty("nexusUsername").orNull ?: ""
                password = providers.gradleProperty("nexusPassword").orNull ?: ""
            }
        }
    }
}

rootProject.name = "backend"
include("blog-common", "blog-app")