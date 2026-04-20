package cn.arorms.blog.backend.entities

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*

/**
 * Category entity for article classification
 */
@Entity
@Table(name = "categories")
class Category(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false, unique = true, length = 50)
    var name: String,

    @Column(unique = true, length = 50)
    var slug: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "parent_id")
    var parent: Category? = null,

    @OneToMany(mappedBy = "parent", cascade = [CascadeType.ALL])
//    @JsonIgnore
    var children: MutableSet<Category> = mutableSetOf(),

    @OneToMany(mappedBy = "category")
    @JsonIgnore
    var articles: MutableSet<Article> = mutableSetOf()
)