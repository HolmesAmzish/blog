package cn.arorms.blog.app.repositories

import cn.arorms.blog.app.entities.OutboundRequest
import cn.arorms.blog.common.enums.ProcessStatus
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

/**
 * @version 1.2.0 2026-09-08
 * @since 2026-09-08
 */
@Repository
interface OutboundRequestRepository : JpaRepository<OutboundRequest, Long> {
    fun findByStatus(status: ProcessStatus, pageable: Pageable): Page<OutboundRequest>
}