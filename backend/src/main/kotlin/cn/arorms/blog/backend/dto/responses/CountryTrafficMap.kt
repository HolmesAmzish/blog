package cn.arorms.blog.backend.dto.responses

data class CountryTrafficMap(
    val countryCode: String,
    val visits: Int,
)
