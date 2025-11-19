#!/usr/bin/env node
/**
 * Test MCP server connections and API keys
 */

import { config } from 'dotenv';
import { createMCPClient } from '../src/clients/mcp-client.js';

// Load environment variables
config();

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

interface TestResult {
  service: string;
  configured: boolean;
  connected?: boolean;
  error?: string;
}

async function testMCPConnection(
  serviceName: string,
  apiKeyEnvVar: string
): Promise<TestResult> {
  const apiKey = process.env[apiKeyEnvVar];

  if (!apiKey || apiKey.trim() === '') {
    return {
      service: serviceName,
      configured: false,
    };
  }

  try {
    const client = createMCPClient({ serverName: serviceName.toLowerCase() });
    const tools = await client.listTools();

    console.log(`  ${GREEN}✓${RESET} Found ${tools.length} tools available`);

    // Try a simple test call (this will use mock data for now)
    if (serviceName === 'SimilarWeb') {
      await client.callTool('get_website_traffic', { domain: 'example.com' });
    } else if (serviceName === 'Ahrefs') {
      await client.callTool('get_domain_rating', { domain: 'example.com' });
    } else if (serviceName === 'SEMRush') {
      await client.callTool('domain_overview', { domain: 'example.com' });
    }

    return {
      service: serviceName,
      configured: true,
      connected: true,
    };
  } catch (error) {
    return {
      service: serviceName,
      configured: true,
      connected: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  console.log(`\n${BLUE}🔍 MCP Server Connection Test${RESET}\n`);
  console.log('Testing API key configuration and MCP server connectivity...\n');

  const useMockData = process.env.USE_MOCK_DATA !== 'false';

  if (useMockData) {
    console.log(`${YELLOW}⚠️  Running in MOCK DATA mode${RESET}`);
    console.log(`   Set USE_MOCK_DATA=false in .env to test real API connections\n`);
  }

  const results: TestResult[] = [];

  // Test SimilarWeb
  console.log(`${BLUE}Testing SimilarWeb...${RESET}`);
  const swResult = await testMCPConnection('SimilarWeb', 'SIMILARWEB_API_KEY');
  results.push(swResult);

  if (!swResult.configured) {
    console.log(`  ${YELLOW}⚠${RESET} API key not configured`);
  } else if (swResult.connected) {
    console.log(`  ${GREEN}✓${RESET} Connection successful`);
  } else {
    console.log(`  ${RED}✗${RESET} Connection failed: ${swResult.error}`);
  }

  // Test Ahrefs
  console.log(`\n${BLUE}Testing Ahrefs...${RESET}`);
  const ahResult = await testMCPConnection('Ahrefs', 'AHREFS_API_KEY');
  results.push(ahResult);

  if (!ahResult.configured) {
    console.log(`  ${YELLOW}⚠${RESET} API key not configured`);
  } else if (ahResult.connected) {
    console.log(`  ${GREEN}✓${RESET} Connection successful`);
  } else {
    console.log(`  ${RED}✗${RESET} Connection failed: ${ahResult.error}`);
  }

  // Test SEMRush
  console.log(`\n${BLUE}Testing SEMRush...${RESET}`);
  const srResult = await testMCPConnection('SEMRush', 'SEMRUSH_API_KEY');
  results.push(srResult);

  if (!srResult.configured) {
    console.log(`  ${YELLOW}⚠${RESET} API key not configured`);
  } else if (srResult.connected) {
    console.log(`  ${GREEN}✓${RESET} Connection successful`);
  } else {
    console.log(`  ${RED}✗${RESET} Connection failed: ${srResult.error}`);
  }

  // Summary
  console.log(`\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
  console.log(`${BLUE}Summary:${RESET}\n`);

  const configured = results.filter((r) => r.configured).length;
  const connected = results.filter((r) => r.connected).length;

  console.log(`Services configured: ${configured}/3`);
  console.log(`Services connected: ${connected}/3`);

  if (configured === 0) {
    console.log(`\n${YELLOW}No API keys configured yet.${RESET}`);
    console.log(`\nTo get started:`);
    console.log(`1. Edit the .env file and add your API keys`);
    console.log(`2. Get API keys from:`);
    console.log(`   - SimilarWeb: https://account.similarweb.com/api-management`);
    console.log(`   - Ahrefs: https://ahrefs.com/api`);
    console.log(`   - SEMRush: https://www.semrush.com/api-analytics/`);
    console.log(`3. Set USE_MOCK_DATA=false to test real connections`);
    console.log(`4. Run: npm run test-mcp\n`);
  } else if (configured > 0 && connected === configured) {
    console.log(`\n${GREEN}✓ All configured services are working!${RESET}`);
    console.log(`\nYou're ready to run competitive audits with real data.`);
    console.log(`Try: npm run audit example.com competitor.com\n`);
  } else {
    console.log(`\n${YELLOW}Some services need attention.${RESET}`);
    console.log(`Check the error messages above and verify your API keys.\n`);
  }

  console.log(`${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n`);
}

main().catch(console.error);
