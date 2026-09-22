/**
 * Site traffic API
 */
import { get } from './client';
import type { CountryTrafficMap } from '@/types';

export const fetchCountryTraffic = async (timeRange = 30): Promise<CountryTrafficMap[]> =>
  get<CountryTrafficMap[]>('/api/statistics/country-traffic', { params: { timeRange } });
