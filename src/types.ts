/**
 * Type definitions for competitive audit data
 */

export interface DomainMetrics {
  domain: string;
  timestamp: string;
}

export interface SimilarWebMetrics extends DomainMetrics {
  globalRank?: number;
  countryRank?: number;
  categoryRank?: number;
  visits?: number;
  bounceRate?: number;
  pagesPerVisit?: number;
  avgVisitDuration?: number;
  trafficSources?: TrafficSources;
  topCountries?: CountryTraffic[];
  topReferrals?: Referral[];
  competitorsList?: string[];
}

export interface TrafficSources {
  direct?: number;
  search?: number;
  social?: number;
  referrals?: number;
  mail?: number;
  paid?: number;
  display?: number;
}

export interface CountryTraffic {
  country: string;
  share: number;
}

export interface Referral {
  domain: string;
  share: number;
}

export interface AhrefsMetrics extends DomainMetrics {
  domainRating?: number;
  ahrefsRank?: number;
  backlinks?: number;
  referringDomains?: number;
  organicKeywords?: number;
  organicTraffic?: number;
  organicValue?: number;
  topPages?: TopPage[];
  topKeywords?: Keyword[];
  topBacklinks?: Backlink[];
}

export interface TopPage {
  url: string;
  traffic: number;
  keywords: number;
  topKeyword?: string;
}

export interface Keyword {
  keyword: string;
  volume?: number;
  position?: number;
  traffic?: number;
  difficulty?: number;
}

export interface Backlink {
  sourceUrl: string;
  targetUrl: string;
  anchorText: string;
  domainRating?: number;
}

export interface SEMRushMetrics extends DomainMetrics {
  // Domain Overview
  organicSearchTraffic?: number;
  paidSearchTraffic?: number;
  authorityScore?: number;
  totalBacklinks?: number;
  totalReferringDomains?: number;

  // Keyword Metrics
  organicKeywordsCount?: number;
  paidKeywordsCount?: number;
  organicTrafficCost?: number;
  paidTrafficCost?: number;

  // Rankings
  organicPositionsTop3?: number;
  organicPositionsTop10?: number;
  organicPositionsTop100?: number;

  // Competitors
  organicCompetitors?: Competitor[];
  paidCompetitors?: Competitor[];

  // Top Keywords
  topOrganicKeywords?: SEMRushKeyword[];
  topPaidKeywords?: SEMRushKeyword[];

  // Backlinks
  backlinksOverview?: BacklinksOverview;
}

export interface Competitor {
  domain: string;
  competitionLevel: number;
  commonKeywords?: number;
}

export interface SEMRushKeyword {
  keyword: string;
  position?: number;
  volume?: number;
  cpc?: number;
  competition?: number;
  traffic?: number;
  trafficCost?: number;
  url?: string;
  difficulty?: number;
}

export interface BacklinksOverview {
  total?: number;
  follows?: number;
  noFollows?: number;
  govBacklinks?: number;
  eduBacklinks?: number;
  referringDomains?: number;
  referringIPs?: number;
}

export interface CompetitiveAuditReport {
  generatedAt: string;
  domains: string[];
  similarWebData: Record<string, SimilarWebMetrics>;
  ahrefsData: Record<string, AhrefsMetrics>;
  semrushData: Record<string, SEMRushMetrics>;
  analysis: CompetitiveAnalysis;
}

export interface CompetitiveAnalysis {
  trafficLeader?: string;
  seoLeader?: string;
  topBacklinksDomain?: string;
  mostOrganicKeywords?: string;
  highestAuthorityScore?: string;
  bestPaidSearchPerformance?: string;
  insights: string[];
  recommendations: string[];
}

export interface AuditOptions {
  domains: string[];
  includeTraffic?: boolean;
  includeSEO?: boolean;
  includeBacklinks?: boolean;
  includeKeywords?: boolean;
  includeSEMRush?: boolean;
  outputFormat?: 'json' | 'markdown' | 'html';
  outputFile?: string;
}
