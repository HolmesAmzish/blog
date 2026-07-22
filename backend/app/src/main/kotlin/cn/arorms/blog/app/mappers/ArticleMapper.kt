package cn.arorms.blog.app.mappers

import cn.arorms.blog.app.entities.*
import cn.arorms.blog.common.enums.Language
import cn.arorms.blog.common.responses.*
import kotlin.collections.get

// Article -> ArticleSummaryVo
fun Article.toSummaryVo(lang: Language = Language.EN): ArticleSummaryVo {
    val translation = translations[lang] ?: translations[Language.EN]

    return ArticleSummaryVo(
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

// Article -> ArticleVo
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

// Category -> CategoryVo
fun Category.toVo(lang: Language = Language.EN): CategoryVo {
    val categoryName = this.names[lang]
        ?: this.names[Language.EN]
        ?: this.names.values.firstOrNull()
        ?: ""

    return CategoryVo(
        id = this.id,
        name = categoryName,
        slug = this.slug,
        parentId = this.parent?.id
    )
}

// Tag -> TagVo
fun Tag.toVo(): TagVo = TagVo(id = id, name = name, slug = slug)