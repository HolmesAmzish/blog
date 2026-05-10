package cn.arorms.blog.backend.enums

enum class TimeRange(val days: Int) {
    DAY(1),
    WEEK(7),
    MONTH(30);

    companion object {
        fun fromInt(value: Int) = entries.find { it.days == value }
    }
}
