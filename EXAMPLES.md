# Competitive Insights - Usage Examples

## CLI Examples

### Basic Audit

Compare your site against two competitors:

```bash
npm run audit yoursite.com competitor1.com competitor2.com
```

### Generate HTML Report

Create a beautiful HTML report for stakeholders:

```bash
npm run audit yoursite.com competitor.com -f html -o monthly-report.html
```

### Quick Traffic-Only Analysis

Skip SEO metrics when you only need traffic data:

```bash
npm run audit yoursite.com competitor.com --no-seo
```

### Backlink Deep Dive

Analyze top 200 backlinks for each domain:

```bash
npm run audit backlinks yoursite.com competitor1.com competitor2.com --limit 200
```

### Keyword Gap Analysis

Find keyword opportunities:

```bash
npm run audit keywords yoursite.com competitor1.com competitor2.com
```

### Traffic Sources Breakdown

Compare where competitors get their traffic:

```bash
npm run audit traffic-sources yoursite.com competitor.com
```

## Programmatic Examples

### Example 1: Simple Audit

```typescript
import { CompetitiveAuditService } from './src/services/audit-service.js';

async function runSimpleAudit() {
  const service = new CompetitiveAuditService();

  const report = await service.runAudit({
    domains: ['example.com', 'competitor.com'],
    includeTraffic: true,
    includeSEO: true,
  });

  console.log('Traffic Leader:', report.analysis.trafficLeader);
  console.log('SEO Leader:', report.analysis.seoLeader);
  console.log('\nInsights:');
  report.analysis.insights.forEach(insight => console.log('-', insight));
}

runSimpleAudit();
```

### Example 2: Generate Multiple Report Formats

```typescript
import { CompetitiveAuditService, ReportGenerator } from './src/index.js';

async function generateReports() {
  const service = new CompetitiveAuditService();
  const generator = new ReportGenerator();

  const report = await service.runAudit({
    domains: ['yoursite.com', 'competitor1.com', 'competitor2.com'],
  });

  // Save in all formats
  generator.saveReport(report, 'json', 'reports/data.json');
  generator.saveReport(report, 'markdown', 'reports/summary.md');
  generator.saveReport(report, 'html', 'reports/presentation.html');

  console.log('Reports generated in 3 formats!');
}

generateReports();
```

### Example 3: Custom Analysis

```typescript
import { CompetitiveAuditService } from './src/services/audit-service.js';

async function customAnalysis() {
  const service = new CompetitiveAuditService();

  const domains = ['example.com', 'competitor1.com', 'competitor2.com'];

  // Run the audit
  const report = await service.runAudit({ domains });

  // Custom analysis: Find domain with best engagement
  let bestEngagement = { domain: '', score: 0 };

  domains.forEach(domain => {
    const metrics = report.similarWebData[domain];
    if (metrics) {
      // Calculate engagement score (example formula)
      const score =
        (metrics.pagesPerVisit || 0) * 10 +
        (metrics.avgVisitDuration || 0) / 60 -
        (metrics.bounceRate || 100);

      if (score > bestEngagement.score) {
        bestEngagement = { domain, score };
      }
    }
  });

  console.log('Best User Engagement:', bestEngagement.domain);
  console.log('Engagement Score:', bestEngagement.score.toFixed(2));

  // Find content opportunity
  const keywordGaps = await service.getKeywordGapAnalysis(domains);
  console.log('\nKeyword Gaps:', keywordGaps);
}

customAnalysis();
```

### Example 4: Scheduled Monitoring

```typescript
import { CompetitiveAuditService, ReportGenerator } from './src/index.js';

async function weeklyMonitoring() {
  const service = new CompetitiveAuditService();
  const generator = new ReportGenerator();

  const domains = ['yoursite.com', 'competitor1.com', 'competitor2.com'];

  // Run weekly audit
  const report = await service.runAudit({ domains });

  // Generate timestamped report
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `weekly-report-${timestamp}.html`;

  generator.saveReport(report, 'html', `reports/${filename}`);

  // Check for significant changes
  const insights = report.analysis.insights;
  if (insights.length > 0) {
    console.log('🚨 New Insights This Week:');
    insights.forEach(insight => console.log('  -', insight));

    // Here you could send an email, Slack notification, etc.
  }
}

// Run every week (this is just an example - use a proper scheduler like node-cron)
weeklyMonitoring();
```

### Example 5: Focus on Backlink Quality

```typescript
import { AhrefsService } from './src/services/ahrefs-service.js';
import { createMCPClient } from './src/clients/mcp-client.js';

async function analyzeBacklinkQuality() {
  const client = createMCPClient({ serverName: 'ahrefs' });
  const service = new AhrefsService(client);

  const domain = 'example.com';

  // Get comprehensive backlink data
  const backlinks = await service.getBacklinks(domain, 500);
  const referringDomains = await service.getReferringDomains(domain);

  console.log(`\nBacklink Analysis for ${domain}:`);
  console.log('Total Backlinks:', backlinks.length);
  console.log('Referring Domains:', referringDomains.length);

  // Analyze quality (example)
  // In real implementation, backlinks would have DR scores
  // const highQuality = backlinks.filter(bl => bl.domainRating > 50);
  // console.log('High Quality Backlinks (DR>50):', highQuality.length);
}

analyzeBacklinkQuality();
```

