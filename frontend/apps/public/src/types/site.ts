/**
 * Site statistics and traffic types
 * Mirrors backend SiteStatistics entity and CountryTrafficMap response
 */

export interface SiteStatistics {
  id: number | null;
  date: string;
  totalArticleView: number;
  totalArticles: number;
  totalCategories: number;
  totalTags: number;
}

export interface CountryTrafficMap {
  countryCode: string;
  visits: number;
}
