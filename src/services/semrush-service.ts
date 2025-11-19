/**
 * SEMRush service for fetching SEO, keyword, and competitive metrics
 */

import { MCPClient } from '../clients/mcp-client.js';
import { SEMRushMetrics, SEMRushKeyword, Competitor } from '../types.js';

export class SEMRushService {
  constructor(private client: MCPClient) {}

  async getDomainMetrics(domain: string): Promise<SEMRushMetrics> {
    try {
      const [domainOverview, organicKeywords, backlinksData] = await Promise.all([
        this.client.callTool('domain_overview', { domain }).catch(() => null),
        this.client.callTool('domain_organic', { domain }).catch(() => null),
        this.client.callTool('backlinks_overview', { domain }).catch(() => null),
      ]);

      const metrics: SEMRushMetrics = {
        domain,
        timestamp: new Date().toISOString(),
      };

      if (domainOverview) {
        metrics.organicSearchTraffic = domainOverview.organic_traffic;
        metrics.paidSearchTraffic = domainOverview.paid_traffic;
        metrics.authorityScore = domainOverview.authority_score;
        metrics.totalBacklinks = domainOverview.backlinks_num;
        metrics.totalReferringDomains = domainOverview.referring_domains;
        metrics.organicKeywordsCount = domainOverview.organic_keywords;
        metrics.paidKeywordsCount = domainOverview.paid_keywords;
        metrics.organicTrafficCost = domainOverview.organic_cost;
        metrics.paidTrafficCost = domainOverview.paid_cost;
      }

      if (organicKeywords) {
        metrics.organicPositionsTop3 = organicKeywords.positions_1_3;
        metrics.organicPositionsTop10 = organicKeywords.positions_4_10;
        metrics.organicPositionsTop100 = organicKeywords.positions_11_100;
      }

      if (backlinksData) {
        metrics.backlinksOverview = {
          total: backlinksData.total,
          follows: backlinksData.follows,
          noFollows: backlinksData.nofollows,
          govBacklinks: backlinksData.gov,
          eduBacklinks: backlinksData.edu,
          referringDomains: backlinksData.domains_num,
          referringIPs: backlinksData.ips_num,
        };
      }

      return metrics;
    } catch (error) {
      console.error(`Error fetching SEMRush data for ${domain}:`, error);
      return {
        domain,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getDomainOverview(domain: string) {
    return this.client.callTool('domain_overview', { domain });
  }

  async getOrganicKeywords(domain: string, limit: number = 100) {
    return this.client.callTool('domain_organic_keywords', {
      domain,
      limit,
      export_columns: 'Ph,Po,Nq,Cp,Co,Tr,Tc,Ur,Kd',
    });
  }

  async getPaidKeywords(domain: string, limit: number = 100) {
    return this.client.callTool('domain_adwords_keywords', {
      domain,
      limit,
      export_columns: 'Ph,Po,Nq,Cp,Co,Tr,Tc,Ur',
    });
  }

  async getOrganicCompetitors(domain: string, limit: number = 20) {
    return this.client.callTool('domain_organic_competitors', {
      domain,
      limit,
    });
  }

  async getPaidCompetitors(domain: string, limit: number = 20) {
    return this.client.callTool('domain_adwords_competitors', {
      domain,
      limit,
    });
  }

  async getBacklinksOverview(domain: string) {
    return this.client.callTool('backlinks_overview', { domain });
  }

  async getBacklinks(domain: string, limit: number = 100) {
    return this.client.callTool('backlinks', {
      domain,
      limit,
    });
  }

  async getReferringDomains(domain: string, limit: number = 100) {
    return this.client.callTool('backlinks_refdomains', {
      domain,
      limit,
    });
  }

  async getKeywordDifficulty(keywords: string[]) {
    return this.client.callTool('keyword_difficulty', {
      keywords: keywords.join(','),
    });
  }

  async getRelatedKeywords(keyword: string, limit: number = 100) {
    return this.client.callTool('related_keywords', {
      keyword,
      limit,
    });
  }

  async getTrafficAnalytics(domain: string) {
    return this.client.callTool('traffic_summary', { domain });
  }

  async getApiUnitsBalance() {
    return this.client.callTool('balance', {});
  }
}
