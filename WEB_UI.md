# Web User Interface

The Competitive Insights tool now includes a beautiful, modern web interface for easy access to competitive analysis.

## 🚀 Quick Start

### Start the Web Server

```bash
npm run web
```

The server will start at `http://localhost:3000`

### Build and Run (Production)

```bash
npm run web:build
```

## 🎨 Features

### Modern, Responsive Design
- ✨ Beautiful gradient UI with professional styling
- 📱 Mobile-friendly responsive layout
- 🎯 Clean, intuitive interface

### Easy Domain Analysis
- Enter multiple domains (one per line)
- Choose data sources (SimilarWeb, Ahrefs, SEMRush)
- One-click audit execution

### Comprehensive Results Display
- **Key Metrics Cards**: Traffic leader, SEO leader, Authority leader
- **Insights List**: Automatic competitive insights
- **Recommendations**: Actionable suggestions
- **Domain-Specific Stats**: Detailed breakdowns for each domain

### Export Options
- Download HTML reports
- Download Markdown reports
- Download JSON data

## 📊 Using the Web Interface

### Step 1: Enter Domains

In the "Domains to Analyze" field, enter one domain per line:
```
allstate.com
progressive.com
geico.com
```

### Step 2: Select Data Sources

Choose which data sources to include:
- ☑️ **SimilarWeb Traffic** - Traffic metrics and sources
- ☑️ **Ahrefs SEO** - Domain rating, backlinks, keywords
- ☑️ **SEMRush Intelligence** - Authority score, paid search

### Step 3: Run Audit

Click "Run Competitive Audit" and wait for results.

### Step 4: Review Results

The interface displays:

**Summary Metrics:**
- Number of domains analyzed
- Traffic leader
- SEO leader
- Authority leader

**Key Insights:**
- Automatic analysis of competitive landscape
- Leader identification across metrics
- Paid search investment analysis

**Recommendations:**
- Actionable advice based on data
- SEO improvement suggestions
- Content strategy recommendations

**Domain Details:**
Each domain shows:
- Monthly visits
- Global rank
- Bounce rate & engagement
- Domain rating
- Backlinks count
- Organic keywords
- Authority score
- Traffic values

### Step 5: Download Reports

Click any download button to export:
- **HTML** - Styled, shareable report
- **Markdown** - Documentation-friendly format
- **JSON** - Raw data for analysis

## 🌐 API Endpoints

The web server exposes these endpoints:

### Health Check
```
GET /api/health
```

Returns server status.

### Run Audit
```
POST /api/audit
Content-Type: application/json

{
  "domains": ["example.com", "competitor.com"],
  "includeTraffic": true,
  "includeSEO": true,
  "includeSEMRush": true
}
```

Returns complete audit report.

### Generate Report
```
POST /api/generate-report
Content-Type: application/json

{
  "report": { ... },
  "format": "html|markdown|json"
}
```

Downloads formatted report.

## 🔧 Configuration

### Change Port

```bash
PORT=8080 npm run web
```

### Environment Variables

The web server uses the same `.env` configuration:
- `SIMILARWEB_API_KEY`
- `AHREFS_API_KEY`
- `SEMRUSH_API_KEY`
- `USE_MOCK_DATA`

## 📁 File Structure

```
public/
├── index.html       # Main UI page
└── app.js          # Client-side JavaScript

src/
└── server.ts       # Express web server
```

## 🎯 Use Cases

### Team Collaboration
Share `http://localhost:3000` with your team on the local network for collaborative analysis.

### Quick Demos
Perfect for presenting competitive analysis to stakeholders without command-line knowledge.

### Easy Exports
Download reports in multiple formats for different audiences.

### Regular Monitoring
Bookmark the URL for quick access to competitive intelligence.

## 🔒 Security Notes

- The web UI runs locally by default
- API keys are stored server-side in `.env`
- No data is sent to external servers (except MCP APIs)
- Reports generated in-browser can be saved locally

## 🐛 Troubleshooting

### Port Already in Use

```bash
PORT=3001 npm run web
```

### Cannot Access from Another Device

The server binds to `localhost` by default. To allow external access:

```javascript
// In src/server.ts, change:
app.listen(PORT, '0.0.0.0', () => { ... });
```

⚠️ **Security Warning**: Only expose to trusted networks.

### Slow Audit Results

Large numbers of domains or network latency may cause delays. The UI shows a loading spinner during analysis.

## 💡 Tips

1. **Save Common Audits**: Bookmark specific domain combinations in your browser
2. **Compare Over Time**: Run audits regularly and compare JSON exports
3. **Share Reports**: HTML exports are self-contained and email-friendly
4. **Mobile Access**: The responsive design works great on tablets
5. **Batch Analysis**: Analyze up to 5-10 domains efficiently

## 🚀 Next Steps

- Start the server: `npm run web`
- Open: `http://localhost:3000`
- Enter your domains
- Click "Run Competitive Audit"
- Review insights and download reports!

## 📞 Support

For issues with the web UI:
- Check console logs in browser (F12)
- Check server logs in terminal
- Verify API keys in `.env`
- Test MCP connections: `npm run test-mcp`
