/**
 * Site statistics API
 */
import { get } from './client';
import type { SiteStatistics, CountryTrafficMap } from '@/types';

export const fetchSiteStatistics = async (): Promise<SiteStatistics> =>
  get<SiteStatistics>('/api/statistics');

export const fetchCountryTraffic = async (timeRange = 30): Promise<CountryTrafficMap[]> =>
  get<CountryTrafficMap[]>('/api/statistics/country-traffic', { params: { timeRange } });
