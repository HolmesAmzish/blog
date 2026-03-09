plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "0.8.0"
}
rootProject.name = "blog"
include("backend")
// frontend is a standalone Node.js/React project, managed by npm separately
