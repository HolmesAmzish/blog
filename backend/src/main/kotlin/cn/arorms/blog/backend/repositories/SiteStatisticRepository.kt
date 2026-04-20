package cn.arorms.blog.backend.repositories

import cn.arorms.blog.backend.entities.SiteStatistics
import org.springframework.data.jpa.repository.JpaRepository
import java.time.LocalDate

/**
 * Repository for SiteStatistics entity
 */
interface SiteStatisticRepository : JpaRepository<SiteStatistics, Long> {

    fun findByViewDate(date: LocalDate): SiteStatistics?

    fun findAllByOrderByViewDateDesc(): List<SiteStatistics>

}
