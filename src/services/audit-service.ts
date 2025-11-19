/**
 * Main competitive audit service that orchestrates data collection and analysis
 */

import { createMCPClient } from '../clients/mcp-client.js';
import { SimilarWebService } from './similarweb-service.js';
import { AhrefsService } from './ahrefs-service.js';
import { SEMRushService } from './semrush-service.js';
import {
  CompetitiveAuditReport,
  AuditOptions,
  SimilarWebMetrics,
  AhrefsMetrics,
  SEMRushMetrics,
  CompetitiveAnalysis,
} from '../types.js';

export class CompetitiveAuditService {
  private similarWebService: SimilarWebService;
  private ahrefsService: AhrefsService;
  private semrushService: SEMRushService;

  constructor() {
    const similarWebClient = createMCPClient({ serverName: 'similarweb' });
    const ahrefsClient = createMCPClient({ serverName: 'ahrefs' });
    const semrushClient = createMCPClient({ serverName: 'semrush' });

    this.similarWebService = new SimilarWebService(similarWebClient);
    this.ahrefsService = new AhrefsService(ahrefsClient);
    this.semrushService = new SEMRushService(semrushClient);
  }

  async runAudit(options: AuditOptions): Promise<CompetitiveAuditReport> {
    const { domains, includeTraffic = true, includeSEO = true, includeSEMRush = true } = options;

    console.log(`\n🔍 Running competitive audit for ${domains.length} domains...`);

    // Fetch data for all domains in parallel
    const similarWebData: Record<string, SimilarWebMetrics> = {};
    const ahrefsData: Record<string, AhrefsMetrics> = {};
    const semrushData: Record<string, SEMRushMetrics> = {};

    const promises = domains.map(async (domain) => {
      console.log(`  📊 Fetching data for ${domain}...`);

      if (includeTraffic) {
        similarWebData[domain] = await this.similarWebService.getDomainMetrics(domain);
      }

      if (includeSEO) {
        ahrefsData[domain] = await this.ahrefsService.getDomainMetrics(domain);
      }

      if (includeSEMRush) {
        semrushData[domain] = await this.semrushService.getDomainMetrics(domain);
      }
    });

    await Promise.all(promises);

    console.log(`\n✅ Data collection complete. Analyzing results...\n`);

    // Analyze the collected data
    const analysis = this.analyzeCompetitiveData(domains, similarWebData, ahrefsData, semrushData);

    return {
      generatedAt: new Date().toISOString(),
      domains,
      similarWebData,
      ahrefsData,
      semrushData,
      analysis,
    };
  }

