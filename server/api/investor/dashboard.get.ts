import { defineEventHandler } from 'h3'
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))

  // TODO: Get actual user from session/auth
  const investorId = 1
  
  // Dummy investor profile to satisfy UI rendering while we lack an investor table
  const investorProfile = {
      id: 1,
      name: 'Mekong Capital',
      contact: 'james@mekongcapital.com',
      avatar: 'J',
      firm: 'Mekong Capital',
      investment_stage: ['pre-seed', 'seed', 'series a'],
      focus_sectors: ['Technology', 'AgriTech', 'FinTech']
  }

  // Get all active SMEs from the real database
  const allSMEs = db.smes.findAll().map(sme => ({
    id: sme.id,
    name: sme.company_name || sme.name,
    industry: sme.industry,
    location: sme.location || 'Unknown',
    stage: sme.stage || 'Seed',
    score: sme.score || 0,
    fundingNeeded: sme.fundingNeeded || 50000,
    description: sme.description || '',
    financialRisk: sme.financialRisk || 'Medium',
    latestAssessment: sme.assessments && sme.assessments.length > 0 
      ? { total_score: sme.assessments[0].score || sme.score }
      : { total_score: sme.score }
  }))

  // Define Watchlist Logic: Just a sample subset for now until we have an actual 'favorites' relationship
  const watchlistSMEs = allSMEs.slice(0, 3)
  
  // Calculate portfolio stats dynamically 
  const avgScore = watchlistSMEs.length > 0
    ? watchlistSMEs.reduce((sum, sme) => sum + (sme.latestAssessment?.total_score || 0), 0) / watchlistSMEs.length
    : 0

  const highPerformers = watchlistSMEs.filter(sme => 
    (sme.latestAssessment?.total_score || 0) >= 70
  ).length

  return {
    investor: investorProfile,
    watchlist: watchlistSMEs,
    allSMEs,
    stats: {
      totalWatched: watchlistSMEs.length,
      avgScore: Math.round(avgScore),
      highPerformers,
      totalSMEs: allSMEs.length
    }
  }
})
