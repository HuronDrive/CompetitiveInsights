# MCP Setup Instructions

This guide will help you configure the SimilarWeb, Ahrefs, and SEMRush MCP servers for the Competitive Insights tool.

## Prerequisites

1. **Node.js and npm**: Version 18 or higher
2. **API Keys**: You need API keys for each service you want to use

## API Key Setup

### 1. SimilarWeb API Key
- Requires: API-only, Business, or Enterprise plan
- Get your key from: https://account.similarweb.com/api-management
- Documentation: https://developers.similarweb.com/

### 2. Ahrefs API Key
- Requires: Ahrefs API v3 key (not MCP key)
- Get your key from: https://ahrefs.com/api
- Documentation: https://docs.ahrefs.com/docs/api/reference/api-keys-creation-and-management

### 3. SEMRush API Key
- Requires: SEO Business plan (Standard API) or Trends Basic/Premium
- Get your key from: https://www.semrush.com/api-analytics/
- Documentation: https://developer.semrush.com/api/

## Environment Variables

Create a `.env` file in the project root:

```bash
# SimilarWeb API Key
SIMILARWEB_API_KEY=your_similarweb_api_key_here

# Ahrefs API Key
AHREFS_API_KEY=your_ahrefs_api_key_here

# SEMRush API Key
SEMRUSH_API_KEY=your_semrush_api_key_here

# Set to 'false' to use real MCP servers
USE_MOCK_DATA=false
```

## Installation Steps

### Option 1: Automatic Installation (Recommended)

Run the setup script:

```bash
npm run setup-mcp
```

This will:
- Install all required MCP server packages
- Configure Claude Code / Cursor
- Verify API connections

### Option 2: Manual Installation

#### Install Ahrefs MCP Server

```bash
npm install --prefix=~/.global-node-modules @ahrefs/mcp -g
```

#### Install SEMRush MCP Server

The SEMRush MCP server will be installed via npx automatically when you run the tool.

#### SimilarWeb MCP Server

SimilarWeb uses a remote MCP server, so no local installation is required.

### Option 3: Claude Desktop Configuration

If you're using Claude Desktop, add this to your config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "similarweb": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote@latest",
        "https://mcp.similarweb.com/",
        "--header",
        "api-key: YOUR_SIMILARWEB_API_KEY"
      ]
    },
    "ahrefs": {
      "command": "npx",
      "args": ["--prefix=~/.global-node-modules", "@ahrefs/mcp"],
      "env": {
        "API_KEY": "YOUR_AHREFS_API_KEY"
      }
    },
    "semrush": {
      "command": "npx",
      "args": ["-y", "github:mrkooblu/semrush-mcp"],
      "env": {
        "SEMRUSH_API_KEY": "YOUR_SEMRUSH_API_KEY",
        "API_CACHE_TTL_SECONDS": "300",
        "API_RATE_LIMIT_PER_SECOND": "10"
      }
    }
  }
}
```

### Option 4: Cursor Configuration

In Cursor: Settings → MCP Servers → Add Server

Use the same configuration as above.

## Verification

Test your MCP server connections:

```bash
npm run test-mcp
```

This will:
- Check if all MCP servers are accessible
- Verify API key authentication
- List available tools from each server

## Available Tools

### SimilarWeb MCP Tools
- Website traffic overview
- Traffic sources breakdown
- Geographic distribution
- Referrals and top pages
- Competitor analysis
- Category rankings

### Ahrefs MCP Tools
- Domain rating and authority
- Backlinks analysis
- Referring domains
- Organic keywords
- Top pages by traffic
- Keyword difficulty

### SEMRush MCP Tools
- Domain overview and analytics
- Keyword research and difficulty
- Organic/paid keyword tracking
- Backlink analysis
- Competitor research
- Traffic analysis by source
- Related keywords discovery
- API units balance checker

## Using the Tool

Once configured, you can use real data:

```bash
# Make sure USE_MOCK_DATA is set to false in .env
npm run audit example.com competitor.com -f html -o report.html
```

## Troubleshooting

### "Module not found" or "Command not found"

**Solution**: Restart your terminal/IDE after installing MCP servers.

### "Authentication failed"

**Solution**:
- Verify your API keys are correct in `.env`
- Check that your subscription includes API access
- Ensure there are no extra spaces in your API key

### "Rate limit exceeded"

**Solution**:
- Reduce the number of concurrent requests
- Increase `API_RATE_LIMIT_PER_SECOND` for SEMRush
- Wait before retrying

### "API units exhausted" (SEMRush)

**Solution**:
- Check your balance with the balance checker tool
- Upgrade your plan or wait for monthly reset
- Use caching to reduce API calls

### Connection timeout

**Solution**:
- Check your internet connection
- Verify the MCP server URLs are accessible
- Try increasing timeout settings

## Cost Considerations

**SimilarWeb**: API calls count against your monthly quota based on your plan.

**Ahrefs**: Costs vary by endpoint; monitor usage in your Ahrefs dashboard.

**SEMRush**: Each request consumes API units (10-100+ per query depending on endpoint). Use the balance checker tool to monitor consumption.

## Switching Between Mock and Real Data

To switch back to mock data for testing:

```bash
# In .env file
USE_MOCK_DATA=true
```

To use real MCP servers:

```bash
# In .env file
USE_MOCK_DATA=false
```

## Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use environment variables** - Don't hardcode API keys
3. **Rotate keys regularly** - Generate new keys periodically
4. **Monitor usage** - Check for unexpected API consumption
5. **Use read-only keys** - If available, use keys with minimal permissions

## Support

For MCP-specific issues:
- SimilarWeb: https://developers.similarweb.com/support
- Ahrefs: https://docs.ahrefs.com/docs/api/support
- SEMRush: https://developer.semrush.com/support

For tool issues:
- Open an issue: https://github.com/YourRepo/CompetitiveInsights/issues
- See documentation: `README.md` and `EXAMPLES.md`
