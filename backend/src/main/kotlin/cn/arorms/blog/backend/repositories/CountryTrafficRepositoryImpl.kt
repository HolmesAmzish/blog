package cn.arorms.blog.backend.repositories

import cn.arorms.blog.backend.dto.responses.CountryTrafficMap
import cn.arorms.blog.backend.entities.QCountryTraffic
import com.querydsl.core.types.Projections
import com.querydsl.jpa.impl.JPAQueryFactory
import java.time.LocalDate
import java.time.ZoneOffset

class CountryTrafficRepositoryImpl(
    private val queryFactory: JPAQueryFactory
) : CountryTrafficRepositoryCustom {

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