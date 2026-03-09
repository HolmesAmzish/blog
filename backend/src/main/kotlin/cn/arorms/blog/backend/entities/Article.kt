package cn.arorms.blog.backend.entities

import cn.arorms.blog.backend.enums.ArticleStatus
import cn.arorms.blog.backend.enums.Language
import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * Article entity representing a blog post
 */
@Entity
@Table(name = "articles")
class Article(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false, length = 255)
    var title: String,

    @Column(length = 500)
    var summary: String? = null,

    @Column(columnDefinition = "TEXT")
    var content: String? = null,

    @Column(name = "original_content", columnDefinition = "TEXT")
    var originalContent: String? = null,

    @Column(name = "slug", unique = true, length = 255)
    var slug: String,

    @Enumerated(EnumType.STRING)
    @Column(name = "language", length = 10)
    var language: Language = Language.ZH,

    @Column(name = "created_at")
    var createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at")
    var updatedAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "published_at")
    var publishedAt: LocalDateTime? = null,

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    var status: ArticleStatus = ArticleStatus.DRAFT,

    @Column(name = "view_count")
    var viewCount: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    var category: Category? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    var author: User? = null,

    @OneToMany(mappedBy = "article", cascade = [CascadeType.ALL], orphanRemoval = true)
    var articleTags: MutableSet<ArticleTag> = mutableSetOf()
) {
    @PreUpdate
    fun onUpdate() {
        updatedAt = LocalDateTime.now()
    }
}