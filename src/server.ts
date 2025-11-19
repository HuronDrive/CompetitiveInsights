/**
 * Web server for Competitive Insights UI
 */

import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { CompetitiveAuditService } from './services/audit-service.js';
import { ReportGenerator } from './utils/report-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, '../public')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Run audit endpoint
app.post('/api/audit', async (req, res) => {
  try {
    const { domains, includeTraffic, includeSEO, includeSEMRush } = req.body;

    if (!domains || !Array.isArray(domains) || domains.length === 0) {
      return res.status(400).json({ error: 'Please provide at least one domain' });
    }

    // Validate domains
    const validDomains = domains.filter(d => d && d.trim().length > 0);
    if (validDomains.length === 0) {
      return res.status(400).json({ error: 'No valid domains provided' });
    }

    console.log(`Running audit for: ${validDomains.join(', ')}`);

    const service = new CompetitiveAuditService();
    const report = await service.runAudit({
      domains: validDomains,
      includeTraffic: includeTraffic !== false,
      includeSEO: includeSEO !== false,
      includeSEMRush: includeSEMRush !== false,
    });

    res.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error('Audit error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Generate report endpoint
app.post('/api/generate-report', async (req, res) => {
  try {
    const { report, format } = req.body;

    if (!report) {
      return res.status(400).json({ error: 'No report data provided' });
    }

    const generator = new ReportGenerator();
    let content: string;

    switch (format) {
      case 'html':
        content = generator.generateHTML(report);
        res.setHeader('Content-Type', 'text/html');
        break;
      case 'markdown':
        content = generator.generateMarkdown(report);
        res.setHeader('Content-Type', 'text/markdown');
        break;
      case 'json':
        content = generator.generateJSON(report);
        res.setHeader('Content-Type', 'application/json');
        break;
      default:
        return res.status(400).json({ error: 'Invalid format' });
    }

    res.setHeader('Content-Disposition', `attachment; filename="competitive-audit.${format}"`);
    res.send(content);
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Competitive Insights Web UI`);
  console.log(`📊 Server running at: http://localhost:${PORT}`);
  console.log(`📈 Open your browser to get started!\n`);
});
