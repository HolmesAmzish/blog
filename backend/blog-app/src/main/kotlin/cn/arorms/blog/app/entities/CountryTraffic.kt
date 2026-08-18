package cn.arorms.blog.app.entities

import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "country_traffics")
class CountryTraffic(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false)
    val date: LocalDate,

    @Column(nullable = false, length = 10)
    val countryCode: String,

    val requests: Int,
    val visits: Int
)