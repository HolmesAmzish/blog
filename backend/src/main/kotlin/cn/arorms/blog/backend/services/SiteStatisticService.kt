package cn.arorms.blog.backend.services

import cn.arorms.blog.backend.entities.SiteStatistics
import cn.arorms.blog.backend.repositories.ArticleRepository
import cn.arorms.blog.backend.repositories.CategoryRepository
import cn.arorms.blog.backend.repositories.SiteStatisticRepository
import cn.arorms.blog.backend.repositories.TagRepository
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.LocalDateTime

/**
 * Service for Site Statistics
 */
@Service
class SiteStatisticService(
    private val siteStatisticRepository: SiteStatisticRepository,
    private val articleRepository: ArticleRepository,
    private val categoryRepository: CategoryRepository,
    private val tagRepository: TagRepository
) {

    /**
     * Get latest site statistics
     */
    fun getLatestStatistics(): SiteStatistics? {
        return siteStatisticRepository.findAllByOrderByViewDateDesc().firstOrNull()
    }

    /**
     * Get statistics by date
     */
    fun getStatisticsByDate(date: LocalDate): SiteStatistics? {
        return siteStatisticRepository.findByViewDate(date)
    }

    /**
     * Calculate and save all site statistics
     * Runs daily at 12:00
     */
    @Transactional
    @Scheduled(cron = "0 0 12 * * ?")
    fun updateDailyStatistics() {
        val totalArticleView = articleRepository.getTotalViewCount()
        val totalArticles = articleRepository.count()
        val totalCategories = categoryRepository.count()
        val totalTags = tagRepository.count()

        val statistics = SiteStatistics(
            viewDate = LocalDateTime.now(),
            totalArticleView = totalArticleView,
            totalArticles = totalArticles,
            totalCategories = totalCategories,
            totalTags = totalTags
        )

        siteStatisticRepository.save(statistics)
    }
}
