/**
 * Report generator for competitive audit results
 */

import { CompetitiveAuditReport, SimilarWebMetrics, AhrefsMetrics, SEMRushMetrics } from '../types.js';
import { writeFileSync } from 'fs';
import { join } from 'path';

export class ReportGenerator {
  generateMarkdown(report: CompetitiveAuditReport): string {
    const lines: string[] = [];

    lines.push('# Competitive Audit Report\n');
    lines.push(`**Generated:** ${new Date(report.generatedAt).toLocaleString()}\n`);
    lines.push(`**Domains Analyzed:** ${report.domains.join(', ')}\n`);
    lines.push('---\n');

    // Executive Summary
    lines.push('## Executive Summary\n');
    if (report.analysis.insights.length > 0) {
      lines.push('### Key Insights\n');
      report.analysis.insights.forEach((insight) => {
        lines.push(`- ${insight}`);
      });
      lines.push('');
    }

    if (report.analysis.recommendations.length > 0) {
      lines.push('### Recommendations\n');
      report.analysis.recommendations.forEach((rec) => {
        lines.push(`- ${rec}`);
      });
      lines.push('');
    }

    lines.push('---\n');

    // Traffic & Engagement Metrics
    if (Object.keys(report.similarWebData).length > 0) {
      lines.push('## Traffic & Engagement Metrics\n');

      for (const domain of report.domains) {
        const metrics = report.similarWebData[domain];
        if (!metrics) continue;

        lines.push(`### ${domain}\n`);
        lines.push('| Metric | Value |');
        lines.push('|--------|-------|');

        if (metrics.globalRank) {
          lines.push(`| Global Rank | #${metrics.globalRank.toLocaleString()} |`);
        }
        if (metrics.visits) {
          lines.push(`| Monthly Visits | ${metrics.visits.toLocaleString()} |`);
        }
        if (metrics.bounceRate) {
          lines.push(`| Bounce Rate | ${metrics.bounceRate.toFixed(2)}% |`);
        }
        if (metrics.pagesPerVisit) {
          lines.push(`| Pages/Visit | ${metrics.pagesPerVisit.toFixed(2)} |`);
        }
        if (metrics.avgVisitDuration) {
          const minutes = Math.floor(metrics.avgVisitDuration / 60);
          const seconds = Math.floor(metrics.avgVisitDuration % 60);
          lines.push(`| Avg Visit Duration | ${minutes}m ${seconds}s |`);
        }

        if (metrics.trafficSources) {
          lines.push('');
          lines.push('**Traffic Sources:**');
          const sources = metrics.trafficSources;
          if (sources.search) lines.push(`- Search: ${sources.search.toFixed(2)}%`);
          if (sources.direct) lines.push(`- Direct: ${sources.direct.toFixed(2)}%`);
          if (sources.social) lines.push(`- Social: ${sources.social.toFixed(2)}%`);
          if (sources.referrals) lines.push(`- Referrals: ${sources.referrals.toFixed(2)}%`);
          if (sources.mail) lines.push(`- Mail: ${sources.mail.toFixed(2)}%`);
        }

        lines.push('');
      }

      lines.push('---\n');
    }

    // SEO & Backlink Metrics
    if (Object.keys(report.ahrefsData).length > 0) {
      lines.push('## SEO & Backlink Metrics\n');

      for (const domain of report.domains) {
        const metrics = report.ahrefsData[domain];
        if (!metrics) continue;

        lines.push(`### ${domain}\n`);
        lines.push('| Metric | Value |');
        lines.push('|--------|-------|');

        if (metrics.domainRating) {
          lines.push(`| Domain Rating | ${metrics.domainRating} |`);
        }
        if (metrics.ahrefsRank) {
          lines.push(`| Ahrefs Rank | #${metrics.ahrefsRank.toLocaleString()} |`);
        }
        if (metrics.backlinks) {
          lines.push(`| Backlinks | ${metrics.backlinks.toLocaleString()} |`);
        }
        if (metrics.referringDomains) {
          lines.push(`| Referring Domains | ${metrics.referringDomains.toLocaleString()} |`);
        }
        if (metrics.organicKeywords) {
          lines.push(`| Organic Keywords | ${metrics.organicKeywords.toLocaleString()} |`);
        }
        if (metrics.organicTraffic) {
          lines.push(`| Organic Traffic | ${metrics.organicTraffic.toLocaleString()} |`);
        }
        if (metrics.organicValue) {
          lines.push(`| Organic Value | $${metrics.organicValue.toLocaleString()} |`);
        }

        lines.push('');
      }

      lines.push('---\n');
    }

    // SEMRush Metrics
    if (Object.keys(report.semrushData).length > 0) {
      lines.push('## SEMRush Intelligence\n');

      for (const domain of report.domains) {
        const metrics = report.semrushData[domain];
        if (!metrics) continue;

        lines.push(`### ${domain}\n`);
        lines.push('| Metric | Value |');
        lines.push('|--------|-------|');

        if (metrics.authorityScore) {
          lines.push(`| Authority Score | ${metrics.authorityScore} |`);
        }
        if (metrics.organicSearchTraffic) {
          lines.push(`| Organic Traffic | ${metrics.organicSearchTraffic.toLocaleString()} |`);
        }
        if (metrics.paidSearchTraffic) {
          lines.push(`| Paid Traffic | ${metrics.paidSearchTraffic.toLocaleString()} |`);
        }
        if (metrics.organicKeywordsCount) {
          lines.push(`| Organic Keywords | ${metrics.organicKeywordsCount.toLocaleString()} |`);
        }
        if (metrics.paidKeywordsCount) {
          lines.push(`| Paid Keywords | ${metrics.paidKeywordsCount.toLocaleString()} |`);
        }
        if (metrics.organicTrafficCost) {
          lines.push(`| Organic Value | $${metrics.organicTrafficCost.toLocaleString()} |`);
        }
        if (metrics.paidTrafficCost) {
          lines.push(`| Paid Cost | $${metrics.paidTrafficCost.toLocaleString()} |`);
        }
        if (metrics.totalBacklinks) {
          lines.push(`| Total Backlinks | ${metrics.totalBacklinks.toLocaleString()} |`);
        }
        if (metrics.totalReferringDomains) {
          lines.push(`| Referring Domains | ${metrics.totalReferringDomains.toLocaleString()} |`);
        }

        // Ranking positions
        if (metrics.organicPositionsTop3 || metrics.organicPositionsTop10 || metrics.organicPositionsTop100) {
          lines.push('');
          lines.push('**Organic Positions:**');
          if (metrics.organicPositionsTop3) lines.push(`- Top 3: ${metrics.organicPositionsTop3.toLocaleString()}`);
          if (metrics.organicPositionsTop10) lines.push(`- Top 10: ${metrics.organicPositionsTop10.toLocaleString()}`);
          if (metrics.organicPositionsTop100) lines.push(`- Top 100: ${metrics.organicPositionsTop100.toLocaleString()}`);
        }

        // Backlinks breakdown
        if (metrics.backlinksOverview) {
          const bl = metrics.backlinksOverview;
          if (bl.follows || bl.noFollows || bl.govBacklinks || bl.eduBacklinks) {
            lines.push('');
            lines.push('**Backlinks Breakdown:**');
            if (bl.follows) lines.push(`- Follow: ${bl.follows.toLocaleString()}`);
            if (bl.noFollows) lines.push(`- NoFollow: ${bl.noFollows.toLocaleString()}`);
            if (bl.govBacklinks) lines.push(`- .gov: ${bl.govBacklinks.toLocaleString()}`);
            if (bl.eduBacklinks) lines.push(`- .edu: ${bl.eduBacklinks.toLocaleString()}`);
          }
        }

        lines.push('');
      }

      lines.push('---\n');
    }

    // Comparison Table
    lines.push('## Quick Comparison\n');
    lines.push('| Domain | Traffic | DR | Auth Score | Backlinks | Org. Keywords | Paid Traffic |');
    lines.push('|--------|---------|----+------------|-----------|---------------|--------------|');

    for (const domain of report.domains) {
      const sw = report.similarWebData[domain];
      const ah = report.ahrefsData[domain];
      const sr = report.semrushData[domain];

      const traffic = sw?.visits ? sw.visits.toLocaleString() : 'N/A';
      const dr = ah?.domainRating || 'N/A';
      const authScore = sr?.authorityScore || 'N/A';
      const backlinks = ah?.backlinks ? ah.backlinks.toLocaleString() : 'N/A';
      const keywords = ah?.organicKeywords ? ah.organicKeywords.toLocaleString() : 'N/A';
      const paidTraffic = sr?.paidSearchTraffic ? sr.paidSearchTraffic.toLocaleString() : 'N/A';

      lines.push(`| ${domain} | ${traffic} | ${dr} | ${authScore} | ${backlinks} | ${keywords} | ${paidTraffic} |`);
    }

    lines.push('');
    lines.push('---\n');
    lines.push(`\n*Report generated by Competitive Insights Tool*\n`);

    return lines.join('\n');
  }

