import { defineEventHandler } from 'h3'
import { getInvestorData, filterSMEs, mockSMEProfiles } from '~/utils/mock-data'

export default defineEventHandler(async (event) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))

  // TODO: Get actual user from session/auth
  // For now, default to Investor ID 1 (Mekong Capital)
  const investorId = 1
  
  const investorData = getInvestorData(investorId)
  
  if (!investorData) {
    throw createError({
      statusCode: 404,
      message: 'Investor not found'
    })
  }

  // Get all SMEs for discovery
  const allSMEs = filterSMEs({})

  // Calculate portfolio stats
  const watchlistSMEs = investorData.watchlist
  const avgScore = watchlistSMEs.length > 0
    ? watchlistSMEs.reduce((sum, sme) => sum + (sme.latestAssessment?.total_score || 0), 0) / watchlistSMEs.length
    : 0

  const highPerformers = watchlistSMEs.filter(sme => 
    (sme.latestAssessment?.total_score || 0) >= 70
  ).length

  return {
    investor: investorData.profile,
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
