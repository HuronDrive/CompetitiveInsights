# MCP Integration Guide

This guide explains how to integrate real SimilarWeb and Ahrefs MCP servers with the Competitive Insights tool.

## Overview

The tool is designed to work with MCP (Model Context Protocol) servers that provide SimilarWeb and Ahrefs data. By default, it uses mock data for development and testing. This guide shows you how to connect to real MCP servers.

## Current Architecture

The tool uses an abstraction layer (`MCPClient` interface) that allows you to swap between mock and real implementations without changing the core business logic.

### File to Modify

`src/clients/mcp-client.ts` - This is where you'll implement the real MCP client.

## Integration Steps

### Step 1: Install MCP SDK

First, install the MCP SDK if available:

```bash
npm install @modelcontextprotocol/sdk
# or the specific SDK for your MCP servers
```

### Step 2: Implement Real MCP Client

Replace the mock implementation in `src/clients/mcp-client.ts`:

```typescript
import { Client } from '@modelcontextprotocol/sdk';

export class RealMCPClient implements MCPClient {
  private client: Client;
  private serverName: string;

  constructor(config: MCPClientConfig) {
    this.serverName = config.serverName;

    // Initialize MCP client with server configuration
    this.client = new Client({
      name: config.serverName,
      version: '1.0.0',
    });

    // Connect to the MCP server
    this.connectToServer();
  }

  private async connectToServer() {
    // Connection logic specific to your MCP setup
    // This will depend on how your MCP servers are configured
    try {
      await this.client.connect({
        command: 'npx',
        args: [`@${this.serverName}/mcp-server`],
      });
      console.log(`Connected to ${this.serverName} MCP server`);
    } catch (error) {
      console.error(`Failed to connect to ${this.serverName}:`, error);
      throw error;
    }
  }

  async callTool<T = any>(toolName: string, params: Record<string, any>): Promise<T> {
    try {
      const result = await this.client.callTool({
        name: toolName,
        arguments: params,
      });

      return result.content as T;
    } catch (error) {
      console.error(`Error calling ${toolName} on ${this.serverName}:`, error);
      throw error;
    }
  }

  async listTools(): Promise<string[]> {
    const tools = await this.client.listTools();
    return tools.map(tool => tool.name);
  }
}

// Update the factory function
export function createMCPClient(config: MCPClientConfig): MCPClient {
  // Use environment variable to switch between mock and real
  if (process.env.USE_MOCK_DATA === 'true') {
    return new MockMCPClient(config);
  }

  return new RealMCPClient(config);
}
```

### Step 3: Configure MCP Servers

#### Option A: Via Environment Variables

Create a `.env` file in the project root:

```env
USE_MOCK_DATA=false
SIMILARWEB_API_KEY=your_api_key_here
AHREFS_API_KEY=your_api_key_here
```

#### Option B: Via Claude Code Configuration

Add to your Claude Code MCP configuration (usually in `.claude/config.json` or Claude settings):

```json
{
  "mcpServers": {
    "similarweb": {
      "command": "npx",
      "args": ["-y", "@similarweb/mcp-server"],
      "env": {
        "SIMILARWEB_API_KEY": "${SIMILARWEB_API_KEY}"
      }
    },
    "ahrefs": {
      "command": "npx",
      "args": ["-y", "@ahrefs/mcp-server"],
      "env": {
        "AHREFS_API_KEY": "${AHREFS_API_KEY}"
      }
    }
  }
}
```

### Step 4: Map Tool Names

Different MCP servers may use different tool names. Update the service files to match:

#### SimilarWeb Tool Mapping

In `src/services/similarweb-service.ts`, ensure tool names match your MCP server:

```typescript
// Example: Your MCP server might use different names
const toolMap = {
  'get_website_traffic': 'similarweb_traffic_overview',
  'get_traffic_sources': 'similarweb_traffic_sources',
  // ... map other tools
};
```

#### Ahrefs Tool Mapping

In `src/services/ahrefs-service.ts`:

```typescript
const toolMap = {
  'get_domain_rating': 'ahrefs_domain_overview',
  'get_backlinks': 'ahrefs_backlinks',
  // ... map other tools
};
```

### Step 5: Handle Response Formats

MCP servers may return data in different formats. Create adapters to transform responses:

```typescript
// src/adapters/similarweb-adapter.ts
export function adaptSimilarWebResponse(rawResponse: any) {
  return {
    domain: rawResponse.domain,
    globalRank: rawResponse.global_rank,
    visits: rawResponse.monthly_visits,
    // ... map other fields
  };
}
```

Use these adapters in your services:

```typescript
async getDomainMetrics(domain: string): Promise<SimilarWebMetrics> {
  const rawData = await this.client.callTool('get_website_traffic', { domain });
  return adaptSimilarWebResponse(rawData);
}
```

## Testing with Real MCP Servers

### 1. Verify MCP Server Connection

Create a test script `test-mcp.ts`:

