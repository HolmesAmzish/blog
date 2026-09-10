package cn.arorms.blog.app.entities

import cn.arorms.blog.common.enums.ProcessStatus
import cn.arorms.framework.common.domain.BaseEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Table
import java.time.Instant

/**
 * @version 1.2.0 2026-09-08
 * @since 2026-09-08
 */
@Entity @Table(name = "tasks")
class OutboundRequest (
//    val method: String,

    @Column(name = "payload_json")
    val payloadJson: String,

    var status: ProcessStatus,

//    @Column(name = "retry_count")
//    var retryCount: Int = 0,
    val expiresAt: Instant? = null,
) : BaseEntity() {
}