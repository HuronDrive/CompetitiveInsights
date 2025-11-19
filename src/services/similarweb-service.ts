/**
 * SimilarWeb service for fetching traffic and engagement metrics
 */

import { MCPClient } from '../clients/mcp-client.js';
import { SimilarWebMetrics } from '../types.js';

export class SimilarWebService {
  constructor(private client: MCPClient) {}

  async getDomainMetrics(domain: string): Promise<SimilarWebMetrics> {
    try {
      const [traffic, trafficSources] = await Promise.all([
        this.client.callTool('get_website_traffic', { domain }),
        this.client.callTool('get_traffic_sources', { domain }).catch(() => null),
      ]);

      const metrics: SimilarWebMetrics = {
        domain,
        timestamp: new Date().toISOString(),
        globalRank: traffic.globalRank,
        visits: traffic.visits,
        bounceRate: traffic.bounceRate,
        pagesPerVisit: traffic.pagesPerVisit,
        avgVisitDuration: traffic.avgVisitDuration,
      };

      if (trafficSources) {
        metrics.trafficSources = {
          direct: trafficSources.direct,
          search: trafficSources.search,
          social: trafficSources.social,
          referrals: trafficSources.referrals,
          mail: trafficSources.mail,
        };
      }

      return metrics;
    } catch (error) {
      console.error(`Error fetching SimilarWeb data for ${domain}:`, error);
      return {
        domain,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getTrafficSources(domain: string) {
    return this.client.callTool('get_traffic_sources', { domain });
  }

  async getReferrals(domain: string) {
    return this.client.callTool('get_referrals', { domain });
  }

  async getCompetitors(domain: string) {
    return this.client.callTool('get_competitors', { domain });
  }

  async getCountryBreakdown(domain: string) {
    return this.client.callTool('get_country_breakdown', { domain });
  }
}
