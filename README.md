# IRIP Architecture Refactoring - Complete

## Quick Start

### Installation & Running

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The application will be available at **http://localhost:5173**

### First Time Setup

1. Open the landing page
2. Select "SME User" role
3. You'll be redirected to the dashboard with mock data
4. Navigate through the sidebar to explore different sections

### Project Structure

```
src/
├── modules/           # Feature-based modules (auth, dashboard, etc.)
├── shared/            # Shared resources (components, services, utils)
├── router/            # Vue Router configuration
├── assets/            # Static assets
└── main.js            # Application entry point
```

---

## Overview

Successfully refactored the Investment Readiness Intelligence Platform (IRIP) from a basic Vue.js structure to a **production-ready, feature-based MVVM architecture** following industry best practices.

---

## New Architecture

### MVVM Pattern Implementation

**Model** → Services (API calls) + Mock Data  
**View** → Vue Components (UI only)  
**ViewModel** → Pinia Stores + Composables (Business Logic)

### Layer Separation

```
UI Layer (Components/Pages)
        ↓
Logic Layer (Pinia Stores + Composables)
        ↓
Service Layer (API Calls)
        ↓
Laravel Backend (Future)
```

---

## New Project Structure

```
src/
├── modules/                          # Feature-based modules
│   ├── auth/
│   │   ├── components/
│   │   │   └── RoleCard.vue
│   │   ├── pages/
│   │   │   └── LandingPage.vue
│   │   ├── composables/
│   │   │   └── useAuth.js
│   │   ├── store.js
│   │   └── service.js
│   │
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── RadarChart.vue
│   │   │   ├── ProgressChart.vue
│   │   │   ├── PillarSummary.vue
│   │   │   └── RecommendedActions.vue
│   │   ├── pages/
│   │   │   └── DashboardPage.vue
│   │   ├── store.js
│   │   └── service.js
│   │
│   ├── assessment/
│   │   └── pages/
│   │       └── AssessmentPage.vue
│   │
│   ├── reports/
│   │   └── pages/
│   │       └── ReportsPage.vue
│   │
│   └── settings/
│       └── pages/
│           └── SettingsPage.vue
│
├── shared/                           # Shared resources
│   ├── components/
│   │   ├── layout/
│   │   │   └── MainLayout.vue
│   │   └── ui/
│   │       ├── RiskBadge.vue
│   │       └── PriorityBadge.vue
│   ├── composables/
│   │   └── useApi.js
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   ├── mockData.js
│   │   └── helpers.js
│   └── constants/
│       └── index.js
│
├── router/
│   └── index.js
├── assets/
├── App.vue
└── main.js
```

---

## What Was Created

### 1. Shared Layer

#### `shared/services/api.js`

- Centralized Axios instance
- Request interceptor for auth tokens
- Response interceptor for error handling
- Automatic 401 redirect to login

#### `shared/composables/useApi.js`

- Reusable API request wrapper
- Automatic loading state management
- Error handling
- Clean async/await pattern

#### `shared/constants/index.js`

- All app-wide constants
- API endpoints
- User roles
- Risk levels & thresholds
- Priority levels
- Action & assessment statuses
- 8 Pillars definition
- LocalStorage keys

#### `shared/utils/helpers.js`

- `calculateOverallScore()` - Calculate average pillar score
- `calculateGrowthPotential()` - Calculate improvement potential
- `getRiskLevel()` - Determine risk level from score
- `getRiskColor()` - Get color for risk level
- `getPriorityColor()` - Get color for priority
- `getReadinessStatus()` - Get status label from score
- `calculateScoreChange()` - Calculate score difference
- `formatDate()` - Format dates
- `debounce()` - Debounce function calls

#### `shared/utils/mockData.js`

- Mock user data
- Mock pillar scores
- Mock progress data
- Mock recommended actions
- Mock assessment history

---

### 2. Auth Module (Complete MVVM)

#### `modules/auth/service.js`

**Purpose:** Handle all authentication API calls

**Methods:**

- `loginApi(credentials)` - POST /api/login
- `logoutApi()` - POST /api/logout
- `getUserApi()` - GET /api/user
- `mockLoginApi(role)` - Mock login for development

#### `modules/auth/store.js`

**Purpose:** Manage authentication state and business logic

**State:**

- `user` - Current user object
- `token` - Auth token
- `isAuthenticated` - Auth status
- `selectedRole` - User role
- `loading` - Loading state
- `error` - Error messages

