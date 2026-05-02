package cn.arorms.blog.backend.repositories

import cn.arorms.blog.backend.entities.Article
import cn.arorms.blog.backend.entities.ArticleTranslation
import cn.arorms.blog.backend.enums.ArticleStatus
import cn.arorms.blog.backend.enums.Language
import jakarta.persistence.criteria.Join
import jakarta.persistence.criteria.Predicate
import org.springframework.data.jpa.domain.Specification

object ArticleSpecifications {

    fun findPublishedArticles(
        language: Language,
        keyword: String?,
        categoryId: Long?
    ): Specification<Article> {
        return Specification { root, _, cb ->
            val predicates = mutableListOf<Predicate>()

            // Status must be PUBLISHED
            predicates.add(cb.equal(root.get<ArticleStatus>("status"), ArticleStatus.PUBLISHED))

            // Category filter
            if (categoryId != null) {
                predicates.add(cb.equal(root.get<Article>("category").get<Long>("id"), categoryId))
            }

            // Keyword search - only search if keyword is not blank
            if (!keyword.isNullOrBlank()) {
                val translationsJoin: Join<Article, ArticleTranslation> = root.join("translations")
                val titlePath = translationsJoin.get<String>("title")
                val summaryPath = translationsJoin.get<String>("summary")
                val langPath = translationsJoin.get<Language>("language")

                val keywordPattern = "%$keyword%"
                predicates.add(
                    cb.and(
                        cb.equal(langPath, language),
                        cb.or(
                            cb.like(titlePath, keywordPattern),
                            cb.like(summaryPath, keywordPattern)
                        )
                    )
                )
            }

            cb.and(*predicates.toTypedArray())
        }
    }
}
