# Competitive Insights

A powerful competitive audit tool that combines data from SimilarWeb, Ahrefs, and SEMRush MCP servers to provide comprehensive competitive intelligence for websites and domains.

## Features

- **🌐 Web User Interface**: Beautiful, modern web UI for easy point-and-click audits (NEW!)
- **Traffic Analytics**: Get detailed traffic metrics including visits, bounce rate, pages per visit, and traffic sources using SimilarWeb data
- **SEO Metrics**: Analyze domain authority, backlinks, referring domains, and organic keywords using Ahrefs data
- **SEMRush Intelligence**: Access authority scores, paid search data, keyword rankings, and comprehensive backlink analysis
- **Competitive Analysis**: Automatically identify leaders in traffic, SEO, authority, and paid search performance
- **Multiple Report Formats**: Generate reports in JSON, Markdown, or HTML format
- **CLI & Library**: Use as a command-line tool or integrate into your Node.js applications
- **Parallel Processing**: Fetch data for multiple domains simultaneously for faster analysis

## Installation

```bash
npm install
npm run build
```

## Prerequisites

This tool requires access to:
- **SimilarWeb MCP Server**: For traffic and engagement metrics
- **Ahrefs MCP Server**: For SEO and backlink data
- **SEMRush MCP Server**: For authority scores, paid search, and keyword intelligence

### Setting Up MCP Servers

To use real data from SimilarWeb, Ahrefs, and SEMRush, you need to configure MCP servers. See the **[MCP_SETUP.md](MCP_SETUP.md)** file for detailed installation and configuration instructions.

Quick setup example (add to your Claude Code config):

```json
{
  "mcpServers": {
    "similarweb": {
      "command": "npx",
      "args": ["-y", "mcp-remote@latest", "https://mcp.similarweb.com/", "--header", "api-key: ${SIMILARWEB_API_KEY}"]
    },
    "ahrefs": {
      "command": "npx",
      "args": ["--prefix=~/.global-node-modules", "@ahrefs/mcp"],
      "env": {"API_KEY": "${AHREFS_API_KEY}"}
    },
    "semrush": {
      "command": "npx",
      "args": ["-y", "github:mrkooblu/semrush-mcp"],
      "env": {"SEMRUSH_API_KEY": "${SEMRUSH_API_KEY}"}
    }
  }
}
```

## Usage

### Web Interface (Easiest!)

Start the web server and use the beautiful UI:

```bash
npm run web
```

Then open `http://localhost:3000` in your browser!

**Features:**
- ✨ Modern, responsive design
- 📊 Visual results display
- 💾 One-click report downloads
- 📱 Mobile-friendly

See [WEB_UI.md](WEB_UI.md) for complete web interface documentation.

### Command Line Interface

#### Run a Full Competitive Audit

```bash
npm run audit example.com competitor1.com competitor2.com
```

#### Specify Output Format and File

```bash
# Generate Markdown report
npm run audit example.com competitor.com -f markdown -o report.md

# Generate HTML report
npm run audit example.com competitor.com -f html -o report.html

# Generate JSON report
npm run audit example.com competitor.com -f json -o report.json
```

#### Skip Certain Metrics

```bash
# Skip traffic metrics
npm run audit example.com competitor.com --no-traffic

# Skip SEO metrics
npm run audit example.com competitor.com --no-seo
```

#### Analyze Backlinks

```bash
npm run audit backlinks example.com competitor.com --limit 100
```

#### Keyword Gap Analysis

```bash
npm run audit keywords example.com competitor.com
```

#### Traffic Sources Comparison

```bash
npm run audit traffic-sources example.com competitor.com
```

### Programmatic Usage

