package cn.arorms.blog.app.repositories

import cn.arorms.blog.app.entities.QCountryTraffic
import cn.arorms.blog.common.responses.CountryTrafficMap
import com.querydsl.core.types.Projections
import com.querydsl.jpa.impl.JPAQueryFactory
import java.time.LocalDate
import java.time.ZoneOffset

class CountryTrafficRepositoryCustomImpl(
    private val queryFactory: JPAQueryFactory
) : cn.arorms.blog.app.repositories.CountryTrafficRepositoryCustom {

    override fun getAggregatedTrafficMap(timeRange: Int): List<CountryTrafficMap> {
        val qTraffic = QCountryTraffic.countryTraffic

        val startDate = LocalDate.now(ZoneOffset.UTC).minusDays(timeRange.toLong())

        return queryFactory
            .select(
                Projections.constructor(
                    CountryTrafficMap::class.java,
                    qTraffic.countryCode,
                    qTraffic.visits.sum()
                )
            )
            .from(qTraffic)
            .where(qTraffic.date.goe(startDate))
            .groupBy(qTraffic.countryCode)
            .fetch()
    }
}