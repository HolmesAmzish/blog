package cn.arorms.blog.backend.entities

import jakarta.persistence.*

/**
 * Tag entity for article categorization
 */
@Entity
@Table(name = "tags")
class Tag(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false, unique = true, length = 50)
    var name: String,

    @Column(length = 100)
    var description: String? = null,

    @Column(unique = true, length = 50)
    var slug: String,

    @OneToMany(mappedBy = "tag", cascade = [CascadeType.ALL])
    var articleTags: MutableSet<ArticleTag> = mutableSetOf()
)
