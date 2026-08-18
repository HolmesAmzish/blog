plugins {
    alias(libs.plugins.kotlin.jvm)
    alias(libs.plugins.kotlin.spring)
    alias(libs.plugins.kotlin.jpa)
    alias(libs.plugins.kotlin.kapt)
    alias(libs.plugins.spring.boot)
    alias(libs.plugins.spring.dependency.management)
}

kotlin {
    jvmToolchain(21)
    compilerOptions {
        freeCompilerArgs.addAll(
            "-Xjsr305=strict",
            "-Xannotation-default-target=param-property"
        )
    }
}

allOpen {
    annotation("jakarta.persistence.Entity")
    annotation("jakarta.persistence.MappedSuperclass")
    annotation("jakarta.persistence.Embeddable")
}

dependencies {
    implementation(project(":blog-common"))

    // ===== Spring Boot =====
    implementation(libs.bundles.spring.web)
    implementation(libs.bundles.spring.security)
    implementation(libs.spring.boot.starter.data.jpa)
    implementation(libs.spring.boot.starter.graphql)

    // ===== Spring AI =====
    implementation(libs.spring.ai.starter.model.openai)

    // ===== Kotlin / Jackson =====
    implementation(libs.kotlin.reflect)
    implementation(libs.bundles.jackson)

    implementation(libs.querydsl.jpa) { artifact { classifier = "jakarta" } }
    runtimeOnly(libs.postgresql)
    kapt(libs.querydsl.apt) { artifact { classifier = "jakarta" } }

    implementation(libs.thumbnailator)

    implementation(libs.arorms.security)

    testImplementation(libs.spring.graphql.test)
    testImplementation(libs.spring.security.test)
    testImplementation(libs.spring.boot.starter.data.jpa.test)
    testImplementation(libs.spring.boot.starter.webmvc.test)
    testImplementation(libs.kotlin.test.junit5)
    testRuntimeOnly(libs.junit.platform.launcher)
}

dependencyManagement {
    imports {
        mavenBom("org.springframework.ai:spring-ai-bom:${libs.versions.spring.ai.get()}")
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}