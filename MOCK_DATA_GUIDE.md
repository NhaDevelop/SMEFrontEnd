# Mock Data System - Usage Guide

This document explains how to use the mock data system and how to migrate to real API calls.

## 📁 Structure

```
utils/mock-data/
├── index.ts                  # Central export & helper functions
├── users.ts                  # Users, SME profiles, Investor profiles
├── assessments.ts            # Pillars, Questions, Assessments, Responses
├── programs-goals.ts         # Goals, Programs, Enrollments, Documents
└── admin-notifications.ts    # Audit logs, Notifications
```

## 🎯 Quick Start

### 1. Using in Components (Recommended)

Use the composables for automatic loading states and easy API migration:

```vue
<script setup>
import { useSMEDashboard } from "~/composables/useMockData";

// Get current SME ID from auth store
const authStore = useAuthStore();
const smeId = authStore.user?.company?.id || 1;

// Use the composable
const { data, loading, error, refresh } = useSMEDashboard(smeId);
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <h1>{{ data.profile.company_name }}</h1>
    <p>Score: {{ data.latestAssessment?.total_score }}</p>

    <!-- Pillar Scores -->
    <div v-for="pillar in data.pillarScores" :key="pillar.pillar_id">
      {{ pillar.pillar_name }}: {{ pillar.score }}
    </div>

    <!-- Goals -->
    <div v-for="goal in data.goals" :key="goal.id">
      {{ goal.title }} - {{ goal.progress_percentage }}%
    </div>
  </div>
</template>
```

### 2. Direct Data Access

For simple cases where you don't need loading states:

```typescript
import { getSMEData, mockPillars } from "~/utils/mock-data";

// Get complete SME data
const smeData = getSMEData(1); // Angkor Tech
console.log(smeData.profile.company_name);
console.log(smeData.latestAssessment.total_score);

// Get all pillars
console.log(mockPillars);
```

## 📊 Available Data

### SME Data (3 companies)

1. **Angkor Tech** (id: 1) - Technology, Score: 72.5
2. **GreenData Farm Solutions** (id: 2) - AgriTech, Score: 78.0
3. **FinTech Solutions** (id: 3) - FinTech, No completed assessment

### Investors (2)

1. **Mekong Capital** (id: 1) - Watching Angkor Tech & GreenData
2. **Sequoia SEA** (id: 2) - Watching Angkor Tech

### Programs (3)

1. **AgriTech 2024 Batch** - GreenData enrolled
2. **FinTech Innovation Fund** - FinTech Solutions enrolled
3. **Tech Growth Accelerator** - Angkor Tech enrolled

## 🔄 Helper Functions

### `getSMEData(smeId)`

Returns complete SME data including:

- User & Profile
- Latest Assessment & Pillar Scores
- Assessment History
- Goals
- Programs
- Documents
- Investor Interests

### `getInvestorData(investorId)`

Returns:

- User & Profile
- Watchlist with full SME data

### `filterSMEs(filters)`

Filter SMEs by:

- `industry`: string
- `minScore`: number
- `maxScore`: number
- `stage`: string

### `getProgramData(programId)`

Returns:

- Program details
- Creator info
- Enrolled SMEs with stats

### `getUserNotifications(userId, unreadOnly?)`

Get user notifications

### `getAdminLogs(adminUserId?, limit?)`

Get admin activity logs

## 🚀 Migration to Real API

### Step 1: Keep Using Composables

The composables are already structured for API calls. You just need to uncomment the API code:

```typescript
// In composables/useMockData.ts
const refresh = async () => {
  loading.value = true;
  try {
    // Uncomment this:
    const response = await $fetch(`/api/sme/${smeId}/dashboard`);
    data.value = response;

    // Remove this:
    // data.value = getSMEData(smeId)
  } finally {
    loading.value = false;
  }
};
```

### Step 2: Create API Endpoints

Create server endpoints that return the same data structure:

```typescript
// server/api/sme/[id]/dashboard.get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  // Fetch from database
  const smeData = await db.sme.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: true,
      assessments: {
        orderBy: { completed_at: "desc" },
        take: 1,
      },
      goals: true,
      programs: true,
      documents: true,
    },
  });

  // Transform to match mock data structure
  return {
    user: smeData.user,
    profile: smeData,
    latestAssessment: smeData.assessments[0],
    // ... etc
  };
});
```

### Step 3: No Component Changes Needed!

Because the data structure is the same, your components continue to work without any changes.

## 📝 Data Relationships

```
Users (3 roles: ADMIN, SME, INVESTOR)
  ├─> SME_Profiles
  │     ├─> Assessments
  │     │     └─> Assessment_Responses
  │     ├─> Goals
  │     ├─> Program_Enrollments
  │     └─> Documents
  │
  └─> Investor_Profiles
        └─> Investor_Interests (Watchlist)

Programs
  ├─> Program_Enrollments
  └─> created_by (Admin User)

Admin_Audit_Logs
  └─> admin_user_id (Admin User)
```

## 🎨 Example: SME Dashboard

```vue
<script setup>
const { data: smeData, loading } = useSMEDashboard(1);
</script>

<template>
  <div v-if="!loading && smeData">
    <!-- Company Info -->
    <h1>{{ smeData.profile.company_name }}</h1>
    <p>{{ smeData.profile.industry }} | {{ smeData.profile.stage }}</p>

    <!-- Readiness Score -->
    <div class="score">
      {{ smeData.latestAssessment?.total_score || "No assessment" }}
    </div>

    <!-- Pillar Breakdown -->
    <div v-for="pillar in smeData.pillarScores" :key="pillar.pillar_id">
      <span>{{ pillar.pillar_name }}</span>
      <progress :value="pillar.score" max="100"></progress>
    </div>

    <!-- Active Goals -->
    <div
      v-for="goal in smeData.goals.filter((g) => g.status === 'ACTIVE')"
      :key="goal.id"
    >
      <h3>{{ goal.title }}</h3>
      <progress :value="goal.progress_percentage" max="100"></progress>
    </div>

    <!-- Documents -->
    <div v-for="doc in smeData.documents" :key="doc.id">
      {{ doc.type }} - {{ doc.is_verified ? "✓ Verified" : "Pending" }}
    </div>
  </div>
</template>
```

## 🔍 Testing Different Scenarios

```typescript
// Test with different SMEs
const angkorTech = getSMEData(1); // High score, completed goals
const greenData = getSMEData(2); // Improved score over time
const fintech = getSMEData(3); // Incomplete assessment

// Test investor view
const investor = getInvestorData(1); // Has 2 SMEs in watchlist

// Test filtering
const agriTechSMEs = filterSMEs({ industry: "AgriTech" });
const highScorers = filterSMEs({ minScore: 70 });
```

## ✅ Benefits

1. **Realistic Data**: Based on actual database schema
2. **Easy Testing**: No backend needed for frontend development
3. **Type Safety**: Full TypeScript support
4. **API Ready**: Structured for seamless migration
5. **Relationships**: All data properly linked (users, assessments, goals, etc.)
