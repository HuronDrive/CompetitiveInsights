#!/usr/bin/env node

/**
 * CLI interface for the Competitive Insights tool
 */

import { Command } from 'commander';
import { CompetitiveAuditService } from './services/audit-service.js';
import { ReportGenerator } from './utils/report-generator.js';
import { AuditOptions } from './types.js';

const program = new Command();

program
  .name('competitive-insights')
  .description('Competitive audit tool using SimilarWeb and Ahrefs data')
  .version('1.0.0');

program
  .command('audit')
  .description('Run a competitive audit for specified domains')
  .argument('<domains...>', 'Domains to analyze (space-separated)')
  .option('-o, --output <file>', 'Output file path')
  .option('-f, --format <format>', 'Output format: json, markdown, or html', 'markdown')
  .option('--no-traffic', 'Skip traffic metrics from SimilarWeb')
  .option('--no-seo', 'Skip SEO metrics from Ahrefs')
  .action(async (domains: string[], options: any) => {
    try {
      console.log('\n🚀 Competitive Insights Audit Tool\n');

      const auditOptions: AuditOptions = {
        domains,
        includeTraffic: options.traffic !== false,
        includeSEO: options.seo !== false,
        outputFormat: options.format,
        outputFile: options.output,
      };

      const service = new CompetitiveAuditService();
      const report = await service.runAudit(auditOptions);

      // Display summary
      console.log('📊 Analysis Summary:');
      console.log('==================\n');

      if (report.analysis.insights.length > 0) {
        console.log('Key Insights:');
        report.analysis.insights.forEach((insight) => {
          console.log(`  ✓ ${insight}`);
        });
        console.log('');
      }

      if (report.analysis.recommendations.length > 0) {
        console.log('Recommendations:');
        report.analysis.recommendations.forEach((rec) => {
          console.log(`  → ${rec}`);
        });
        console.log('');
      }

      // Generate and save report
      const generator = new ReportGenerator();
      const filepath = generator.saveReport(
        report,
        options.format as 'json' | 'markdown' | 'html',
        options.output
      );

      console.log('\n✅ Audit complete!\n');
    } catch (error) {
      console.error('❌ Error running audit:', error);
      process.exit(1);
    }
  });

program
  .command('backlinks')
  .description('Analyze backlinks for specified domains')
  .argument('<domains...>', 'Domains to analyze')
  .option('-l, --limit <number>', 'Number of backlinks to fetch per domain', '50')
  .action(async (domains: string[], options: any) => {
    try {
      console.log('\n🔗 Backlink Analysis\n');

      const service = new CompetitiveAuditService();
      const results = await service.getDetailedBacklinkAnalysis(domains);

      console.log(JSON.stringify(results, null, 2));
      console.log('\n✅ Analysis complete!\n');
    } catch (error) {
      console.error('❌ Error analyzing backlinks:', error);
      process.exit(1);
    }
  });

program
  .command('keywords')
  .description('Analyze keyword gaps between competitors')
  .argument('<domains...>', 'Domains to analyze')
  .action(async (domains: string[]) => {
    try {
      console.log('\n🔑 Keyword Gap Analysis\n');

      const service = new CompetitiveAuditService();
      const results = await service.getKeywordGapAnalysis(domains);

      console.log(JSON.stringify(results, null, 2));
      console.log('\n✅ Analysis complete!\n');
    } catch (error) {
      console.error('❌ Error analyzing keywords:', error);
      process.exit(1);
    }
  });

program
  .command('traffic-sources')
  .description('Compare traffic sources across competitors')
  .argument('<domains...>', 'Domains to analyze')
  .action(async (domains: string[]) => {
    try {
      console.log('\n📈 Traffic Sources Comparison\n');

      const service = new CompetitiveAuditService();
      const results = await service.getTrafficSourcesComparison(domains);

      for (const [domain, sources] of Object.entries(results)) {
        console.log(`\n${domain}:`);
        console.log(JSON.stringify(sources, null, 2));
      }

      console.log('\n✅ Analysis complete!\n');
    } catch (error) {
      console.error('❌ Error analyzing traffic sources:', error);
      process.exit(1);
    }
  });

program.parse();
