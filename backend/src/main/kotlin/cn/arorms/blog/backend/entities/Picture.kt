package cn.arorms.blog.backend.entities

import com.fasterxml.jackson.annotation.JsonIncludeProperties
import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * Image entity for resource management
 */
@Entity
@Table(name = "pictures")
class Picture(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false, length = 255)
    var filename: String,

    @Column(nullable = false, length = 255)
    var originalFilename: String,

    @Column(nullable = false, length = 100)
    var mimeType: String,

    @Column(nullable = false)
    var size: Long, // File size in bytes

    @Column(nullable = false, length = 500)
    var url: String, // Access URL

    @Column(length = 500)
    var thumbnailUrl: String? = null, // Thumbnail URL

    @Column(length = 500)
    var alt: String? = null, // Alt text for accessibility

    @JsonIncludeProperties("id", "username", "displayName")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploader_id")
    var uploader: User? = null,

    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now()
)