package cn.arorms.blog.app.properties

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties("storage")
data class StorageProperties(
    /**
     * Folder location for storing files
     */
    var location: String = "upload"
)