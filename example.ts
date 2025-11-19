/**
 * Example usage of the Competitive Insights tool
 */

import { CompetitiveAuditService, ReportGenerator } from './src/index.js';

async function main() {
  console.log('🚀 Competitive Insights - Example Usage\n');

  // Initialize the service
  const service = new CompetitiveAuditService();
  const generator = new ReportGenerator();

  // Define domains to analyze
  const domains = [
    'github.com',
    'gitlab.com',
    'bitbucket.org',
  ];

  console.log('Analyzing domains:', domains.join(', '));
  console.log('(Using mock data for demonstration)\n');

  try {
    // Run the competitive audit
    const report = await service.runAudit({
      domains,
      includeTraffic: true,
      includeSEO: true,
    });

    // Display results
    console.log('📊 Results Summary:');
    console.log('===================\n');

    // Show insights
    if (report.analysis.insights.length > 0) {
      console.log('Key Insights:');
      report.analysis.insights.forEach((insight) => {
        console.log(`  ✓ ${insight}`);
      });
      console.log('');
    }

    // Show recommendations
    if (report.analysis.recommendations.length > 0) {
      console.log('Recommendations:');
      report.analysis.recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. ${rec}`);
      });
      console.log('');
    }

    // Display detailed metrics for each domain
    console.log('📈 Detailed Metrics:');
    console.log('====================\n');

    for (const domain of domains) {
      console.log(`${domain}:`);

      const swData = report.similarWebData[domain];
      if (swData) {
        console.log('  Traffic:');
        console.log(`    - Monthly Visits: ${swData.visits?.toLocaleString() || 'N/A'}`);
        console.log(`    - Global Rank: #${swData.globalRank?.toLocaleString() || 'N/A'}`);
        console.log(`    - Bounce Rate: ${swData.bounceRate?.toFixed(2)}%`);
        console.log(`    - Pages/Visit: ${swData.pagesPerVisit?.toFixed(2)}`);
      }

      const ahData = report.ahrefsData[domain];
      if (ahData) {
        console.log('  SEO:');
        console.log(`    - Domain Rating: ${ahData.domainRating || 'N/A'}`);
        console.log(`    - Backlinks: ${ahData.backlinks?.toLocaleString() || 'N/A'}`);
        console.log(`    - Referring Domains: ${ahData.referringDomains?.toLocaleString() || 'N/A'}`);
        console.log(`    - Organic Keywords: ${ahData.organicKeywords?.toLocaleString() || 'N/A'}`);
      }

      console.log('');
    }

    // Generate and save reports
    console.log('💾 Generating Reports...\n');

    const markdown = generator.generateMarkdown(report);
    console.log('Markdown report generated ✓');

    const json = generator.generateJSON(report);
    console.log('JSON report generated ✓');

    console.log('\n✅ Example completed successfully!\n');
    console.log('To use real data:');
    console.log('1. Configure SimilarWeb and Ahrefs MCP servers');
    console.log('2. Update src/clients/mcp-client.ts to use real MCP clients');
    console.log('3. See MCP_INTEGRATION.md for detailed instructions\n');

  } catch (error) {
    console.error('❌ Error running example:', error);
    process.exit(1);
  }
}

// Run the example
main();