  private analyzeCompetitiveData(
    domains: string[],
    similarWebData: Record<string, SimilarWebMetrics>,
    ahrefsData: Record<string, AhrefsMetrics>,
    semrushData: Record<string, SEMRushMetrics>
  ): CompetitiveAnalysis {
    const insights: string[] = [];
    const recommendations: string[] = [];

    // Find traffic leader
    let trafficLeader: string | undefined;
    let maxVisits = 0;
    for (const domain of domains) {
      const visits = similarWebData[domain]?.visits || 0;
      if (visits > maxVisits) {
        maxVisits = visits;
        trafficLeader = domain;
      }
    }

    if (trafficLeader) {
      insights.push(`${trafficLeader} leads in traffic with ${maxVisits.toLocaleString()} monthly visits`);
    }

    // Find SEO leader (by domain rating)
    let seoLeader: string | undefined;
    let maxDR = 0;
    for (const domain of domains) {
      const dr = ahrefsData[domain]?.domainRating || 0;
      if (dr > maxDR) {
        maxDR = dr;
        seoLeader = domain;
      }
    }

    if (seoLeader) {
      insights.push(`${seoLeader} has the highest domain authority (DR: ${maxDR})`);
    }

    // Find backlinks leader
    let topBacklinksDomain: string | undefined;
    let maxBacklinks = 0;
    for (const domain of domains) {
      const backlinks = ahrefsData[domain]?.backlinks || 0;
      if (backlinks > maxBacklinks) {
        maxBacklinks = backlinks;
        topBacklinksDomain = domain;
      }
    }

    if (topBacklinksDomain) {
      insights.push(`${topBacklinksDomain} has the most backlinks (${maxBacklinks.toLocaleString()})`);
    }

    // Find organic keywords leader
    let mostOrganicKeywords: string | undefined;
    let maxKeywords = 0;
    for (const domain of domains) {
      const keywords = ahrefsData[domain]?.organicKeywords || 0;
      if (keywords > maxKeywords) {
        maxKeywords = keywords;
        mostOrganicKeywords = domain;
      }
    }

    if (mostOrganicKeywords) {
      insights.push(`${mostOrganicKeywords} ranks for the most organic keywords (${maxKeywords.toLocaleString()})`);
    }

    // Find highest authority score (SEMRush)
    let highestAuthorityScore: string | undefined;
    let maxAuthScore = 0;
    for (const domain of domains) {
      const authScore = semrushData[domain]?.authorityScore || 0;
      if (authScore > maxAuthScore) {
        maxAuthScore = authScore;
        highestAuthorityScore = domain;
      }
    }

    if (highestAuthorityScore && maxAuthScore > 0) {
      insights.push(`${highestAuthorityScore} has the highest authority score (${maxAuthScore})`);
    }

    // Find best paid search performance (SEMRush)
    let bestPaidSearchPerformance: string | undefined;
    let maxPaidTraffic = 0;
    for (const domain of domains) {
      const paidTraffic = semrushData[domain]?.paidSearchTraffic || 0;
      if (paidTraffic > maxPaidTraffic) {
        maxPaidTraffic = paidTraffic;
        bestPaidSearchPerformance = domain;
      }
    }

    if (bestPaidSearchPerformance && maxPaidTraffic > 0) {
      insights.push(`${bestPaidSearchPerformance} leads in paid search traffic (${maxPaidTraffic.toLocaleString()} visits)`);
    }

    // Analyze organic vs paid balance
    for (const domain of domains) {
      const semrush = semrushData[domain];
      if (semrush?.organicSearchTraffic && semrush?.paidSearchTraffic) {
        const paidRatio = (semrush.paidSearchTraffic / (semrush.organicSearchTraffic + semrush.paidSearchTraffic)) * 100;
        if (paidRatio > 30) {
          insights.push(`${domain} invests heavily in paid search (${paidRatio.toFixed(1)}% of search traffic)`);
        }
      }
    }

    // Generate recommendations based on analysis
    recommendations.push('Focus on content strategy to increase organic keyword rankings');
    recommendations.push('Build quality backlinks from high-authority domains');
    recommendations.push('Optimize user engagement metrics (bounce rate, time on site)');
    recommendations.push('Diversify traffic sources beyond organic search');

    if (maxAuthScore > 0) {
      recommendations.push('Improve domain authority through quality content and technical SEO');
    }

    if (maxPaidTraffic > 0) {
      recommendations.push('Consider paid search campaigns to complement organic efforts');
    }

    return {
      trafficLeader,
      seoLeader,
      topBacklinksDomain,
      mostOrganicKeywords,
      highestAuthorityScore,
      bestPaidSearchPerformance,
      insights,
      recommendations,
    };
  }

  async getDetailedBacklinkAnalysis(domains: string[]) {
    const results: Record<string, any> = {};

    for (const domain of domains) {
      results[domain] = await this.ahrefsService.getBacklinks(domain, 50);
    }

    return results;
  }

  async getKeywordGapAnalysis(domains: string[]) {
    const results: Record<string, any> = {};

    for (const domain of domains) {
      results[domain] = await this.ahrefsService.getTopKeywords(domain, 100);
    }

    return results;
  }

  async getTrafficSourcesComparison(domains: string[]) {
    const results: Record<string, any> = {};

    for (const domain of domains) {
      results[domain] = await this.similarWebService.getTrafficSources(domain);
    }

    return results;
  }
}