### Example 6: Traffic Source Strategy

```typescript
import { CompetitiveAuditService } from './src/services/audit-service.js';

async function analyzeTrafficStrategy() {
  const service = new CompetitiveAuditService();

  const domains = ['yoursite.com', 'competitor1.com', 'competitor2.com'];
  const trafficSources = await service.getTrafficSourcesComparison(domains);

  console.log('\n📊 Traffic Source Comparison:\n');

  domains.forEach(domain => {
    const sources = trafficSources[domain];
    console.log(`${domain}:`);
    console.log(`  Search: ${sources.search?.toFixed(1)}%`);
    console.log(`  Direct: ${sources.direct?.toFixed(1)}%`);
    console.log(`  Social: ${sources.social?.toFixed(1)}%`);
    console.log(`  Referrals: ${sources.referrals?.toFixed(1)}%`);
    console.log('');
  });

  // Identify opportunities
  const yourSources = trafficSources['yoursite.com'];
  const avgCompetitorSearch = domains
    .filter(d => d !== 'yoursite.com')
    .reduce((sum, d) => sum + (trafficSources[d]?.search || 0), 0) / 2;

  if ((yourSources?.search || 0) < avgCompetitorSearch) {
    console.log('💡 Opportunity: Invest more in SEO/Content Marketing');
    console.log(`   Your organic: ${yourSources?.search?.toFixed(1)}%`);
    console.log(`   Competitor avg: ${avgCompetitorSearch.toFixed(1)}%`);
  }
}

analyzeTrafficStrategy();
```

### Example 7: Export to External Systems

```typescript
import { CompetitiveAuditService } from './src/services/audit-service.js';

async function exportToDataWarehouse() {
  const service = new CompetitiveAuditService();

  const report = await service.runAudit({
    domains: ['yoursite.com', 'competitor1.com'],
  });

  // Transform to flat structure for database
  const records = report.domains.map(domain => ({
    domain,
    date: new Date().toISOString().split('T')[0],
    visits: report.similarWebData[domain]?.visits,
    bounceRate: report.similarWebData[domain]?.bounceRate,
    domainRating: report.ahrefsData[domain]?.domainRating,
    backlinks: report.ahrefsData[domain]?.backlinks,
    organicKeywords: report.ahrefsData[domain]?.organicKeywords,
  }));

  // Send to your database/warehouse
  console.log('Records to insert:', JSON.stringify(records, null, 2));

  // Example: await database.insert('competitive_metrics', records);
}

exportToDataWarehouse();
```

## Real-World Use Cases

### Use Case 1: Monthly Executive Report

```bash
# Run on the 1st of each month
npm run audit yoursite.com competitor1.com competitor2.com \
  -f html \
  -o "reports/exec-report-$(date +%Y-%m).html"
```

### Use Case 2: Pre-Campaign Benchmark

Before launching a marketing campaign, establish benchmarks:

```bash
npm run audit yoursite.com -f json -o pre-campaign-benchmark.json
```

After campaign:

```bash
npm run audit yoursite.com -f json -o post-campaign-results.json
# Compare the two JSON files
```

### Use Case 3: Competitive Intelligence Dashboard

Collect data from multiple competitors regularly and track changes over time:

```typescript
// Store historical data
const historicalData = [];

setInterval(async () => {
  const service = new CompetitiveAuditService();
  const report = await service.runAudit({
    domains: ['yoursite.com', 'comp1.com', 'comp2.com', 'comp3.com'],
  });

  historicalData.push({
    timestamp: Date.now(),
    report,
  });

  // Persist to database or file
}, 7 * 24 * 60 * 60 * 1000); // Weekly
```

### Use Case 4: Alerting System

Get notified when competitors make significant moves:

```typescript
async function checkCompetitorMovement() {
  const service = new CompetitiveAuditService();
  const report = await service.runAudit({
    domains: ['competitor.com'],
  });

  const metrics = report.ahrefsData['competitor.com'];

  // Check for significant backlink increase
  if (metrics.backlinks && metrics.backlinks > THRESHOLD) {
    sendAlert(`Competitor gained ${metrics.backlinks} backlinks!`);
  }
}
```

## Tips for Best Results

1. **Run regularly**: Schedule weekly or monthly audits for trend analysis
2. **Compare apples to apples**: Analyze direct competitors in your niche
3. **Look at multiple metrics**: Don't focus on just one metric
4. **Track over time**: Single snapshots are less useful than trends
5. **Act on insights**: Use recommendations to guide your strategy