```typescript
import { CompetitiveAuditService, ReportGenerator } from 'competitive-insights';

// Run a competitive audit
const service = new CompetitiveAuditService();
const report = await service.runAudit({
  domains: ['example.com', 'competitor.com'],
  includeTraffic: true,
  includeSEO: true,
});

// Generate a report
const generator = new ReportGenerator();
const markdown = generator.generateMarkdown(report);
console.log(markdown);

// Save report to file
generator.saveReport(report, 'html', 'my-report.html');

// Access specific analyses
const backlinks = await service.getDetailedBacklinkAnalysis(['example.com']);
const keywords = await service.getKeywordGapAnalysis(['example.com', 'competitor.com']);
const trafficSources = await service.getTrafficSourcesComparison(['example.com']);
```

## Architecture

### Project Structure

```
src/
├── clients/
│   └── mcp-client.ts       # MCP client interface and mock implementation
├── services/
│   ├── audit-service.ts    # Main competitive audit orchestrator
│   ├── similarweb-service.ts  # SimilarWeb data fetching
│   └── ahrefs-service.ts   # Ahrefs data fetching
├── utils/
│   └── report-generator.ts # Report generation in various formats
├── types.ts                # TypeScript type definitions
├── cli.ts                  # Command-line interface
└── index.ts               # Library entry point
```

### Data Flow

1. **CLI or Library Call**: User initiates an audit with domain list
2. **Audit Service**: Orchestrates parallel data collection
3. **MCP Clients**: Fetch data from SimilarWeb and Ahrefs MCP servers
4. **Analysis**: Aggregate and analyze collected metrics
5. **Report Generation**: Format results as JSON, Markdown, or HTML

### Key Components

- **CompetitiveAuditService**: Main service that coordinates data collection and analysis
- **SimilarWebService**: Fetches traffic and engagement metrics
- **AhrefsService**: Fetches SEO and backlink data
- **ReportGenerator**: Creates formatted reports from audit results
- **MCPClient**: Abstract interface for MCP server communication

## Metrics Collected

### SimilarWeb Metrics
- Global/Country/Category Rank
- Monthly Visits
- Bounce Rate
- Pages per Visit
- Average Visit Duration
- Traffic Sources (Direct, Search, Social, Referrals, Mail)
- Top Countries
- Top Referrals
- Competitors List

### Ahrefs Metrics
- Domain Rating (DR)
- Ahrefs Rank
- Total Backlinks
- Referring Domains
- Organic Keywords
- Organic Traffic
- Organic Traffic Value
- Top Pages
- Top Keywords
- Backlink Details

## Analysis Features

The tool automatically analyzes collected data to identify:

- **Traffic Leader**: Domain with highest monthly visits
- **SEO Leader**: Domain with highest Domain Rating
- **Backlink Leader**: Domain with most backlinks
- **Keyword Leader**: Domain ranking for most organic keywords

It also provides actionable recommendations for improving competitive position.

## Development

### Build

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Running with tsx

```bash
tsx src/cli.ts audit example.com competitor.com
```

## Extending the Tool

### Adding New Data Sources

1. Create a new service in `src/services/`
2. Implement data fetching methods
3. Update `CompetitiveAuditService` to integrate new data
4. Add new metrics to `types.ts`
5. Update report generator to include new metrics

### Custom Analysis

Extend the `analyzeCompetitiveData` method in `audit-service.ts` to add custom insights and recommendations based on your specific needs.

## Example Reports

Reports include:

- **Executive Summary**: Key insights and recommendations
- **Traffic Metrics Table**: Detailed traffic and engagement data
- **SEO Metrics Table**: Domain authority and backlink information
- **Quick Comparison Table**: Side-by-side comparison of all domains

## Mock Data Mode

By default, the tool uses mock data for development and testing. The mock client generates realistic sample data that resembles actual SimilarWeb and Ahrefs responses.

To use real data, replace the `MockMCPClient` with actual MCP client implementations in `src/clients/mcp-client.ts`.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT

## Roadmap

- [ ] Real-time MCP server integration
- [ ] Historical data tracking and trending
- [ ] Email report delivery
- [ ] Dashboard UI
- [ ] Export to Google Sheets/Excel
- [ ] Scheduled automated audits
- [ ] Slack/Discord notifications
- [ ] Competitive gap analysis visualizations
