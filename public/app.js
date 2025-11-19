// Competitive Insights Web UI - Client-side JavaScript

let currentReport = null;

// Handle form submission
document.getElementById('auditForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await runAudit();
});

async function runAudit() {
    const domainsText = document.getElementById('domains').value;
    const domains = domainsText
        .split('\n')
        .map(d => d.trim())
        .filter(d => d.length > 0);

    if (domains.length === 0) {
        alert('Please enter at least one domain');
        return;
    }

    const includeTraffic = document.getElementById('includeTraffic').checked;
    const includeSEO = document.getElementById('includeSEO').checked;
    const includeSEMRush = document.getElementById('includeSEMRush').checked;

    // Show loading, hide results
    document.getElementById('loading').classList.add('active');
    document.getElementById('results').classList.remove('active');
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('btnText').textContent = 'Analyzing...';

    try {
        const response = await fetch('/api/audit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                domains,
                includeTraffic,
                includeSEO,
                includeSEMRush,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Audit failed');
        }

        currentReport = data.report;
        displayResults(data.report);
    } catch (error) {
        console.error('Error:', error);
        alert(`Error running audit: ${error.message}`);
    } finally {
        document.getElementById('loading').classList.remove('active');
        document.getElementById('submitBtn').disabled = false;
        document.getElementById('btnText').textContent = 'Run Competitive Audit';
    }
}

function displayResults(report) {
    const { analysis, domains, similarWebData, ahrefsData, semrushData } = report;

    // Display key metrics
    const metricGrid = document.getElementById('metricGrid');
    metricGrid.innerHTML = '';

    const metrics = [
        { label: 'Domains Analyzed', value: domains.length },
        { label: 'Traffic Leader', value: analysis.trafficLeader || 'N/A' },
        { label: 'SEO Leader', value: analysis.seoLeader || 'N/A' },
        { label: 'Authority Leader', value: analysis.highestAuthorityScore || 'N/A' },
    ];

    metrics.forEach(metric => {
        const card = document.createElement('div');
        card.className = 'metric-card';
        card.innerHTML = `
            <div class="metric-label">${metric.label}</div>
            <div class="metric-value">${metric.value}</div>
        `;
        metricGrid.appendChild(card);
    });

    // Display insights
    const insightsList = document.getElementById('insightsList');
    insightsList.innerHTML = '';
    analysis.insights.forEach(insight => {
        const li = document.createElement('li');
        li.textContent = insight;
        insightsList.appendChild(li);
    });

    // Display recommendations
    const recommendationsList = document.getElementById('recommendationsList');
    recommendationsList.innerHTML = '';
    analysis.recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
        recommendationsList.appendChild(li);
    });

    // Display domain-specific results
    const domainResults = document.getElementById('domainResults');
    domainResults.innerHTML = '';

    domains.forEach(domain => {
        const card = document.createElement('div');
        card.className = 'card domain-card';

        const swData = similarWebData[domain] || {};
        const ahData = ahrefsData[domain] || {};
        const srData = semrushData[domain] || {};

        card.innerHTML = `
            <h3>🌐 ${domain}</h3>
            <div class="stats-grid">
                ${swData.visits ? `
                <div class="stat-item">
                    <div class="stat-label">Monthly Visits</div>
                    <div class="stat-value">${formatNumber(swData.visits)}</div>
                </div>` : ''}

                ${swData.globalRank ? `
                <div class="stat-item">
                    <div class="stat-label">Global Rank</div>
                    <div class="stat-value">#${formatNumber(swData.globalRank)}</div>
                </div>` : ''}

                ${swData.bounceRate ? `
                <div class="stat-item">
                    <div class="stat-label">Bounce Rate</div>
                    <div class="stat-value">${swData.bounceRate.toFixed(2)}%</div>
                </div>` : ''}

                ${swData.pagesPerVisit ? `
                <div class="stat-item">
                    <div class="stat-label">Pages/Visit</div>
                    <div class="stat-value">${swData.pagesPerVisit.toFixed(2)}</div>
                </div>` : ''}

                ${ahData.domainRating ? `
                <div class="stat-item">
                    <div class="stat-label">Domain Rating</div>
                    <div class="stat-value">${ahData.domainRating}</div>
                </div>` : ''}

                ${ahData.backlinks ? `
                <div class="stat-item">
                    <div class="stat-label">Backlinks</div>
                    <div class="stat-value">${formatNumber(ahData.backlinks)}</div>
                </div>` : ''}

                ${ahData.organicKeywords ? `
                <div class="stat-item">
                    <div class="stat-label">Organic Keywords</div>
                    <div class="stat-value">${formatNumber(ahData.organicKeywords)}</div>
                </div>` : ''}

                ${ahData.organicValue ? `
                <div class="stat-item">
                    <div class="stat-label">Organic Value</div>
                    <div class="stat-value">$${formatNumber(ahData.organicValue)}</div>
                </div>` : ''}

                ${srData.authorityScore ? `
                <div class="stat-item">
                    <div class="stat-label">Authority Score</div>
                    <div class="stat-value">${srData.authorityScore}</div>
                </div>` : ''}

                ${srData.organicSearchTraffic ? `
                <div class="stat-item">
                    <div class="stat-label">Organic Traffic</div>
                    <div class="stat-value">${formatNumber(srData.organicSearchTraffic)}</div>
                </div>` : ''}

                ${srData.paidSearchTraffic ? `
                <div class="stat-item">
                    <div class="stat-label">Paid Traffic</div>
                    <div class="stat-value">${formatNumber(srData.paidSearchTraffic)}</div>
                </div>` : ''}

                ${srData.organicKeywordsCount ? `
                <div class="stat-item">
                    <div class="stat-label">SEMRush Keywords</div>
                    <div class="stat-value">${formatNumber(srData.organicKeywordsCount)}</div>
                </div>` : ''}
            </div>
        `;

        domainResults.appendChild(card);
    });

    // Show results
    document.getElementById('results').classList.add('active');

    // Scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

async function downloadReport(format) {
    if (!currentReport) {
        alert('No report to download');
        return;
    }

    try {
        const response = await fetch('/api/generate-report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                report: currentReport,
                format: format,
            }),
        });

        if (!response.ok) {
            throw new Error('Report generation failed');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `competitive-audit.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error:', error);
        alert(`Error downloading report: ${error.message}`);
    }
}

function formatNumber(num) {
    if (num === undefined || num === null) return 'N/A';
    return num.toLocaleString();
}
