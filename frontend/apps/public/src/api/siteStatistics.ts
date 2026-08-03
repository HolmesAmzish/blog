/**
 * Site statistics API
 */
import { get } from './client';
import type { SiteStatistics, CountryTrafficMap } from '@/types';

export const fetchSiteStatistics = async (): Promise<SiteStatistics> =>
  get<SiteStatistics>('/statistics');

export const fetchCountryTraffic = async (timeRange = 30): Promise<CountryTrafficMap[]> =>
  get<CountryTrafficMap[]>('/statistics/country-traffic', { params: { timeRange } });
