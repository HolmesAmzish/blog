package cn.arorms.blog.backend.properties

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties("storage")
data class StorageProperties(
    /**
     * Folder location for storing files
     */
    var location: String = "upload"
)