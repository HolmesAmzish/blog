package cn.arorms.blog.backend.repositories

import cn.arorms.blog.backend.entities.QArticle
import cn.arorms.blog.backend.enums.ArticleStatus
import cn.arorms.blog.backend.enums.Language
import com.querydsl.core.BooleanBuilder
import com.querydsl.core.types.Predicate

object ArticlePredicates {
    fun findPublishedArticles(language: Language, keyword: String?, categoryId: Long?): Predicate {
        val article = QArticle.article
        val translation = article.translations.get(language)

        val builder = BooleanBuilder()

        builder.and(article.status.eq(ArticleStatus.PUBLISHED))

        if (categoryId != null) {
            builder.and(article.category.id.eq(categoryId))
        }

        if (!keyword.isNullOrBlank()) {
            val keywordPattern = "%$keyword%"

            builder.and(
                translation.title.like(keywordPattern)
                    .or(translation.summary.like(keywordPattern))
                    .or(translation.content.like(keywordPattern))
            )
        }

        return builder
    }
}