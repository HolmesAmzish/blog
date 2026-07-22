package cn.arorms.blog.app

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication

@SpringBootApplication
@EnableConfigurationProperties
class AppApplication

fun main(args: Array<String>) {
    runApplication<AppApplication>(*args)
}
