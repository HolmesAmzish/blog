package cn.arorms.blog.app

import cn.arorms.blog.backend.services.SiteStatisticsService
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import java.time.Instant
import java.time.ZoneOffset
import java.time.temporal.ChronoUnit

@SpringBootTest
class CloudflareStatisticsServiceTest {

    @Autowired
    private lateinit var siteStatisticService: SiteStatisticsService

    @Test
    fun testGetHttpRequestsStatistics() {
        val endTime = Instant.now().truncatedTo(ChronoUnit.DAYS)
        val startTime = endTime.minus(1, ChronoUnit.DAYS)
        val recordDate = startTime.atZone(ZoneOffset.UTC).toLocalDate()

        val groups = siteStatisticService.getHttpRequestsStatistics(startTime, endTime, "blog.arorms.cn")

        println("=== Cloudflare HTTP Requests Statistics ===")
        println("Date range: $startTime ~ $endTime")
        println("Local Date: $recordDate")
        println("Host: blog.arorms.cn")
        println("Groups returned: ${groups.size}")
        groups.forEach { group ->
            println("  Country: ${group.dimensions.clientCountryName}, Requests: ${group.count}, Visits: ${group.sum.visits}")
        }
    }

    @Test
    fun testStatisticsStore() {
        siteStatisticService.syncYesterdayStats()
    }
}