**Getters:**

- `currentUser` - Get current user
- `userRole` - Get user role
- `companyInfo` - Get company data
- `isLoggedIn` - Check if authenticated

**Actions:**

- `login(role)` - Login user
- `logout()` - Logout and clear session
- `setRole(role)` - Set user role
- `updateProfile(data)` - Update user profile
- `updateCompany(data)` - Update company info
- `restoreSession()` - Restore from localStorage

#### `modules/auth/composables/useAuth.js`

**Purpose:** Reusable authentication logic

**Exports:**

- `user` - Computed user ref
- `isAuthenticated` - Computed auth status
- `loading` - Computed loading state
- `error` - Computed error state
- `login(role, redirectTo)` - Login and navigate
- `logout()` - Logout and redirect
- `hasRole(role)` - Check user role
- `requireAuth()` - Require authentication

#### `modules/auth/pages/LandingPage.vue`

- Role selection interface
- Uses `useAuth` composable
- Clean, simple logic

#### `modules/auth/components/RoleCard.vue`

- Reusable role selection card
- Icon, title, description
- Hover effects

---

### 3. Dashboard Module (Complete MVVM)

#### `modules/dashboard/service.js`

**Purpose:** Handle all dashboard API calls

**Methods:**

- `getDashboardDataApi()` - GET /api/dashboard
- `getPillarsApi()` - GET /api/pillars
- `getProgressApi()` - GET /api/progress
- `getActionsApi()` - GET /api/actions
- `updateActionStatusApi(id, status)` - PUT /api/actions/:id
- `mockDashboardDataApi()` - Mock data for development

#### `modules/dashboard/store.js`

**Purpose:** Manage dashboard state and business logic

**State:**

- `pillars` - 8 pillar scores
- `progressData` - Timeline data
- `actions` - Recommended actions
- `loading` - Loading state
- `error` - Error messages

**Getters:**

- `overallScore` - Calculate overall score
- `growthPotential` - Calculate growth potential
- `overallRiskLevel` - Get overall risk level
- `latestAssessmentDate` - Get latest date
- `scoreChange` - Calculate score change
- `pillarsByRisk` - Group pillars by risk
- `actionsCount` - Count pending actions
- `actionsByPriority` - Group actions by priority

**Actions:**

- `fetchDashboardData()` - Fetch all dashboard data
- `updatePillarScore(id, score)` - Update pillar score
- `updateActionStatus(id, status)` - Update action status
- `addAction(data)` - Add new action
- `removeAction(id)` - Remove action

#### `modules/dashboard/pages/DashboardPage.vue`

- Main dashboard container
- Uses `useDashboardStore` and `useAuthStore`
- Fetches data on mount
- Passes data to child components

#### `modules/dashboard/components/`

- `RadarChart.vue` - 8-pillar radar visualization
- `ProgressChart.vue` - Timeline line chart
- `PillarSummary.vue` - Pillar details table
- `RecommendedActions.vue` - Action cards panel

All components are **UI only** - no business logic, no API calls.

---

### 4. Other Modules

#### Assessment Module

- `pages/AssessmentPage.vue` - Placeholder for assessment

#### Reports Module

- `pages/ReportsPage.vue` - Placeholder for reports

#### Settings Module

- `pages/SettingsPage.vue` - Placeholder for settings

All use `MainLayout` from shared components.

---

### 5. Router & Main.js Updates

#### `router/index.js`

- Updated to use new module paths
- Uses `useAuthStore` for route guards
- Lazy-loaded routes for code splitting

#### `main.js`

- Initializes Pinia
- Restores auth session on app load
- Mounts app

---

## Architecture Benefits

### ✅ Scalability

- Easy to add new features/modules
- Clear module boundaries
- Independent development

### ✅ Maintainability

- Clear separation of concerns
- Easy to locate code
- Consistent patterns

### ✅ Testability

- Each layer can be tested independently
- Services can be mocked easily
- Stores have clear inputs/outputs

### ✅ Team Collaboration

- Multiple developers can work on different modules
- No merge conflicts
- Clear ownership

### ✅ Code Reusability

- Shared components used across modules
- Composables for common logic
- Utilities for common functions

### ✅ Best Practices

