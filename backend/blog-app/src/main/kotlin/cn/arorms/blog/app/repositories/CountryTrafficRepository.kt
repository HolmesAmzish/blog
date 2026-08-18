package cn.arorms.blog.app.repositories

import cn.arorms.blog.app.entities.CountryTraffic
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.querydsl.QuerydslPredicateExecutor
import org.springframework.stereotype.Repository

@Repository
interface CountryTrafficRepository :
    JpaRepository<CountryTraffic, Long>,
    QuerydslPredicateExecutor<CountryTraffic>,
    cn.arorms.blog.app.repositories.CountryTrafficRepositoryCustom {
}