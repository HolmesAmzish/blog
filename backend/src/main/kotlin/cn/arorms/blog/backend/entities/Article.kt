package cn.arorms.blog.backend.entities

import cn.arorms.blog.backend.enums.ArticleStatus
import cn.arorms.blog.backend.enums.Language
import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonIncludeProperties
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

    @Column(name = "slug", unique = true, length = 255)
    var slug: String,

    @Column(nullable = false, length = 255)
    var title: String,

    @Column(length = 500)
    var summary: String? = null,

    @Column(columnDefinition = "TEXT")
    var content: String? = null,

    @Enumerated(EnumType.STRING)
    @Column(name = "language", length = 10)
    var language: Language = Language.EN,

    @Column(name = "created_at")
    var createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at")
    var updatedAt: LocalDateTime = LocalDateTime.now(),

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    var status: ArticleStatus = ArticleStatus.DRAFT,

    @Column(name = "view_count")
    var viewCount: Long = 0,


    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIncludeProperties("id", "name", "slug")
    @JoinColumn(name = "category_id")
    var category: Category? = null,

    @JsonIncludeProperties("id", "username", "displayName")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "author_id")
    var author: User? = null,

    @ManyToMany
    @JoinTable(
        name = "article_tags_map",
        joinColumns = [JoinColumn(name = "article_id")],
        inverseJoinColumns = [JoinColumn(name = "tag_id")]
    )
    var tags: MutableSet<Tag> = mutableSetOf()
) {
    @PreUpdate
    fun onUpdate() {
        updatedAt = LocalDateTime.now()
    }
}