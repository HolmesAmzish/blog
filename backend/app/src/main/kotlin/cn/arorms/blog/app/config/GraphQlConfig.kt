package cn.arorms.blog.app.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.graphql.client.HttpGraphQlClient
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.http.HttpHeaders

@Configuration
class GraphQlConfig (
    @Value("\${application.cloudflare.token}")
    private var cloudflareToken: String
) {
    @Bean
    fun cloudflareClient(): HttpGraphQlClient {
        val webClient = WebClient.builder()
            .baseUrl("https://api.cloudflare.com/client/v4/graphql")
            .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer $cloudflareToken")
            .build()
        return HttpGraphQlClient.builder(webClient).build()
    }
}