import { defineEventHandler } from 'h3'
import { db } from '~/server/utils/db'

export default defineEventHandler((event) => {
  const smes = db.smes.findAll()
  
  // Aggregate data for Analytics Dashboard
  const activeDealFlow = smes.length
  
  const avgReadinessScore = activeDealFlow > 0 
    ? Math.round(smes.reduce((sum, s) => sum + s.score, 0) / activeDealFlow) 
    : 0
    
  let readyCount = 0
  let nearCount = 0
  let earlyCount = 0
  let preCount = 0
  
  smes.forEach(sme => {
    if (sme.score >= 80) readyCount++
    else if (sme.score >= 60) nearCount++
    else if (sme.score >= 40) earlyCount++
    else preCount++
  })
  
  return {
      activeDealFlow,
      avgReadinessScore,
      dealFlowStatus: {
          investorReady: readyCount,
          nearReady: nearCount,
          earlyStage: earlyCount,
          preInvestment: preCount
      },
      smes // Send raw SMEs back so the frontend can build charts dynamically using the date filtered ranges 
  }
})
