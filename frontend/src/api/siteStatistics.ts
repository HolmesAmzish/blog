/**
 * Site Statistics API endpoints
 */
import { get } from './client';
import type { SiteStatistics, CountryTraffic } from '../types';

const BASE_PATH = '/statistics';

/**
 * Get latest site statistics
 */
export const fetchSiteStatistics = async (): Promise<SiteStatistics> => {
  return get<SiteStatistics>(`${BASE_PATH}`);
};

/**
 * Get country traffic data for a given time range
 */
export const fetchCountryTraffic = async (timeRange: number = 30): Promise<CountryTraffic[]> => {
  return get<CountryTraffic[]>(`${BASE_PATH}/country-traffic`, { params: { timeRange } });
};
