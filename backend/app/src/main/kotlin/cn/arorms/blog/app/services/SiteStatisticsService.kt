package cn.arorms.blog.app.services

import cn.arorms.blog.app.repositories.CountryTrafficRepository
import cn.arorms.blog.app.repositories.SiteStatisticRepository
import cn.arorms.blog.app.entities.SiteStatistics
import cn.arorms.blog.common.enums.TimeRange
import cn.arorms.blog.common.responses.CountryTrafficMap
import org.springframework.stereotype.Service
import java.time.LocalDate

/**
 * Service for Site Statistics
 * @version 0.9.1 2026-08-03
 */
@Service
class SiteStatisticsService(
    private val siteStatisticRepository: SiteStatisticRepository,
    private val repository: CountryTrafficRepository,
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
}
