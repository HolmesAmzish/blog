package cn.arorms.blog.app.services

import cn.arorms.blog.common.responses.CountryTrafficMap
import java.time.LocalDate

/**
 * @version 1.2.0 2026-09-08
 * @since 2026-09-08
 */
interface CloudflareStatisticsService {
    fun getCountryTrafficMap(timeRange: Int): List<CountryTrafficMap>
    fun syncStatistics(date: LocalDate)
}