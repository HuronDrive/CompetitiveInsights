/**
 * Base MCP Client interface
 * This provides a common interface for interacting with MCP servers
 */

export interface MCPClientConfig {
  serverName: string;
  timeout?: number;
}

export interface MCPClient {
  callTool<T = any>(toolName: string, params: Record<string, any>): Promise<T>;
  listTools(): Promise<string[]>;
}

/**
 * Mock MCP Client for development/testing
 * Replace this with actual MCP client implementation when MCP servers are available
 */
export class MockMCPClient implements MCPClient {
  private serverName: string;

  constructor(config: MCPClientConfig) {
    this.serverName = config.serverName;
  }

  async callTool<T = any>(toolName: string, params: Record<string, any>): Promise<T> {
    console.log(`[${this.serverName}] Calling tool: ${toolName}`, params);

    // Return mock data based on server and tool
    if (this.serverName === 'similarweb') {
      return this.getMockSimilarWebData(toolName, params) as T;
    } else if (this.serverName === 'ahrefs') {
      return this.getMockAhrefsData(toolName, params) as T;
    } else if (this.serverName === 'semrush') {
      return this.getMockSEMRushData(toolName, params) as T;
    }

    throw new Error(`Unknown server: ${this.serverName}`);
  }

  async listTools(): Promise<string[]> {
    if (this.serverName === 'similarweb') {
      return [
        'get_website_traffic',
        'get_traffic_sources',
        'get_referrals',
        'get_competitors',
        'get_country_breakdown'
      ];
    } else if (this.serverName === 'ahrefs') {
      return [
        'get_domain_rating',
        'get_backlinks',
        'get_referring_domains',
        'get_organic_keywords',
        'get_top_pages',
        'get_top_keywords'
      ];
    } else if (this.serverName === 'semrush') {
      return [
        'domain_overview',
        'domain_organic',
        'domain_organic_keywords',
        'domain_adwords_keywords',
        'domain_organic_competitors',
        'domain_adwords_competitors',
        'backlinks_overview',
        'backlinks',
        'backlinks_refdomains',
        'keyword_difficulty',
        'related_keywords',
        'traffic_summary',
        'balance'
      ];
    }
    return [];
  }

  private getMockSimilarWebData(toolName: string, params: any): any {
    const domain = params.domain || 'example.com';

    switch (toolName) {
      case 'get_website_traffic':
        return {
          domain,
          globalRank: Math.floor(Math.random() * 100000),
          visits: Math.floor(Math.random() * 10000000),
          bounceRate: 40 + Math.random() * 30,
          pagesPerVisit: 2 + Math.random() * 5,
          avgVisitDuration: 120 + Math.random() * 300
        };
      case 'get_traffic_sources':
        return {
          direct: 20 + Math.random() * 30,
          search: 30 + Math.random() * 40,
          social: 5 + Math.random() * 20,
          referrals: 5 + Math.random() * 15,
          mail: 1 + Math.random() * 5
        };
      default:
        return { domain, data: 'mock' };
    }
  }

  private getMockAhrefsData(toolName: string, params: any): any {
    const domain = params.domain || 'example.com';

    switch (toolName) {
      case 'get_domain_rating':
        return {
          domain,
          domainRating: Math.floor(Math.random() * 100),
          ahrefsRank: Math.floor(Math.random() * 1000000),
          backlinks: Math.floor(Math.random() * 1000000),
          referringDomains: Math.floor(Math.random() * 50000)
        };
      case 'get_organic_keywords':
        return {
          domain,
          organicKeywords: Math.floor(Math.random() * 500000),
          organicTraffic: Math.floor(Math.random() * 1000000),
          organicValue: Math.floor(Math.random() * 10000000)
        };
      default:
        return { domain, data: 'mock' };
    }
  }

  private getMockSEMRushData(toolName: string, params: any): any {
    const domain = params.domain || 'example.com';

    switch (toolName) {
      case 'domain_overview':
        return {
          domain,
          organic_traffic: Math.floor(Math.random() * 5000000),
          paid_traffic: Math.floor(Math.random() * 500000),
          authority_score: Math.floor(30 + Math.random() * 70),
          backlinks_num: Math.floor(Math.random() * 500000),
          referring_domains: Math.floor(Math.random() * 50000),
          organic_keywords: Math.floor(Math.random() * 300000),
          paid_keywords: Math.floor(Math.random() * 50000),
          organic_cost: Math.floor(Math.random() * 5000000),
          paid_cost: Math.floor(Math.random() * 1000000)
        };
      case 'domain_organic':
        return {
          domain,
          positions_1_3: Math.floor(Math.random() * 10000),
          positions_4_10: Math.floor(Math.random() * 20000),
          positions_11_100: Math.floor(Math.random() * 100000)
        };
      case 'backlinks_overview':
        return {
          domain,
          total: Math.floor(Math.random() * 500000),
          follows: Math.floor(Math.random() * 400000),
          nofollows: Math.floor(Math.random() * 100000),
          gov: Math.floor(Math.random() * 1000),
          edu: Math.floor(Math.random() * 2000),
          domains_num: Math.floor(Math.random() * 50000),
          ips_num: Math.floor(Math.random() * 40000)
        };
      case 'balance':
        return {
          units: 100000 + Math.floor(Math.random() * 900000)
        };
      default:
        return { domain, data: 'mock' };
    }
  }
}

/**
 * Factory function to create MCP clients
 * When real MCP servers are configured, this can be extended to use actual MCP SDK
 */
export function createMCPClient(config: MCPClientConfig): MCPClient {
  // For now, return mock client
  // TODO: Replace with actual MCP client when MCP servers are available
  return new MockMCPClient(config);
}
