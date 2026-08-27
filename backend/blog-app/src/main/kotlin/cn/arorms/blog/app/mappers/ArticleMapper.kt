package cn.arorms.blog.app.mappers

import cn.arorms.blog.app.entities.Article
import cn.arorms.blog.common.enums.Language
import cn.arorms.blog.common.responses.ArticleSummaryVo
import cn.arorms.blog.common.responses.ArticleVo
import cn.arorms.blog.common.responses.CategoryVo

/**
 * @version 1.0.0 2026-08-27
 * @since 2026-03-09
 */
fun Article.toSummaryVo(lang: Language = Language.EN): ArticleSummaryVo {
    val translation = translations[lang] ?: translations[Language.EN]

    return ArticleSummaryVo(
        id = this.id!!,
        slug = this.slug,
        title = translation?.title ?: "",
        summary = translation?.summary,
        status = this.status,
        viewCount = this.viewCount,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
        category = this.category?.toVo(lang),
        tags = this.tags.map { it.toVo() }
    )
}

fun Article.toVo(lang: Language = Language.EN): ArticleVo {
    val translation = translations[lang] ?: translations[Language.EN]

    return ArticleVo(
        id = this.id!!,
        slug = this.slug,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
        isAiTranslated = translation?.isAiTranslated ?: false,
        viewCount = this.viewCount,
        title = translation?.title ?: "",
        summary = translation?.summary ?: "",
        content = translation?.content ?: "",
        language = translation?.language ?: lang,
        category = this.category?.toVo(lang)
            ?: CategoryVo(id = null, name = "", slug = "", parentId = null),
        tags = this.tags.map { it.toVo() }
    )
}