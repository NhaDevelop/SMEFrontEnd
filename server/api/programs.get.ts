import { defineEventHandler } from 'h3'
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  // Public endpoint for regular users to see available programs
  const programs = db.programs.findAll()
  
  // Enrich programs with some defaults if missing, to match the UI requirements
  return (programs as any[]).map(p => ({
    ...p,
    slug: p.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
    sector: p.sector || 'All Sectors',
    duration: p.duration || '12 weeks',
    deadline: p.deadline || p.endDate || 'March 31, 2024',
    investmentAmount: p.investmentAmount || 'Up to $500K',
    benefits: p.benefits || ['1-on-1 mentorship', 'Investor introductions', 'Assessment coaching', 'Pitch preparation'],
    eligibility: p.eligibility || ['Minimum 12 months of operations', 'Revenue-generating or strong traction', 'Full-time founding team'],
    timeline: p.timeline || [
      { title: 'Foundation', week: 'Week 1-4', description: 'Business assessment, gap analysis, and goal setting' },
      { title: 'Development', week: 'Week 5-8', description: 'Intensive workshops, mentorship, and improvement implementation' },
      { title: 'Demo Day', week: 'Week 9-12', description: 'Investor presentations and follow-up meetings' }
    ],
    outcomes: p.outcomes || ['Improved readiness score', 'Investor network access', 'Pitch-ready documentation'],
    status: p.status === 'Active' ? 'Open' : p.status === 'Draft' ? 'Coming Soon' : 'Closed'
  }))
})

