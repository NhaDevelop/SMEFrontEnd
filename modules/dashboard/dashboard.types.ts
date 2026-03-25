export interface DashboardData {
    stats: {
        totalSmes: number
        activePrograms: number
        avgReadinessScore: number
        pendingVerifications: number
    }
    recentActivity: any[]
    growthTrends: any[]
}
