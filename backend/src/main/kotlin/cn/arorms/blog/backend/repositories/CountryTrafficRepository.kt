package cn.arorms.blog.backend.repositories

import cn.arorms.blog.backend.entities.CountryTraffic
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.querydsl.QuerydslPredicateExecutor
import org.springframework.stereotype.Repository

@Repository
interface CountryTrafficRepository :
    JpaRepository<CountryTraffic, Long>,
    QuerydslPredicateExecutor<CountryTraffic>,
    CountryTrafficRepositoryCustom {
}