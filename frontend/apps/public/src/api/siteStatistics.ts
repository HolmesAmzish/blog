/**
 * Site statistics API
 */
import { get } from './client';
import type { SiteStatistics, CountryTraffic } from '@blog/types';

export const fetchSiteStatistics = async (): Promise<SiteStatistics> =>
  get<SiteStatistics>('/statistics');

export const fetchCountryTraffic = async (timeRange = 30): Promise<CountryTraffic[]> =>
  get<CountryTraffic[]>('/statistics/country-traffic', { params: { timeRange } });
