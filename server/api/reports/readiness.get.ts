import { defineEventHandler, getQuery, setHeader } from 'h3'
import { storage } from '~/server/utils/storage'
import { db } from '~/server/utils/db'

/**
 * GET /api/reports/readiness
 * Returns a detailed Investment Readiness Report formatted as an HTML document
 * that is set with PDF mime-type to trigger browser printing/saving.
 */
export default defineEventHandler((event) => {
  const query = getQuery(event)
  const smeId = query.smeId

  const data = storage.get()
  const assessments = data.assessments || []
  const responses = data.responses || []
  const allSmes = db.smes.findAll()
  const settings = db.settings.get() as any
  const pillars = settings?.pillars || []

  // Sort assessments so the newest is first
  const smeAssessments = assessments
    .filter((a: any) => a.status === 'COMPLETED')
    .sort((a: any, b: any) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())

  // Create a fast lookup map for SME names
  const smeNames: Record<string, string> = {}
  allSmes.forEach((sme: any) => {
     smeNames[String(sme.id)] = sme.name || sme.company_name || 'Unknown SME'
  })

  db.reportLogs.create({
    type: 'PDF',
    name: 'Investment Readiness Report',
    company: smeId ? (smeNames[String(smeId)] || 'Unknown') : 'All SMEs',
  })

  // Filter to target SME(s)
  const targetSmes = smeId
    ? allSmes.filter((s: any) => String(s.id) === String(smeId))
    : allSmes

  const rows = targetSmes.map((sme: any) => {
    const smeAssessments = assessments
      .filter((a: any) => String(a.sme_id) === String(sme.id) && a.status === 'COMPLETED')
      .sort((a: any, b: any) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())

    const latest = smeAssessments[0]
    const score = latest?.total_score ?? sme.score ?? 0
    const risk = score >= 70 ? 'Low' : score >= 40 ? 'Medium' : 'High'
    const riskColor = risk === 'Low' ? '#16a34a' : risk === 'Medium' ? '#d97706' : '#dc2626'

    // Build pillar breakdown from SME profile
    // sme.pillars is an ARRAY of { id, name, score, potential } objects
    const pillarRows = pillars.map((p: any) => {
      // Find the matching pillar in the SME's pillars array by name (case-insensitive)
      const pillarEntry = Array.isArray(sme.pillars)
        ? sme.pillars.find((sp: any) =>
            sp.name?.toLowerCase().trim() === p.name?.toLowerCase().trim() ||
            String(sp.id) === String(p.id)
          )
        : null
      const pillarScore = pillarEntry ? Math.round(pillarEntry.score || 0) : 0
      const bar = Math.min(100, pillarScore)
      return `
        <tr>
          <td style="padding:6px 8px;font-size:13px;">${p.name}</td>
          <td style="padding:6px 8px;">
            <div style="background:#e5e7eb;border-radius:4px;height:10px;width:100%;">
              <div style="background:#0d9488;border-radius:4px;height:10px;width:${bar}%;"></div>
            </div>
          </td>
          <td style="padding:6px 8px;font-size:13px;font-weight:600;text-align:right;">${bar}%</td>
        </tr>`
    }).join('')

    return `
      <div class="sme-block" style="margin-bottom:40px;page-break-inside:avoid;">
        <table style="width:100%;border-collapse:collapse;margin-bottom:4px;">
          <tr>
            <td><h2 style="margin:0;font-size:18px;color:#111827;">${sme.name}</h2>
              <p style="margin:2px 0 0;font-size:13px;color:#6b7280;">${sme.industry || 'General'} &bull; ${sme.email || ''}</p>
            </td>
            <td style="text-align:right;">
              <div style="display:inline-block;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:10px 20px;text-align:center;">
                <div style="font-size:28px;font-weight:700;color:#16a34a;">${score}</div>
                <div style="font-size:11px;color:#6b7280;margin-top:2px;">Readiness Score</div>
              </div>
              <div style="display:inline-block;background:#fef9f0;border:1px solid #fde68a;border-radius:8px;padding:10px 20px;text-align:center;margin-left:10px;">
                <div style="font-size:14px;font-weight:700;color:${riskColor};">${risk} Risk</div>
                <div style="font-size:11px;color:#6b7280;margin-top:2px;">Risk Level</div>
              </div>
            </td>
          </tr>
        </table>

        <h3 style="font-size:14px;color:#374151;margin:16px 0 6px;">Pillar Performance Breakdown</h3>
        <table style="width:100%;border-collapse:collapse;">
          <colgroup><col style="width:30%"><col style="width:60%"><col style="width:10%"></colgroup>
          ${pillarRows || '<tr><td colspan="3" style="color:#6b7280;font-size:13px;padding:8px;">No pillar data available yet.</td></tr>'}
        </table>

        <h3 style="font-size:14px;color:#374151;margin:16px 0 6px;">Recommendations</h3>
        <ul style="margin:0;padding-left:20px;font-size:13px;color:#374151;line-height:1.7;">
          ${score < 70 ? '<li>Strengthen the Financial Literacy pillar by completing financial projection workshops.</li>' : '<li>Maintain current financial governance standards.</li>'}
          ${score < 50 ? '<li>Prioritize Legal & Compliance documentation before approaching investors.</li>' : ''}
          ${score < 60 ? '<li>Develop a digital presence and basic Market Expansion strategy.</li>' : ''}
          <li>Schedule a follow-up assessment in 90 days to track improvement progress.</li>
        </ul>

        <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;">
      </div>`
  }).join('')

  const now = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Investment Readiness Report — IRIP</title>
  <style>
    body { font-family: -apple-system, sans-serif; color: #111827; margin: 0; padding: 32px 48px; background: #fff; }
    @media print { body { padding: 16px; } }
  </style>
</head>
<body>
  <table style="width:100%;border-bottom:3px solid #0d9488;padding-bottom:16px;margin-bottom:28px;">
    <tr>
      <td><h1 style="margin:0;font-size:22px;color:#0d9488;">IRIP</h1>
        <p style="margin:2px 0 0;font-size:12px;color:#6b7280;">Investment Readiness Intelligence Portal</p>
      </td>
      <td style="text-align:right;">
        <div style="font-size:18px;font-weight:700;color:#111827;">Investment Readiness Report</div>
        <div style="font-size:12px;color:#6b7280;">Generated: ${now}</div>
      </td>
    </tr>
  </table>

  ${rows || '<p style="color:#6b7280;">No SME data found.</p>'}

  <p style="font-size:11px;color:#9ca3af;text-align:center;margin-top:40px;">Confidential — IRIP Platform &copy; ${new Date().getFullYear()}</p>
  <script>window.onload = () => window.print();<\/script>
</body>
</html>`

  setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
  return html
})
