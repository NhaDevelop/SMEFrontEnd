import { defineEventHandler, setHeader } from 'h3'
import { db } from '~/server/utils/db'

/**
 * GET /api/reports/portfolio
 * Returns a Portfolio Comparison report as a printable HTML page.
 */
export default defineEventHandler((event) => {
  const allSmes = db.smes.findAll() as any[]
  const settings = db.settings.get() as any
  const pillars = settings?.pillars || []

  const now = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })

  db.reportLogs.create({
    type: 'PDF',
    name: 'Portfolio Comparison',
    company: 'All SMEs',
  })

  // Summary stats
  const avgScore = allSmes.length > 0 ? Math.round(allSmes.reduce((s, x) => s + (x.score || 0), 0) / allSmes.length) : 0
  const highRisk = allSmes.filter(s => (s.score || 0) < 40).length
  const medRisk = allSmes.filter(s => (s.score || 0) >= 40 && (s.score || 0) < 70).length
  const lowRisk = allSmes.filter(s => (s.score || 0) >= 70).length

  // SME rows sorted by score descending
  const sorted = [...allSmes].sort((a, b) => (b.score || 0) - (a.score || 0))

  const tableRows = sorted.map((sme, idx) => {
    const score = sme.score || 0
    const risk = score >= 70 ? 'Low' : score >= 40 ? 'Medium' : 'High'
    const riskColor = risk === 'Low' ? '#16a34a' : risk === 'Medium' ? '#d97706' : '#dc2626'
    const bar = Math.min(100, score)
    return `<tr style="background:${idx % 2 === 0 ? '#f9fafb' : '#fff'};">
      <td style="padding:8px 12px;font-size:13px;font-weight:600;">${sme.name}</td>
      <td style="padding:8px 12px;font-size:12px;color:#6b7280;">${sme.industry || 'General'}</td>
      <td style="padding:8px 12px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="background:#e5e7eb;border-radius:4px;height:8px;width:120px;flex-shrink:0;">
            <div style="background:#0d9488;border-radius:4px;height:8px;width:${bar}%;"></div>
          </div>
          <span style="font-size:13px;font-weight:700;">${score}</span>
        </div>
      </td>
      <td style="padding:8px 12px;"><span style="color:${riskColor};font-weight:600;font-size:12px;">${risk} Risk</span></td>
      <td style="padding:8px 12px;font-size:12px;color:#6b7280;">${sme.lastAssessmentDate || 'N/A'}</td>
    </tr>`
  }).join('')

  // Pillar averages across all SMEs — sme.pillars is an ARRAY of { name, score }
  const pillarRows = pillars.map((p: any) => {
    const scores = allSmes.map((s: any) => {
      if (!Array.isArray(s.pillars)) return 0
      const entry = s.pillars.find((sp: any) =>
        sp.name?.toLowerCase().trim() === p.name?.toLowerCase().trim() ||
        String(sp.id) === String(p.id)
      )
      return entry ? (entry.score || 0) : 0
    })
    const avg = scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0
    return `<tr>
      <td style="padding:6px 8px;font-size:13px;">${p.name}</td>
      <td style="padding:6px 8px;">
        <div style="background:#e5e7eb;border-radius:4px;height:10px;">
          <div style="background:#0d9488;width:${avg}%;height:10px;border-radius:4px;"></div>
        </div>
      </td>
      <td style="padding:6px 8px;font-size:13px;font-weight:600;text-align:right;">${avg}%</td>
    </tr>`
  }).join('')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Portfolio Comparison — IRIP</title>
  <style>
    body { font-family: -apple-system, sans-serif; color: #111827; margin: 0; padding: 32px 48px; background: #fff; }
    table { border-collapse: collapse; }
    @media print { body { padding: 16px; } }
  </style>
</head>
<body>
  <!-- Header -->
  <table style="width:100%;border-bottom:3px solid #0d9488;padding-bottom:16px;margin-bottom:28px;">
    <tr>
      <td><h1 style="margin:0;font-size:22px;color:#0d9488;">IRIP</h1>
        <p style="margin:2px 0 0;font-size:12px;color:#6b7280;">Investment Readiness Intelligence Portal</p>
      </td>
      <td style="text-align:right;">
        <div style="font-size:18px;font-weight:700;">Portfolio Comparison Report</div>
        <div style="font-size:12px;color:#6b7280;">Generated: ${now}</div>
      </td>
    </tr>
  </table>

  <!-- Summary Stats -->
  <h2 style="font-size:15px;color:#374151;margin-bottom:12px;">Portfolio Overview</h2>
  <table style="width:100%;margin-bottom:28px;">
    <tr>
      ${[
        { label: 'Total SMEs', value: allSmes.length, bg: '#eff6ff', color: '#1d4ed8' },
        { label: 'Avg Score', value: avgScore, bg: '#f0fdfa', color: '#0d9488' },
        { label: 'Low Risk', value: lowRisk, bg: '#f0fdf4', color: '#16a34a' },
        { label: 'Medium Risk', value: medRisk, bg: '#fffbeb', color: '#d97706' },
        { label: 'High Risk', value: highRisk, bg: '#fef2f2', color: '#dc2626' },
      ].map(stat => `<td style="padding-right:12px;">
        <div style="background:${stat.bg};border-radius:8px;padding:12px 16px;">
          <div style="font-size:22px;font-weight:700;color:${stat.color};">${stat.value}</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px;">${stat.label}</div>
        </div>
      </td>`).join('')}
    </tr>
  </table>

  <!-- SME Rank Table -->
  <h2 style="font-size:15px;color:#374151;margin-bottom:10px;">SME Rankings by Readiness Score</h2>
  <table style="width:100%;margin-bottom:28px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
    <thead>
      <tr style="background:#f9fafb;">
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280;text-transform:uppercase;">SME</th>
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280;text-transform:uppercase;">Sector</th>
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280;text-transform:uppercase;">Score</th>
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280;text-transform:uppercase;">Risk</th>
        <th style="padding:8px 12px;text-align:left;font-size:11px;color:#6b7280;text-transform:uppercase;">Last Assessment</th>
      </tr>
    </thead>
    <tbody>${tableRows || '<tr><td colspan="5" style="padding:16px;color:#6b7280;text-align:center;">No SME data found.</td></tr>'}</tbody>
  </table>

  <!-- Pillar Averages -->
  ${pillarRows ? `
  <h2 style="font-size:15px;color:#374151;margin-bottom:10px;">Portfolio Pillar Averages</h2>
  <table style="width:60%;">
    <colgroup><col style="width:35%"><col style="width:55%"><col style="width:10%"></colgroup>
    ${pillarRows}
  </table>` : ''}

  <p style="font-size:11px;color:#9ca3af;text-align:center;margin-top:40px;">Confidential — IRIP Platform &copy; ${new Date().getFullYear()}</p>
  <script>window.onload = () => window.print();<\/script>
</body>
</html>`

  setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
  return html
})
