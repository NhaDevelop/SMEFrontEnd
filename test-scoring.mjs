import { templateQuestions } from './utils/mock-data/template-questions.js';

const livePillars = [
  { id: 'team', name: 'Team & Leadership', weight: 15 },
  { id: 'business_model', name: 'Business Model', weight: 15 },
  { id: 'market', name: 'Market & Traction', weight: 15 },
  { id: 'financials', name: 'Financial Readiness', weight: 20 },
  { id: 'operations', name: 'Operations', weight: 10 },
  { id: 'legal', name: 'Legal & Governance', weight: 10 },
  { id: 'data', name: 'Data & Digital Maturity', weight: 5 },
  { id: 'growth', name: 'Growth & Scalability', weight: 10 }
];

const pillarScores = {};
livePillars.forEach(p => {
    pillarScores[p.id] = { total: 0, max: 0 };
});

const questions = templateQuestions;

let testResponses = [];
questions.forEach(q => {
    testResponses.push({
        question_id: q.id,
        score_awarded: 10
    });
});

testResponses.forEach(response => {
    const question = questions.find(q => q.id === response.question_id);
    if (!question) return;

    let derivedPillarId = '';
    
    if (typeof question.pillar_id === 'string' || typeof question.pillarId === 'string') {
      const pillarIdStr = (question.pillar_id || question.pillarId || '').toLowerCase()
      const pillarMap = {
        'team': 'team', 'business': 'business_model', 'market': 'market', 'finance': 'financials',
        'ops': 'operations', 'legal': 'legal', 'data': 'data', 'growth': 'growth'
      }
      derivedPillarId = pillarMap[pillarIdStr] || pillarIdStr
    } else {
      derivedPillarId = question.pillar_id || question.pillarId || 'team'
    }

    const matchingPillar = livePillars.find((p) => String(p.id).toLowerCase() === String(derivedPillarId).toLowerCase())
    const targetId = matchingPillar ? matchingPillar.id : derivedPillarId

    if (!pillarScores[targetId]) {
      pillarScores[targetId] = { total: 0, max: 0 }
    }
    
    const pillarScore = pillarScores[targetId]
    const weight = question.weight || 10
    pillarScore.total += response.score_awarded * weight
    pillarScore.max += 10 * weight
});

const result = Object.entries(pillarScores).map(([pillarId, scores]) => {
    const calculatedScore = scores.max > 0 ? Math.round((scores.total / scores.max) * 100) : 0
    return { pillar_id: pillarId, score: calculatedScore }
});

console.log(result);
