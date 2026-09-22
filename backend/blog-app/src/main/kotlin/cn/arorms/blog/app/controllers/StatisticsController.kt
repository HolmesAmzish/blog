package cn.arorms.blog.app.controllers

import cn.arorms.blog.common.responses.CountryTrafficMap
import cn.arorms.blog.app.services.CloudflareStatisticsService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

/**
 * REST Controller for Site Statistics
 * @version 1.2.0 2026-09-08
 * @since 2026-05-10
 */
@RestController
@RequestMapping("/api/statistics")
class StatisticsController(
    private val cloudflareStatisticsService: CloudflareStatisticsService,
) {
    @GetMapping("/country-traffic")
    fun getCountryTraffic(
        @RequestParam timeRange: Int
    ): ResponseEntity<List<CountryTrafficMap>> {
        val trafficMap = cloudflareStatisticsService.getCountryTrafficMap(timeRange)
        return ResponseEntity.ok(trafficMap)
    }
}
