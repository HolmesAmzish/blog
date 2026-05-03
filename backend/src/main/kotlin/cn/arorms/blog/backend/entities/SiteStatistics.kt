package cn.arorms.blog.backend.entities

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import java.time.LocalDate
import java.time.LocalDateTime

@Entity
class SiteStatistics (
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    val viewDate: LocalDateTime = LocalDateTime.now(),

    var totalArticleView: Long = 0,

    var totalArticles: Long = 0,
    var totalCategories: Long = 0,
    var totalTags: Long = 0,
)