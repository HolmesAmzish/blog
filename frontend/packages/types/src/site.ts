/**
 * Site statistics and traffic types
 */

export interface SiteStatistics {
  id: number;
  viewDate: string;
  totalArticleView: number;
  totalArticles: number;
  totalCategories: number;
  totalTags: number;
}

export interface CountryTraffic {
  countryCode: string;
  visits: number;
}