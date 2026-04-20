package cn.arorms.blog.backend.dtos;

import org.springframework.data.domain.Page


data class PageResponse<T: Any>(
        val content:List<T>,
        val total: Long,
        val page: Int,
        val size: Int,
        val totalPages: Int,
        val isLast: Boolean
) {
    companion object {
        fun <T: Any> fromPage(page: Page<T>): PageResponse<T> {
            return PageResponse(
                    content = page.content,
                    total = page.totalElements,
                    page = page.number,
                    size = page.size,
                    totalPages = page.totalPages,
                    isLast = page.isLast
            )
        }
    }
}