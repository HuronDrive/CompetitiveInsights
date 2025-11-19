# Quick Start Guide

Get up and running with Competitive Insights in 3 easy steps!

## Option 1: Interactive Setup (Recommended)

Run the interactive setup script:

```bash
npm run setup
```

This will guide you through entering your API keys for:
- SimilarWeb
- Ahrefs
- SEMRush

## Option 2: Manual Setup

1. **Copy the environment template:**
   ```bash
   cp .env.template .env
   ```

2. **Edit `.env` and add your API keys:**
   ```bash
   nano .env  # or use your favorite editor
   ```

3. **Set `USE_MOCK_DATA=false` to use real data**

## Get Your API Keys

### SimilarWeb
- URL: https://account.similarweb.com/api-management
- Required: API-only, Business, or Enterprise plan
- Uses remote MCP server (no local installation needed)

### Ahrefs
- URL: https://ahrefs.com/api
- Required: API v3 key (not MCP key)
- Already installed locally: `@ahrefs/mcp`

### SEMRush
- URL: https://www.semrush.com/api-analytics/
- Required: SEO Business or Trends Basic/Premium plan
- Uses remote MCP server via npx

## Test Your Configuration

After adding API keys, test the connections:

```bash
npm run test-mcp
```

This will verify:
- ✓ API keys are configured
- ✓ MCP servers are accessible
- ✓ Authentication works

## Run Your First Audit

### With Mock Data (no API keys needed)
```bash
npm run audit github.com gitlab.com -f markdown -o my-report.md
```

### With Real Data (requires API keys)
```bash
# Make sure USE_MOCK_DATA=false in .env
npm run audit yoursite.com competitor.com -f html -o report.html
```

## Available Commands

```bash
# Setup
npm run setup          # Interactive API key setup
npm run test-mcp       # Test MCP connections

# Running Audits
npm run audit <domains...>           # Full competitive audit
npm run audit <domains...> -f html   # HTML report
npm run audit <domains...> -f json   # JSON output

# Development
npm run build          # Compile TypeScript
npm run example        # Run example script
```

## CLI Options

```bash
# Output formats
-f, --format <format>   # json, markdown, or html (default: markdown)
-o, --output <file>     # Output file path

# Data sources
--no-traffic           # Skip SimilarWeb traffic metrics
--no-seo              # Skip Ahrefs SEO metrics
```

## What You Get

Each audit includes:

### Traffic Analytics (SimilarWeb)
- Monthly visits
- Bounce rate & engagement
- Traffic sources breakdown
- Geographic distribution

### SEO Metrics (Ahrefs)
- Domain Rating (DR)
- Backlinks count
- Referring domains
- Organic keywords & traffic value

### SEMRush Intelligence
- Authority Score
- Paid search metrics
- Keyword position rankings
- Backlink quality (.gov, .edu)

### Competitive Analysis
- Automatic leader identification
- Paid vs organic balance
- Actionable recommendations

## Troubleshooting

### "No API keys configured"
- Make sure you've run `npm run setup` or edited `.env`
- Check that API keys don't have extra spaces

### "Authentication failed"
- Verify API keys are correct
- Ensure your subscription includes API access
- Check key hasn't expired

### "Module not found" errors
- Run: `npm install`
- For Ahrefs: Verify installation with `npm ls @ahrefs/mcp`

### Reports show mock data
- Set `USE_MOCK_DATA=false` in `.env`
- Restart any running processes

## Cost Management

**Free Tier:**
- Tool works with mock data (no API keys needed)
- Perfect for testing and development

**API Costs:**
- SimilarWeb: Based on monthly quota in your plan
- Ahrefs: Varies by endpoint, monitor in dashboard
- SEMRush: 10-100+ units per request

**Tips to Save:**
- Use caching (enabled by default)
- Limit domains per audit
- Run less frequent audits
- Check `npm run test-mcp` to see balance

## Next Steps

1. ✅ Configure API keys with `npm run setup`
2. ✅ Test connections with `npm run test-mcp`
3. ✅ Run first audit: `npm run audit example.com`
4. 📚 Read full docs: `README.md`
5. 🔧 Advanced setup: `MCP_SETUP.md`
6. 💡 See examples: `EXAMPLES.md`

## Support

- GitHub Issues: [Open an issue](https://github.com/YourRepo/CompetitiveInsights/issues)
- Documentation: `README.md`, `MCP_SETUP.md`, `EXAMPLES.md`
- MCP Setup: See `.claude/mcp_config.json` for configuration

Happy auditing! 🚀