```typescript
import { createMCPClient } from './src/clients/mcp-client.js';

async function testConnection() {
  const client = createMCPClient({ serverName: 'similarweb' });

  try {
    const tools = await client.listTools();
    console.log('Available tools:', tools);

    // Test a simple call
    const result = await client.callTool('get_website_traffic', {
      domain: 'example.com',
    });
    console.log('Test result:', result);
  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

testConnection();
```

Run it:

```bash
tsx test-mcp.ts
```

### 2. Gradual Rollout

Test with one domain first:

```bash
npm run audit example.com -f json -o test-output.json
```

Check the output to ensure data is formatted correctly.

### 3. Compare Mock vs Real

Run the same audit with both mock and real data to verify:

```bash
# With mock data
USE_MOCK_DATA=true npm run audit example.com -o mock-report.json

# With real data
USE_MOCK_DATA=false npm run audit example.com -o real-report.json

# Compare
diff mock-report.json real-report.json
```

## Common MCP Server Tool Names

### SimilarWeb MCP (Example)

The exact tool names depend on your MCP server implementation. Common patterns:

- `similarweb.getTrafficOverview` or `get_traffic_overview`
- `similarweb.getTrafficSources` or `get_traffic_sources`
- `similarweb.getReferrals` or `get_referrals`
- `similarweb.getCompetitors` or `get_competitors`
- `similarweb.getGeography` or `get_country_breakdown`

### Ahrefs MCP (Example)

- `ahrefs.getDomainRating` or `get_domain_rating`
- `ahrefs.getBacklinks` or `get_backlinks`
- `ahrefs.getOrganicKeywords` or `get_organic_keywords`
- `ahrefs.getTopPages` or `get_top_pages`
- `ahrefs.getReferringDomains` or `get_referring_domains`

**Check your MCP server documentation for exact tool names!**

## Error Handling

Add robust error handling for MCP calls:

```typescript
async getDomainMetrics(domain: string): Promise<SimilarWebMetrics> {
  try {
    const traffic = await this.client.callTool('get_website_traffic', { domain });
    return this.adaptResponse(traffic);
  } catch (error) {
    if (error.code === 'RATE_LIMIT_EXCEEDED') {
      console.warn(`Rate limit hit for ${domain}, retrying in 60s...`);
      await sleep(60000);
      return this.getDomainMetrics(domain);
    }

    console.error(`Error fetching data for ${domain}:`, error);

    // Return partial data instead of failing completely
    return {
      domain,
      timestamp: new Date().toISOString(),
      error: error.message,
    };
  }
}
```

## Rate Limiting

Implement rate limiting to avoid hitting API limits:

```typescript
import pLimit from 'p-limit';

// Limit to 5 concurrent requests
const limit = pLimit(5);

async runAudit(options: AuditOptions): Promise<CompetitiveAuditReport> {
  const promises = options.domains.map(domain =>
    limit(() => this.fetchDomainData(domain))
  );

  await Promise.all(promises);
  // ... rest of audit logic
}
```

## Caching

Implement caching to reduce API calls:

```typescript
import NodeCache from 'node-cache';

class SimilarWebService {
  private cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache

  async getDomainMetrics(domain: string): Promise<SimilarWebMetrics> {
    const cacheKey = `sw_${domain}`;
    const cached = this.cache.get<SimilarWebMetrics>(cacheKey);

    if (cached) {
      console.log(`Using cached data for ${domain}`);
      return cached;
    }

    const data = await this.client.callTool('get_website_traffic', { domain });
    this.cache.set(cacheKey, data);
    return data;
  }
}
```

## Troubleshooting

### MCP Server Not Found

```
Error: Cannot find module '@similarweb/mcp-server'
```

**Solution**: Verify the MCP server package name and install it:

```bash
npm install @similarweb/mcp-server @ahrefs/mcp-server
```

### Authentication Errors

```
Error: Invalid API key
```

**Solution**: Check your `.env` file and ensure API keys are correct.

### Tool Not Found

```
Error: Tool 'get_website_traffic' not found
```

**Solution**: List available tools and update your code to use the correct names:

```typescript
const tools = await client.listTools();
console.log('Available tools:', tools);
```

### Rate Limit Errors

```
Error: Rate limit exceeded
```

**Solution**: Implement exponential backoff and reduce concurrency:

```typescript
const limit = pLimit(2); // Reduce from 5 to 2
```

## Next Steps

1. **Get API Keys**: Sign up for SimilarWeb and Ahrefs API access
2. **Install MCP Servers**: Install the specific MCP server packages
3. **Update Client**: Replace mock client with real implementation
4. **Test**: Verify with a small dataset first
5. **Deploy**: Roll out to production use

## Support

For MCP-specific issues:
- Check the MCP server documentation
- Review MCP SDK examples
- Reach out to MCP server maintainers

For tool-specific issues:
- Open an issue in this repository
- Check the examples in `EXAMPLES.md`
