/**
 * Site Statistics API endpoints
 */
import { get } from './client';
import type { SiteStatistics } from '../types';

const BASE_PATH = '/statistics';

/**
 * Get latest site statistics
 */
export const fetchSiteStatistics = async (): Promise<SiteStatistics> => {
  return get<SiteStatistics>(`${BASE_PATH}`);
};