  generateJSON(report: CompetitiveAuditReport): string {
    return JSON.stringify(report, null, 2);
  }

  generateHTML(report: CompetitiveAuditReport): string {
    const markdown = this.generateMarkdown(report);

    // Basic HTML wrapper with styling
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Competitive Audit Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        h2 { color: #34495e; margin-top: 30px; border-bottom: 2px solid #ecf0f1; padding-bottom: 8px; }
        h3 { color: #7f8c8d; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ecf0f1;
        }
        th {
            background: #3498db;
            color: white;
            font-weight: 600;
        }
        tr:hover { background: #f8f9fa; }
        ul { line-height: 1.8; }
        li { margin: 8px 0; }
        .meta { color: #7f8c8d; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <pre style="white-space: pre-wrap; font-family: inherit;">${markdown}</pre>
    </div>
</body>
</html>
    `.trim();
  }

  saveReport(report: CompetitiveAuditReport, format: 'json' | 'markdown' | 'html', outputPath?: string): string {
    let content: string;
    let extension: string;

    switch (format) {
      case 'json':
        content = this.generateJSON(report);
        extension = 'json';
        break;
      case 'markdown':
        content = this.generateMarkdown(report);
        extension = 'md';
        break;
      case 'html':
        content = this.generateHTML(report);
        extension = 'html';
        break;
    }

    const filename = outputPath || `competitive-audit-${Date.now()}.${extension}`;
    const filepath = filename.startsWith('/') ? filename : join(process.cwd(), 'reports', filename);

    // Ensure reports directory exists
    const reportsDir = join(process.cwd(), 'reports');
    try {
      writeFileSync(filepath, content, 'utf-8');
      console.log(`\n📄 Report saved to: ${filepath}`);
      return filepath;
    } catch (error) {
      // If reports directory doesn't exist, save to current directory
      const fallbackPath = join(process.cwd(), filename);
      writeFileSync(fallbackPath, content, 'utf-8');
      console.log(`\n📄 Report saved to: ${fallbackPath}`);
      return fallbackPath;
    }
  }
}
