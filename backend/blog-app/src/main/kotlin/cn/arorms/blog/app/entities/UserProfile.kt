package cn.arorms.blog.app.entities

import jakarta.persistence.*

/**
 * User entity for authentication and authorization
 */
@Entity
@Table(name = "user_profiles")
class UserProfile(
    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

//    @Column(nullable = false, unique = true, length = 50)
    var username: String,

//    @Column(nullable = false, unique = true, length = 100)
    var email: String,

//    @Column(length = 100)
//    var displayName: String? = null,

//    @JsonIgnore
//    @OneToMany(mappedBy = "author")
//    var articles: MutableSet<Article> = mutableSetOf()
)