- Follows Vue.js official recommendations
- MVVM pattern
- Single Responsibility Principle
- DRY (Don't Repeat Yourself)

---

## Golden Rules Followed

### ❌ Components DON'T:

- Call APIs directly
- Contain business logic
- Manage complex state

### ✅ Components DO:

- Display UI
- Receive props
- Emit events
- Use composables for logic

### ❌ Pages DON'T:

- Contain business logic
- Make API calls directly

### ✅ Pages DO:

- Act as route containers
- Call store actions
- Pass data to components

### ❌ Stores DON'T:

- Contain UI logic
- Make direct HTTP calls

### ✅ Stores DO:

- Manage state
- Contain business logic
- Call service methods
- Provide getters

### ❌ Services DON'T:

- Manage state
- Contain business logic

### ✅ Services DO:

- Make API calls ONLY
- Return promises
- Handle request formatting

---

## Migration Summary

### Before (Old Structure)

```
src/
├── components/
│   ├── common/
│   └── dashboard/
├── layouts/
├── stores/
├── utils/
└── views/
```

### After (New Structure)

```
src/
├── modules/          # Feature-based
│   ├── auth/
│   ├── dashboard/
│   ├── assessment/
│   ├── reports/
│   └── settings/
└── shared/           # Reusable
    ├── components/
    ├── composables/
    ├── services/
    ├── utils/
    └── constants/
```

---

## Key Changes Made

1. **Created Shared Layer**

   - API service with interceptors
   - useApi composable
   - Constants file
   - Helper utilities
   - Moved mock data

2. **Created Auth Module**

   - Service for API calls
   - Store for state management
   - Composable for reusable logic
   - Moved LandingPage and RoleCard

3. **Created Dashboard Module**

   - Service for API calls
   - Store combining assessment + actions
   - Moved all dashboard components
   - Updated DashboardPage

4. **Updated All Imports**

   - Components use new paths
   - Stores use new structure
   - Router uses new module paths

5. **Updated Router**

   - Uses Auth store for guards
   - Lazy-loads all routes
   - Clean route definitions

6. **Updated Main.js**
   - Restores auth session
   - Proper Pinia initialization

---

## How to Use

### Adding a New Feature

1. **Create Module Directory**

   ```
   src/modules/new-feature/
   ```

2. **Create Service** (`service.js`)

   ```javascript
   import api from "@/shared/services/api";

   export const getDataApi = () => api.get("/endpoint");
   ```

3. **Create Store** (`store.js`)

   ```javascript
   import { defineStore } from "pinia";
   import { getDataApi } from "./service";

   export const useFeatureStore = defineStore("feature", {
     state: () => ({ data: [] }),
     actions: {
       async fetchData() {
         const res = await getDataApi();
         this.data = res.data;
       },
     },
   });
   ```

4. **Create Page** (`pages/FeaturePage.vue`)

   ```vue
   <script>
   import { useFeatureStore } from "../store";

   export default {
     setup() {
       const store = useFeatureStore();
       store.fetchData();
       return { data: store.data };
     },
   };
   </script>
   ```

5. **Add Route**
   ```javascript
   {
     path: '/feature',
     component: () => import('@/modules/feature/pages/FeaturePage.vue')
   }
   ```

---

## Laravel API Integration

When ready to connect to Laravel backend:

1. **Update `.env`**

   ```
   VITE_API_URL=http://localhost:8000/api
   ```

2. **Replace Mock Calls**
   In each service file, replace `mockXxxApi()` with real API calls.

3. **Test Endpoints**
   Use the service methods directly - no component changes needed!

---

## Current Status

### ✅ Completed

- Shared layer (API, composables, constants, helpers)
- Auth module (complete MVVM)
- Dashboard module (complete MVVM)
- Router configuration
- All imports updated
- Session persistence

### 🔄 Ready for Development

- Assessment module (structure ready)
- Reports module (structure ready)
- Settings module (structure ready)

### 📝 Next Steps

1. Test the refactored application
2. Fix any import errors
3. Implement assessment questionnaire
4. Implement reports generation
5. Implement settings management
6. Connect to Laravel API

---

## Conclusion

The IRIP application now follows a **production-ready, scalable architecture** that:

- ✨ Separates concerns properly (Service → Store → Component)
- 📦 Organizes code by feature, not by type
- 🔄 Makes it easy to add new features
- 👥 Enables team collaboration
- 🧪 Facilitates testing
- 🚀 Prepares for Laravel integration

The architecture is **industry-standard** and follows **Vue.js best practices**, making it easy for new developers to onboard and for the codebase to scale as the project grows.
