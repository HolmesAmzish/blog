package cn.arorms.blog.backend.entities

import cn.arorms.blog.backend.enums.ArticleStatus
import cn.arorms.blog.backend.enums.Language
import com.fasterxml.jackson.annotation.JsonIncludeProperties
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "articles")
class Article(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name = "slug", unique = true, length = 255)
    var slug: String,

    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at")
    var updatedAt: LocalDateTime = LocalDateTime.now(),

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    var status: ArticleStatus? = ArticleStatus.DRAFT,

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

    @OneToMany(mappedBy = "article", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.LAZY)
    @MapKeyEnumerated(EnumType.STRING)
    @MapKey(name = "language")
    val translations: MutableMap<Language, ArticleTranslation> = mutableMapOf(),

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
