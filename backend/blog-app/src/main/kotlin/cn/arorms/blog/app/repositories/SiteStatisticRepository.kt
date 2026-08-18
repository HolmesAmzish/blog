package cn.arorms.blog.app.repositories

import cn.arorms.blog.app.entities.SiteStatistics
import org.springframework.data.jpa.repository.JpaRepository
import java.time.LocalDate

/**
 * Repository for SiteStatistics entity
 */
interface SiteStatisticRepository : JpaRepository<SiteStatistics, Long> {

    fun findByDate(date: LocalDate): SiteStatistics?

    fun findAllByOrderByDateDesc(): List<SiteStatistics>

}
