package cn.arorms.blog.app.repositories

import cn.arorms.blog.app.entities.Article
import cn.arorms.blog.app.entities.QArticle.article
import cn.arorms.blog.app.entities.QArticleTranslation.articleTranslation
import cn.arorms.blog.common.enums.Language
import cn.arorms.blog.common.requests.ArticleQueryRequest
import com.querydsl.core.BooleanBuilder
import com.querydsl.jpa.impl.JPAQueryFactory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.support.PageableExecutionUtils

/**
 * @author cacc
 * @version 0.10.1 2026-08-19
 * @since 2026-07-22
 */
class ArticleRepositoryCustomImpl(
    private val queryFactory: JPAQueryFactory,
) : ArticleRepositoryCustom {

    override fun findArticlePage(pageable: Pageable, request: ArticleQueryRequest): Page<Article> {
        val builder = BooleanBuilder()
        builder.and(articleTranslation.language.eq(request.language))

        if (request.categoryId != null) {
            builder.and(article.category.id.eq(request.categoryId))
        }

        if (request.articleStatus != null) {
            builder.and(article.status.eq(request.articleStatus))
        }

        if (!request.keyword.isNullOrBlank()) {
            val keywordPattern = "%${request.keyword}%"

            builder.and(
                articleTranslation.title.like(keywordPattern)
                    .or(articleTranslation.summary.like(keywordPattern))
                    .or(articleTranslation.content.like(keywordPattern))
            )
        }

        val query = queryFactory.selectFrom(article)
            .innerJoin(article.translations, articleTranslation)
            .where(builder)
            .offset(pageable.offset)
            .limit(pageable.pageSize.toLong())

        query.orderBy(article.createdAt.desc())

        val content = query.fetch()

        val countQuery = queryFactory.select(article.count())
            .from(article)
            .innerJoin(article.translations, articleTranslation)
            .where(builder)

        return PageableExecutionUtils.getPage(content, pageable) {
            countQuery.fetchOne() ?: 0L
        }
    }

    override fun findByCategoryId(categoryId: Long, language: Language, pageable: Pageable): Page<Article> {
        val builder = BooleanBuilder()
        builder.and(article.category.id.eq(categoryId))
            .and(articleTranslation.language.eq(language))

        val query = queryFactory.selectFrom(article)
            .innerJoin(article.translations, articleTranslation)
            .where(builder)
            .offset(pageable.offset)
            .limit(pageable.pageSize.toLong())
            .orderBy(article.createdAt.desc())

        val content = query.fetch()

        val countQuery = queryFactory.select(article.count())
            .from(article)
            .innerJoin(article.translations, articleTranslation)
            .where(builder)

        return PageableExecutionUtils.getPage(content, pageable) {
            countQuery.fetchOne() ?: 0L
        }
    }

    override fun countByCategoryId(categoryId: Long): Long =
        queryFactory.select(article.count())
            .from(article)
            .where(article.category.id.eq(categoryId))
            .fetchOne() ?: 0L

    override fun getTotalViewCount(): Long =
        queryFactory.select(article.viewCount.sum()).from(article).fetchOne() ?: 0L
}