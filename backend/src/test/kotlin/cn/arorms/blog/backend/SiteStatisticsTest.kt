package cn.arorms.blog.backend

import cn.arorms.blog.backend.services.SiteStatisticService
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class SiteStatisticsTest {

    @Autowired
    private lateinit var siteStatisticService: SiteStatisticService

    @Test
    fun testUpdateDailyStatistics() {

        siteStatisticService.updateDailyStatistics()

        val statistics = siteStatisticService.getLatestStatistics()
        assert(statistics != null) { "Statistics should not be null" }
        assert(statistics!!.totalArticles >= 0) { "Total articles should be >= 0" }
        assert(statistics.totalCategories >= 0) { "Total categories should be >= 0" }
        assert(statistics.totalTags >= 0) { "Total tags should be >= 0" }

        println("Statistics updated successfully:")
        println("  Total Articles: ${statistics.totalArticles}")
        println("  Total Categories: ${statistics.totalCategories}")
        println("  Total Tags: ${statistics.totalTags}")
        println("  Total Article View: ${statistics.totalArticleView}")
    }
}
