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
