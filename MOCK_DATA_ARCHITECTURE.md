# Mock Data System Architecture

## 📊 Complete Integration Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Vue.js)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  SME Pages   │  │Investor Pages│  │ Admin Pages  │         │
│  │              │  │              │  │              │         │
│  │ • Dashboard  │  │ • Dashboard  │  │ • Dashboard  │         │
│  │ • Goals      │  │ • Discovery  │  │ • Programs   │         │
│  │ • Profile    │  │ • Watchlist  │  │ • Audit Logs │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                 │                  │
│         └─────────────────┼─────────────────┘                  │
│                           ↓                                    │
│  ┌─────────────────────────────────────────────────────┐      │
│  │              Pinia Stores (State Management)         │      │
│  │  • dashboardStore  • investorStore  • adminStore     │      │
│  └─────────────────────────┬───────────────────────────┘      │
│                            ↓                                   │
│  ┌─────────────────────────────────────────────────────┐      │
│  │                  Service Layer                       │      │
│  │  • DashboardService  • InvestorService  • etc.       │      │
│  └─────────────────────────┬───────────────────────────┘      │
│                            ↓                                   │
│  ┌─────────────────────────────────────────────────────┐      │
│  │                Repository Layer                      │      │
│  │  • DashboardRepository  • etc.                       │      │
│  └─────────────────────────┬───────────────────────────┘      │
│                            ↓                                   │
└────────────────────────────┼───────────────────────────────────┘
                             │
                             │ $fetch()
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    SERVER API (Nuxt Server)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │   SME APIs       │  │  Investor APIs   │  │  Admin APIs  │ │
│  ├──────────────────┤  ├──────────────────┤  ├──────────────┤ │
│  │ /api/dashboard   │  │ /api/investor/   │  │ /api/admin/  │ │
│  │ /api/sme/goals   │  │   dashboard      │  │   dashboard  │ │
│  │ /api/sme/[id]    │  │ /api/investor/   │  │ /api/admin/  │ │
│  │                  │  │   smes           │  │   programs   │ │
│  │                  │  │                  │  │ /api/admin/  │ │
│  │                  │  │                  │  │   audit-logs │ │
│  └────────┬─────────┘  └────────┬─────────┘  └──────┬───────┘ │
│           │                     │                    │         │
│           └─────────────────────┼────────────────────┘         │
│                                 ↓                              │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              Shared APIs                                  │ │
│  │  • /api/assessment/questions                              │ │
│  │  • /api/documents                                         │ │
│  │  • /api/notifications                                     │ │
│  └─────────────────────────┬────────────────────────────────┘ │
│                            ↓                                  │
└────────────────────────────┼──────────────────────────────────┘
                             │
                             │ import
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│              MOCK DATA SYSTEM (utils/mock-data/)                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    index.ts (Exports)                     │  │
│  │  • getSMEData()        • getInvestorData()                │  │
│  │  • filterSMEs()        • getProgramData()                 │  │
│  │  • getUserNotifications()  • getAdminLogs()               │  │
│  └──────────────────────────┬───────────────────────────────┘  │
│                             ↓                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────┐  │
│  │  users.ts   │  │assessments  │  │  programs-goals.ts   │  │
│  ├─────────────┤  │    .ts      │  ├──────────────────────┤  │
│  │ • mockUsers │  ├─────────────┤  │ • mockGoals          │  │
│  │ • mockSME   │  │ • mockPillars│ │ • mockPrograms       │  │
│  │   Profiles  │  │ • mockQuest- │  │ • mockProgram        │  │
│  │ • mockInves-│  │   ions       │  │   Enrollments        │  │
│  │   torProfiles│ │ • mockAssess-│ │ • mockInvestor       │  │
│  │             │  │   ments      │  │   Interests          │  │
│  │             │  │ • mockAssess-│ │ • mockDocuments      │  │
│  │             │  │   mentRespon-│ │                      │  │
│  │             │  │   ses        │  │                      │  │
│  └─────────────┘  └─────────────┘  └──────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           admin-notifications.ts                          │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ • mockAdminAuditLogs                                      │  │
│  │ • mockNotifications                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                             ↑
                             │ Follows
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                  DATABASE_SCHEMA_DESIGN.md                      │
├─────────────────────────────────────────────────────────────────┤
│  • users                    • pillars                           │
│  • sme_profiles             • questions                         │
│  • investor_profiles        • assessments                       │
│  • goals                    • assessment_responses              │
│  • programs                 • documents                         │
│  • program_enrollments      • notifications                     │
│  • investor_interests       • admin_audit_logs                  │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Example: SME Dashboard

```
1. User visits /sme/dashboard
   ↓
2. Page component calls dashboardStore.fetchDashboardData()
   ↓
3. Store calls DashboardService.getDashboardData()
   ↓
4. Service calls DashboardRepository
   ↓
5. Repository calls $fetch('/api/dashboard')
   ↓
6. API endpoint /server/api/dashboard.get.ts receives request
   ↓
7. API imports getSMEData from ~/utils/mock-data
   ↓
8. getSMEData(1) retrieves:
   - User & Profile from users.ts
   - Latest Assessment from assessments.ts
   - Pillar Scores (calculated from assessment responses)
   - Goals from programs-goals.ts
   - Programs from programs-goals.ts
   - Documents from programs-goals.ts
   ↓
9. API transforms data to dashboard format:
   - Pillars with scores and risk levels
   - Progress history from assessment timeline
   - Actions from active goals
   ↓
10. Response sent back to frontend
   ↓
11. Store updates state
   ↓
12. Vue components reactively display data
```

## 🎯 Key Features

### ✅ **Type Safety**

All mock data is TypeScript-typed and matches the database schema

### ✅ **Relationships**

Foreign keys work correctly (e.g., sme_id → assessments)

### ✅ **Realistic Data**

- Multiple SMEs with different scores and stages
- Assessment history showing improvement over time
- Active and completed goals
- Verified and unverified documents

### ✅ **Easy Migration**

When ready for real API:

1. Update API endpoints to query database
2. Keep same response structure
3. No frontend changes needed!

## 📊 Data Coverage

```
Users & Profiles
├─ 3 SMEs
│  ├─ Angkor Tech (Score: 72.5, Completed)
│  ├─ GreenData (Score: 78.0, Improved)
│  └─ FinTech Solutions (In Progress)
├─ 2 Investors
│  ├─ Mekong Capital (Watching 2 SMEs)
│  └─ Sequoia SEA (Watching 1 SME)
└─ 1 Admin

Assessment Framework
├─ 8 Pillars (TEAM, MARKET, FINANCIALS, etc.)
├─ 6 Questions (CHOICE, BOOLEAN, NUMBER types)
├─ 4 Assessment Instances
└─ 18 Assessment Responses

Programs & Goals
├─ 3 Programs (AgriTech, FinTech, Tech Growth)
├─ 3 Enrollments
├─ 6 Goals (linked to pillars)
└─ 3 Documents (Pitch, Financials, Legal)

System Data
├─ 5 Audit Logs
├─ 6 Notifications
└─ 2 Investor Interests
```

## 🚀 Result

**Complete mock data system integrated across all roles and pages!**

- All data follows DATABASE_SCHEMA_DESIGN.md
- All relationships work correctly
- Ready for real API migration
- No frontend changes needed when switching to real backend
