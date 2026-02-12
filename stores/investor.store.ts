import { defineStore } from 'pinia'

interface SME {
  id: string | number
  name: string
  industry: string
  location: string
  stage: string
  score: number
  keyStrength: string
  fundingNeeded: number
  description: string
  logo?: string
  financials: {
    revenue: string
    profit: string
    growth: string
  }
  financialRisk: 'Low' | 'Medium' | 'High'
  growthRate: number // maps to "Growth" column
  status: string
  lastUpdated: string
  lastAssessedDate: string // Added for filtering
  readinessHistory: number[]
  readinessProgress: number
}

export interface Goal {
  id: number
  smeId?: string | number
  smeName: string
  sector: string
  location: string
  title: string
  description: string
  status: string
  isOffTrack: boolean
  progress: number
  progressColor: string
  barColor: string
  targetScore: number
  currentScore: number
  expectedScore: number
  overdue: boolean
  overdueDays?: string
  daysLeft?: string
  dueDate: string
}

interface FilterState {
  search: string
  industry: string
  stage: string
  minScore: number
  risk: string
}

interface InvestorState {
  dealFlow: SME[]
  goals: Goal[]
  watchlist: (string | number)[]
  filters: FilterState
  loading: boolean
}

export const useInvestorStore = defineStore('investor', {
  state: (): InvestorState => ({
    dealFlow: [
      {
        id: 101,
        name: 'Angkor Tech',
        industry: 'Technology',
        location: 'Phnom Penh',
        stage: 'Seed',
        score: 84,
        keyStrength: 'High Growth Potential',
        fundingNeeded: 50000,
        description: 'AI-powered agricultural monitoring specifically designed for Cambodian climate conditions.',
        financials: { revenue: '$120k', profit: '-$20k', growth: '+150%' },
        financialRisk: 'Low',
        growthRate: 150,
        status: 'Active',
        lastUpdated: '2 days ago',
        lastAssessedDate: '2024-01-28',
        readinessHistory: [70, 72, 75, 78, 81, 84],
        readinessProgress: 14
      },
      {
        id: 102,
        name: 'Mekong Solutions',
        industry: 'Healthcare',
        location: 'Siem Reap',
        stage: 'Series A',
        score: 72,
        keyStrength: 'Strong Market Fit',
        fundingNeeded: 250000,
        description: 'Telemedicine platform connecting rural communities with specialist doctors in major cities.',
        financials: { revenue: '$450k', profit: '$50k', growth: '+40%' },
        financialRisk: 'Medium',
        growthRate: 40,
        status: 'Pending',
        lastUpdated: '1 week ago',
        lastAssessedDate: '2023-12-15',
        readinessHistory: [60, 62, 65, 68, 70, 72],
        readinessProgress: 12
      },
      {
        id: 106,
        name: 'Green Leaf Farms',
        industry: 'Agriculture',
        location: 'Kampot',
        stage: 'Pre-Seed',
        score: 78,
        keyStrength: 'Sustainable Model',
        fundingNeeded: 30000,
        description: 'Organic localized farming cooperative focusing on export-grade pepper and fruits.',
        financials: { revenue: '$80k', profit: '$12k', growth: '+25%' },
        financialRisk: 'Low',
        growthRate: 25,
        status: 'Active',
        lastUpdated: '3 days ago',
        lastAssessedDate: '2024-01-30',
        readinessHistory: [68, 70, 72, 74, 76, 78],
        readinessProgress: 10
      },
      {
        id: 110,
        name: 'Kampong Thom Cashew',
        industry: 'Agriculture',
        location: 'Kampong Thom',
        stage: 'Expansion',
        score: 91,
        keyStrength: 'Financial Readiness',
        fundingNeeded: 500000,
        description: 'Processing plant tailored to add value to raw cashew nuts before export.',
        financials: { revenue: '$1.2M', profit: '$300k', growth: '+18%' },
        financialRisk: 'Low',
        growthRate: 18,
        status: 'Active',
        lastUpdated: 'Just now',
        lastAssessedDate: '2024-02-01',
        readinessHistory: [85, 86, 88, 89, 90, 91],
        readinessProgress: 6
      },
      {
        id: 117,
        name: 'Mondulkiri Coffee',
        industry: 'Agriculture',
        location: 'Mondulkiri',
        stage: 'Seed',
        score: 82,
        keyStrength: 'Premium Product',
        fundingNeeded: 75000,
        description: 'High-altitude coffee plantation with established direct-to-consumer online sales.',
        financials: { revenue: '$200k', profit: '$40k', growth: '+60%' },
        financialRisk: 'Low',
        growthRate: 60,
        status: 'Active',
        lastUpdated: 'Yesterday',
        lastAssessedDate: '2024-01-20',
        readinessHistory: [75, 76, 78, 79, 81, 82],
        readinessProgress: 7
      },
      {
        id: 119,
        name: 'Takeo Silk',
        industry: 'Textile',
        location: 'Takeo',
        stage: 'Early Stage',
        score: 66,
        keyStrength: 'Cultural Heritage',
        fundingNeeded: 20000,
        description: 'Traditional silk weaving combined with modern fashion design for international markets.',
        financials: { revenue: '$40k', profit: '$5k', growth: '+10%' },
        financialRisk: 'High',
        growthRate: 10,
        status: 'Pending',
        lastUpdated: '2 weeks ago',
        lastAssessedDate: '2023-10-10',
        readinessHistory: [66, 66, 65, 65, 66, 66],
        readinessProgress: 0
      },
      {
        id: 120,
        name: 'EcoBuild Construction',
        industry: 'Construction',
        location: 'Battambang',
        stage: 'Expansion',
        score: 55,
        keyStrength: 'Market Demand',
        fundingNeeded: 150000,
        description: 'Sustainable construction materials made from recycled agricultural waste.',
        financials: { revenue: '$80k', profit: '$10k', growth: '+12%' },
        financialRisk: 'Medium',
        growthRate: 12,
        status: 'Active',
        lastUpdated: '3 days ago',
        lastAssessedDate: '2024-01-25',
        readinessHistory: [45, 48, 50, 52, 53, 55],
        readinessProgress: 10
      },
      {
        id: 121,
        name: 'Khmer Spices Export',
        industry: 'Agriculture',
        location: 'Kampot',
        stage: 'Series A',
        score: 88,
        keyStrength: 'Export Quality',
        fundingNeeded: 300000,
        description: 'Premium organic spice exporter targeting European markets.',
        financials: { revenue: '$500k', profit: '$120k', growth: '+35%' },
        financialRisk: 'Low',
        growthRate: 35,
        status: 'Active',
        lastUpdated: '5 hours ago',
        lastAssessedDate: '2024-02-01',
        readinessHistory: [80, 82, 84, 85, 87, 88],
        readinessProgress: 8
      },
      {
        id: 122,
        name: 'Digital Schools Cambodia',
        industry: 'Technology',
        location: 'Phnom Penh',
        stage: 'Seed',
        score: 42,
        keyStrength: 'Social Impact',
        fundingNeeded: 60000,
        description: 'LMS platform for rural high schools with offline capabilities.',
        financials: { revenue: '$15k', profit: '-$5k', growth: '+20%' },
        financialRisk: 'High',
        growthRate: 20,
        status: 'Pending',
        lastUpdated: '1 day ago',
        lastAssessedDate: '2023-11-20',
        readinessHistory: [30, 32, 35, 38, 40, 42],
        readinessProgress: 12
      },
      {
        id: 123,
        name: 'River Fish Farms',
        industry: 'Agriculture',
        location: 'Kandal',
        stage: 'Early Stage',
        score: 62,
        keyStrength: 'Scalability',
        fundingNeeded: 45000,
        description: 'Aquaculture venture focusing on sustainable fish farming.',
        financials: { revenue: '$30k', profit: '$2k', growth: '+15%' },
        financialRisk: 'Medium',
        growthRate: 15,
        status: 'Active',
        lastUpdated: '1 week ago',
        lastAssessedDate: '2024-01-15',
        readinessHistory: [55, 56, 58, 59, 61, 62],
        readinessProgress: 7
      }
    ],
    goals: [
      {
        id: 1,
        smeName: 'Angkor Tech',
        sector: 'Technology',
        location: 'Phnom Penh',
        title: 'Investor Ready by Q4',
        description: 'Achieve investor-ready status with 80+ overall score',
        status: 'Active',
        isOffTrack: true,
        progress: 38,
        progressColor: 'text-orange-500',
        barColor: 'bg-emerald-600',
        targetScore: 75,
        currentScore: 51,
        expectedScore: 75,
        overdue: true,
        overdueDays: '399d',
        dueDate: 'Dec 30, 2024'
      },
      {
        id: 2,
        smeName: 'Mekong Solutions',
        sector: 'Healthcare',
        location: 'Siem Reap',
        title: 'Financial Excellence',
        description: 'Focus on financial metrics improvement',
        status: 'Active',
        isOffTrack: true,
        progress: 36,
        progressColor: 'text-orange-500',
        barColor: 'bg-emerald-600',
        targetScore: 80,
        currentScore: 48,
        expectedScore: 78,
        overdue: true,
        overdueDays: '429d',
        dueDate: 'Jan 15, 2025'
      },
      {
        id: 3,
        smeName: 'Khmer Innovations',
        sector: 'FinTech',
        location: 'Phnom Penh',
        title: 'Improvement Target for Khmer Innovations',
        description: 'Improve overall readiness score for Khmer Innovations',
        status: 'Active',
        isOffTrack: true,
        progress: 37,
        progressColor: 'text-orange-500',
        barColor: 'bg-emerald-600',
        targetScore: 85,
        currentScore: 55,
        expectedScore: 70,
        overdue: true,
        overdueDays: '460d',
        dueDate: 'Feb 28, 2025'
      },
      {
        id: 4,
        smeName: 'Tonle Corp',
        sector: 'E-commerce',
        location: 'Sihanoukville',
        title: 'Improvement Target for Tonle Corp',
        description: 'Improve overall readiness score for Tonle Corp',
        status: 'Achieved',
        isOffTrack: false,
        progress: 100,
        progressColor: 'text-emerald-600',
        barColor: 'bg-emerald-600',
        targetScore: 80,
        currentScore: 82,
        expectedScore: 80,
        overdue: false,
        dueDate: 'Completed'
      },
      {
        id: 5,
        smeName: 'Bayon Ventures',
        sector: 'AgriTech',
        location: 'Battambang',
        title: 'Improvement Target for Bayon Ventures',
        description: 'Improve overall readiness score for Bayon Ventures',
        status: 'Paused',
        isOffTrack: false,
        progress: 48,
        progressColor: 'text-orange-500',
        barColor: 'bg-emerald-700',
        targetScore: 75,
        currentScore: 60,
        expectedScore: 70,
        overdue: false,
        daysLeft: '-490d left',
        dueDate: 'Apr 15, 2025'
      }
    ],
    watchlist: [110], 
    filters: {
      search: '',
      industry: 'All Sectors',
      stage: 'All Stages',
      minScore: 0,
      risk: 'All Risks'
    },
    loading: false
  }),

  getters: {
    filteredDealFlow: (state) => {
      return state.dealFlow.filter(sme => {
        const matchesSearch = sme.name.toLowerCase().includes(state.filters.search.toLowerCase()) || 
                              sme.description.toLowerCase().includes(state.filters.search.toLowerCase())
        
        const matchesIndustry = state.filters.industry === 'All Sectors' || sme.industry === state.filters.industry
        
        const matchesStage = state.filters.stage === 'All Stages' || sme.stage === state.filters.stage
        
        const matchesScore = sme.score >= state.filters.minScore

        // Risk Filter Logic
        let matchesRisk = true
        if (state.filters.risk && state.filters.risk !== 'All Risks') {
            const targetRisk = state.filters.risk.replace(' Risk', '') // 'Low Risk' -> 'Low'
            matchesRisk = sme.financialRisk === targetRisk
        }

        return matchesSearch && matchesIndustry && matchesStage && matchesScore && matchesRisk
      })
    },
    
    watchlistItems: (state) => {
        return state.dealFlow.filter(sme => state.watchlist.includes(sme.id))
    },

    stats: (state) => {
        return {
            totalDeals: state.dealFlow.length,
            readyToInvest: state.dealFlow.filter(s => s.score >= 80).length,
            highRisk: state.dealFlow.filter(s => s.score < 60).length,
            totalFunding: state.dealFlow.reduce((sum, s) => sum + s.fundingNeeded, 0),
            avgScore: Math.round(state.dealFlow.reduce((sum, s) => sum + s.score, 0) / state.dealFlow.length),
            activeGoals: state.goals.filter(g => g.status === 'Active').length,
            achievedGoals: state.goals.filter(g => g.status === 'Achieved').length
        }
    }
  },

  actions: {
    toggleWatchlist(id: string | number) {
      const index = this.watchlist.indexOf(id)
      if (index === -1) {
        this.watchlist.push(id)
      } else {
        this.watchlist.splice(index, 1)
      }
    },
    
    setFilters(filters: Partial<FilterState>) {
        this.filters = { ...this.filters, ...filters }
    },

    addGoal(goal: Goal) {
      this.goals.unshift(goal)
    },

    updateGoalStatus(id: number, status: string) {
      const goal = this.goals.find(g => g.id === id)
      if (goal) {
        goal.status = status
        if (status === 'Achieved') {
          goal.progress = 100
          goal.progressColor = 'text-green-600'
          goal.barColor = 'bg-green-600'
          goal.isOffTrack = false
          goal.daysLeft = undefined
          goal.dueDate = 'Completed'
        }
      }
    }
  }
})
