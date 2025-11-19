/**
 * Main entry point for the Competitive Insights library
 * Export all public APIs for programmatic usage
 */

export { CompetitiveAuditService } from './services/audit-service.js';
export { SimilarWebService } from './services/similarweb-service.js';
export { AhrefsService } from './services/ahrefs-service.js';
export { SEMRushService } from './services/semrush-service.js';
export { ReportGenerator } from './utils/report-generator.js';
export { createMCPClient } from './clients/mcp-client.js';

export type { MCPClient, MCPClientConfig } from './clients/mcp-client.js';
export type {
  CompetitiveAuditReport,
  AuditOptions,
  SimilarWebMetrics,
  AhrefsMetrics,
  SEMRushMetrics,
  CompetitiveAnalysis,
  DomainMetrics,
  TrafficSources,
  Keyword,
  Backlink,
  TopPage,
  SEMRushKeyword,
  Competitor,
  BacklinksOverview,
} from './types.js';

// Example usage for developers
export const example = {
  quickAudit: async (domains: string[]) => {
    const { CompetitiveAuditService } = await import('./services/audit-service.js');
    const service = new CompetitiveAuditService();

    return service.runAudit({
      domains,
      includeTraffic: true,
      includeSEO: true,
    });
  },
};
