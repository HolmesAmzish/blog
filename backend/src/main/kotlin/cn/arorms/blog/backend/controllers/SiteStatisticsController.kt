package cn.arorms.blog.backend.controllers

import cn.arorms.blog.backend.dto.responses.CountryTrafficMap
import cn.arorms.blog.backend.entities.SiteStatistics
import cn.arorms.blog.backend.enums.TimeRange
import cn.arorms.blog.backend.services.SiteStatisticsService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

/**
 * REST Controller for Site Statistics
 */
@RestController
@RequestMapping("/api/statistics")
class SiteStatisticsController(private val siteStatisticService: SiteStatisticsService) {

    @GetMapping
    fun getStatistics(): ResponseEntity<SiteStatistics> {
        val statistics = siteStatisticService.getLatestStatistics()
        return ResponseEntity.ok(statistics)
    }

    @GetMapping("/country-traffic")
    fun getCountryTraffic(
        @RequestParam timeRange: Int
    ): ResponseEntity<List<CountryTrafficMap>> {
        val trafficMap = siteStatisticService.getCountryTrafficMap(timeRange)
        return ResponseEntity.ok(trafficMap)
    }
}
