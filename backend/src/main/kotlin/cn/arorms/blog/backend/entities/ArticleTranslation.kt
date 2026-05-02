package cn.arorms.blog.backend.entities

import cn.arorms.blog.backend.enums.Language
import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*

@Entity
@Table(
    name = "article_translations",
    uniqueConstraints = [
        UniqueConstraint(columnNames = ["article_id", "language"])
    ]
)
class ArticleTranslation(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Enumerated(EnumType.STRING)
    @Column(name = "language", length = 10, nullable = false)
    val language: Language,

    @Column(nullable = false, length = 255)
    var title: String,

    @Column(length = 500)
    var summary: String? = null,

    @Column(columnDefinition = "TEXT")
    var content: String? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "article_id", nullable = false)
    @JsonIgnore
    val article: Article
)