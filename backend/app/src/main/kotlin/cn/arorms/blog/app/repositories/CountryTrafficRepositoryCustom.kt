package cn.arorms.blog.app.repositories

import cn.arorms.blog.common.responses.CountryTrafficMap

interface CountryTrafficRepositoryCustom {
    fun getAggregatedTrafficMap(timeRange: Int): List<CountryTrafficMap>
}