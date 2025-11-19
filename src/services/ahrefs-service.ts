/**
 * Ahrefs service for fetching SEO and backlink metrics
 */

import { MCPClient } from '../clients/mcp-client.js';
import { AhrefsMetrics } from '../types.js';

export class AhrefsService {
  constructor(private client: MCPClient) {}

  async getDomainMetrics(domain: string): Promise<AhrefsMetrics> {
    try {
      const [domainData, organicData] = await Promise.all([
        this.client.callTool('get_domain_rating', { domain }),
        this.client.callTool('get_organic_keywords', { domain }).catch(() => null),
      ]);

      const metrics: AhrefsMetrics = {
        domain,
        timestamp: new Date().toISOString(),
        domainRating: domainData.domainRating,
        ahrefsRank: domainData.ahrefsRank,
        backlinks: domainData.backlinks,
        referringDomains: domainData.referringDomains,
      };

      if (organicData) {
        metrics.organicKeywords = organicData.organicKeywords;
        metrics.organicTraffic = organicData.organicTraffic;
        metrics.organicValue = organicData.organicValue;
      }

      return metrics;
    } catch (error) {
      console.error(`Error fetching Ahrefs data for ${domain}:`, error);
      return {
        domain,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getBacklinks(domain: string, limit: number = 100) {
    return this.client.callTool('get_backlinks', { domain, limit });
  }

  async getReferringDomains(domain: string) {
    return this.client.callTool('get_referring_domains', { domain });
  }

  async getTopPages(domain: string, limit: number = 50) {
    return this.client.callTool('get_top_pages', { domain, limit });
  }

  async getTopKeywords(domain: string, limit: number = 100) {
    return this.client.callTool('get_top_keywords', { domain, limit });
  }

  async getOrganicKeywords(domain: string) {
    return this.client.callTool('get_organic_keywords', { domain });
  }
}
