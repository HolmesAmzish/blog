package cn.arorms.blog.backend.entities

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

    @Column(length = 200)
    var description: String? = null,

    @Column(unique = true, length = 50)
    var slug: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    var parent: Category? = null,

    @OneToMany(mappedBy = "parent", cascade = [CascadeType.ALL])
    var children: MutableSet<Category> = mutableSetOf(),

    @OneToMany(mappedBy = "category")
    var articles: MutableSet<Article> = mutableSetOf()
)