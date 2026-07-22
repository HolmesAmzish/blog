plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.kotlin.spring)   // 如果 common 里有 @Component 等需要 open
}

kotlin {
    jvmToolchain(21)
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict")
    }
}

dependencies {
    api(libs.arorms.common)

    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}