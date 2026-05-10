package cn.arorms.blog.backend.repositories

import cn.arorms.blog.backend.dto.responses.CountryTrafficMap

interface CountryTrafficRepositoryCustom {
    fun getAggregatedTrafficMap(timeRange: Int): List<CountryTrafficMap>
}