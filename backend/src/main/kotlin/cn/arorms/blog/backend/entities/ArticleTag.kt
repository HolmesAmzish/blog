package cn.arorms.blog.backend.entities

import jakarta.persistence.*

/**
 * Junction entity for Article-Tag relationship
 * Replaces @ManyToMany for better control over the relationship
 */
@Entity
@Table(name = "article_tags", uniqueConstraints = [
    UniqueConstraint(columnNames = ["article_id", "tag_id"])
])
class ArticleTag(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "article_id", nullable = false)
    var article: Article,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id", nullable = false)
    var tag: Tag
)