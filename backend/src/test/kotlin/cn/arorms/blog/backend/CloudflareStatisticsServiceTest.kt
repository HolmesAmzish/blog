package cn.arorms.blog.backend

import cn.arorms.blog.backend.services.SiteStatisticsService
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import java.time.LocalDate
import java.time.ZoneOffset

@SpringBootTest
class CloudflareStatisticsServiceTest {

    @Autowired
    private lateinit var siteStatisticService: SiteStatisticsService

    @Test
    fun testGetHttpRequestsStatistics() {
        val yesterday = LocalDate.now(ZoneOffset.UTC).minusDays(1)
        val start = yesterday.atStartOfDay().atOffset(ZoneOffset.UTC)
        val end = yesterday.plusDays(1).atStartOfDay().atOffset(ZoneOffset.UTC)

        val groups = siteStatisticService.getHttpRequestsStatistics(start, end, "blog.arorms.cn")

        println("=== Cloudflare HTTP Requests Statistics ===")
        println("Date range: $start ~ $end")
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
