package cn.arorms.blog.backend.entities

import com.fasterxml.jackson.annotation.JsonIgnore
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

    @Column(unique = true, length = 50)
    var slug: String,

    @ManyToMany(mappedBy = "tags")
    @JsonIgnore
    var articles: MutableSet<Article> = mutableSetOf()
)
