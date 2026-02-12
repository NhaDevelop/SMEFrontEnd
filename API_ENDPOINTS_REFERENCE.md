# API Endpoints Reference - Mock Data Integration

Quick reference for all available API endpoints using the comprehensive mock data system.

---

## 🔵 SME Role Endpoints

### Dashboard

```
GET /api/dashboard
Returns: Pillar scores, progress history, recommended actions
Data Source: getSMEData(smeId)
```

### Goals

```
GET /api/sme/goals
Returns: Goals with pillar info, scores, and gaps
Data Source: getSMEData(smeId).goals
```

### Profile

```
GET /api/sme/[id]
Returns: Complete SME profile, assessments, goals, programs, documents
Data Source: getSMEData(id)
```

---

## 🟢 Investor Role Endpoints

### Dashboard

```
GET /api/investor/dashboard
Returns: Investor profile, watchlist, all SMEs, portfolio stats
Data Source: getInvestorData(investorId)
```

### SME Discovery

```
GET /api/investor/smes?industry=AgriTech&minScore=70&stage=Growth
Returns: Filtered list of SMEs
Data Source: filterSMEs(filters)
Query Params:
  - industry: string (optional)
  - minScore: number (optional)
  - maxScore: number (optional)
  - stage: string (optional)
```

---

## 🔴 Admin Role Endpoints

### Dashboard

```
GET /api/admin/dashboard
Returns: Comprehensive stats, SME list, recent activity, programs
Data Source: Multiple mock data sources aggregated
```

### Programs

```
GET /api/admin/programs
Returns: All programs with enrollment data and statistics
Data Source: getProgramData(programId) for each program
```

### Audit Logs

```
GET /api/admin/audit-logs?adminUserId=1&limit=50
Returns: Admin activity logs
Data Source: getAdminLogs(adminUserId, limit)
Query Params:
  - adminUserId: number (optional)
  - limit: number (default: 50)
```

---

## 🟡 Shared Endpoints

### Assessment Questions

```
GET /api/assessment/questions
Returns: All pillars and questions grouped by pillar
Data Source: mockPillars, mockQuestions
```

### Documents

```
GET /api/documents?smeId=1
Returns: SME documents grouped by type with stats
Data Source: getSMEData(smeId).documents
Query Params:
  - smeId: number (required)
```

### Notifications

```
GET /api/notifications?userId=1&unreadOnly=true
Returns: User notifications with unread count
Data Source: getUserNotifications(userId, unreadOnly)
Query Params:
  - userId: number (required)
  - unreadOnly: boolean (optional)
```

---

## 📊 Response Examples

### SME Dashboard Response

```json
{
  "pillars": [
    {
      "id": 1,
      "name": "TEAM",
      "score": 80,
      "riskLevel": "low",
      "improvementPotential": 20
    }
  ],
  "progress": [
    { "month": "Jan", "score": 50 },
    { "month": "Feb", "score": 55 }
  ],
  "actions": [
    {
      "id": 1,
      "title": "Improve team structure",
      "description": "...",
      "priority": "high",
      "pillar": "TEAM",
      "impact": 15,
      "status": "pending"
    }
  ]
}
```

### Investor Dashboard Response

```json
{
  "investor": {
    "id": 1,
    "organization_name": "Mekong Capital",
    "investor_type": "VC"
  },
  "watchlist": [
    {
      "user": { ... },
      "profile": { ... },
      "latestAssessment": { ... },
      "pillarScores": [ ... ],
      "watchlistNotes": "Promising AgriTech startup",
      "watchedSince": "2024-09-01T00:00:00Z"
    }
  ],
  "allSMEs": [ ... ],
  "stats": {
    "totalWatched": 2,
    "avgScore": 75,
    "highPerformers": 1,
    "totalSMEs": 3
  }
}
```

### Admin Dashboard Response

```json
{
  "stats": {
    "totalSMEs": 3,
    "totalInvestors": 2,
    "totalPrograms": 3,
    "activePrograms": 2,
    "completedAssessments": 3,
    "inProgressAssessments": 1,
    "avgScore": 72,
    "totalEnrollments": 3,
    "acceptedEnrollments": 3
  },
  "smes": [ ... ],
  "recentActivity": [ ... ],
  "programs": [ ... ]
}
```

---

## 🔧 Helper Functions Available

Import from `~/utils/mock-data`:

```typescript
// Get complete SME data
getSMEData(smeId: number)

// Get investor data with watchlist
getInvestorData(investorId: number)

// Filter SMEs by criteria
filterSMEs(filters: {
  industry?: string
  minScore?: number
  maxScore?: number
  stage?: string
})

// Get program with enrolled SMEs
getProgramData(programId: number)

// Get user notifications
getUserNotifications(userId: number, unreadOnly?: boolean)

// Get admin audit logs
getAdminLogs(adminUserId?: number, limit?: number)
```

---

## 🎯 Quick Integration Examples

### In a Vue Component (using store)

```vue
<script setup>
import { useDashboardStore } from "~/stores/dashboard.store";

const dashboardStore = useDashboardStore();

onMounted(async () => {
  await dashboardStore.fetchDashboardData();
  // Data automatically populated from /api/dashboard
});

const pillars = computed(() => dashboardStore.pillars);
const score = computed(() => dashboardStore.overallScore);
</script>
```

### Direct API Call

```typescript
// Fetch SME profile
const smeData = await $fetch("/api/sme/1");

// Search SMEs
const smes = await $fetch("/api/investor/smes", {
  query: {
    industry: "AgriTech",
    minScore: 70,
  },
});

// Get notifications
const notifications = await $fetch("/api/notifications", {
  query: { userId: 1, unreadOnly: true },
});
```

---

## 📝 Notes

- All endpoints include simulated network delay (150-300ms) for realistic testing
- TODO comments indicate where real authentication should be added
- All responses follow the database schema from `DATABASE_SCHEMA_DESIGN.md`
- TypeScript types are inferred from the mock data structures
