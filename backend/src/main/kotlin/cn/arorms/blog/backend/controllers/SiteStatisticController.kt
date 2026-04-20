package cn.arorms.blog.backend.controllers

import cn.arorms.blog.backend.entities.SiteStatistics
import cn.arorms.blog.backend.services.SiteStatisticService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

/**
 * REST Controller for Site Statistics
 */
@RestController
class SiteStatisticController(private val siteStatisticService: SiteStatisticService) {

    @GetMapping("/api/statistics")
    fun getStatistics(): ResponseEntity<SiteStatistics> {
        val statistics = siteStatisticService.getLatestStatistics()
        return ResponseEntity.ok(statistics)
    }
}
