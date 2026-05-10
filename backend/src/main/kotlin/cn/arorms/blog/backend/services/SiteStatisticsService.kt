package cn.arorms.blog.backend.services

import cn.arorms.blog.backend.dto.AdaptiveGroup
import cn.arorms.blog.backend.dto.CloudflareViewer
import cn.arorms.blog.backend.dto.responses.CountryTrafficMap
import cn.arorms.blog.backend.entities.CountryTraffic
import cn.arorms.blog.backend.enums.TimeRange
import cn.arorms.blog.backend.entities.SiteStatistics
import cn.arorms.blog.backend.repositories.ArticleRepository
import cn.arorms.blog.backend.repositories.CategoryRepository
import cn.arorms.blog.backend.repositories.CountryTrafficRepository
import cn.arorms.blog.backend.repositories.SiteStatisticRepository
import cn.arorms.blog.backend.repositories.TagRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.graphql.client.HttpGraphQlClient
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.OffsetDateTime
import java.time.ZoneOffset

/**
 * Service for Site Statistics
 */
@Service
class SiteStatisticsService(
    private val siteStatisticRepository: SiteStatisticRepository,
    private val articleRepository: ArticleRepository,
    private val categoryRepository: CategoryRepository,
    private val tagRepository: TagRepository,
    private val cloudflareClient: HttpGraphQlClient,
    private val repository: CountryTrafficRepository,
    @Value("\${application.cloudflare.zone-id}") private val zoneId: String
) {

    /**
     * Get latest site statistics
     */
    fun getLatestStatistics(): SiteStatistics? {
        return siteStatisticRepository.findAllByOrderByDateDesc().firstOrNull()
    }

    /**
     * Get statistics by date
     */
    fun getStatisticsByDate(date: LocalDate): SiteStatistics? {
        return siteStatisticRepository.findByDate(date)
    }

    /**
     * Get aggregated country traffic map
     */
    fun getCountryTrafficMap(timeRange: Int): List<CountryTrafficMap> {
        val range = TimeRange.fromInt(timeRange)
            ?: throw IllegalArgumentException("timeRange must be 1, 7, or 30")
        return repository.getAggregatedTrafficMap(range.days)
    }

    /**
     * Calculate and save all site statistics
     * Runs daily at 12:00
     */
    @Transactional
    @Scheduled(cron = "0 0 12 * * ?")
    fun updateDailyStatistics() {
        val totalArticleView = articleRepository.getTotalViewCount()
        val totalArticles = articleRepository.count()
        val totalCategories = categoryRepository.count()
        val totalTags = tagRepository.count()

        val statistics = SiteStatistics(
            date = LocalDateTime.now(),
            totalArticleView = totalArticleView,
            totalArticles = totalArticles,
            totalCategories = totalCategories,
            totalTags = totalTags
        )

        siteStatisticRepository.save(statistics)
    }

    fun getHttpRequestsStatistics(start: OffsetDateTime, end: OffsetDateTime, host: String): List<AdaptiveGroup> {
        val startStr = start.toInstant().toString()
        val endStr = end.toInstant().toString()

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
            .variable("start", startStr)
            .variable("end", endStr)
            .variable("host", host)
            .retrieve("viewer")
            .toEntity(CloudflareViewer::class.java)
            .block()
            ?.zones?.firstOrNull()?.httpRequestsAdaptiveGroups ?: emptyList()
    }

    @Scheduled(cron = "0 5 0 * * ?", zone = "UTC")
    fun syncYesterdayStats() {
        val yesterday = LocalDate.now(ZoneOffset.UTC).minusDays(1)
        val start = yesterday.atStartOfDay().atOffset(ZoneOffset.UTC)
        val end = yesterday.plusDays(1).atStartOfDay().atOffset(ZoneOffset.UTC)

        val groups = getHttpRequestsStatistics(start, end, "blog.arorms.cn")

        val entities = groups.map { group ->
            CountryTraffic(
                date = yesterday,
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
