package cn.arorms.blog.app.schedulers

import cn.arorms.blog.app.entities.CountryTraffic
import cn.arorms.blog.app.repositories.CountryTrafficRepository
import cn.arorms.blog.common.responses.AdaptiveGroup
import cn.arorms.blog.common.responses.CloudflareViewer
import org.springframework.beans.factory.annotation.Value
import org.springframework.graphql.client.HttpGraphQlClient
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.time.Instant
import java.time.ZoneOffset
import java.time.temporal.ChronoUnit

/**
 * CloudFlare statistics fetch task
 * @version 0.9.1 2026-08-03
 */
@Component
class CloudFlareStatisticsTask(
    private val cloudflareClient: HttpGraphQlClient,
    private val repository: CountryTrafficRepository,
    @Value($$"${application.cloudflare.zone-id}") private val zoneId: String
) {

    fun getHttpRequestsStatistics(startTime: Instant, endTime: Instant, host: String): List<AdaptiveGroup> {
        val startTimeStr = startTime.toString()
        val endTimeStr = endTime.toString()

        val query = """
            query GetStats(${"$"}zoneTag: String!, ${"$"}start: String!, ${"$"}end: String!, ${"$"}host: String!) {
              viewer {
                zones(filter: { zoneTag: ${"$"}zoneTag }) {
                  httpRequestsAdaptiveGroups(
                    limit: 100,
                    filter: {
                      datetime_geq: ${"$"}start,
                      datetime_leq: ${"$"}end,
                      clientRequestHTTPHost: ${"$"}host
                    }
                  ) {
                    dimensions { clientCountryName }
                    count
                    sum { visits }
                  }
                }
              }
            }
        """.trimIndent()

        return cloudflareClient.document(query)
            .variable("zoneTag", zoneId)
            .variable("start", startTimeStr)
            .variable("end", endTimeStr)
            .variable("host", host)
            .retrieve("viewer")
            .toEntity(CloudflareViewer::class.java)
            .block()
            ?.zones?.firstOrNull()?.httpRequestsAdaptiveGroups ?: emptyList()
    }

    @Scheduled(cron = "0 5 0 * * ?", zone = "UTC")
    fun syncYesterdayStats() {

        val endTime = Instant.now().truncatedTo(ChronoUnit.DAYS)
        val startTime = endTime.minus(1, ChronoUnit.DAYS)


        val groups = getHttpRequestsStatistics(startTime, endTime, "blog.arorms.cn")

        val entities = groups.map { group ->
            CountryTraffic(
                date = startTime.atZone(ZoneOffset.UTC).toLocalDate(),
                countryCode = group.dimensions.clientCountryName ?: "XX",
                requests = group.count,
                visits = group.sum.visits
            )
        }

        if (entities.isNotEmpty()) {
            repository.saveAll(entities)
        }
    }
}