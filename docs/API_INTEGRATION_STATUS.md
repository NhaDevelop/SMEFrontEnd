# API Integration Status Report

This document tracks the integration progress between the Nuxt frontend and the backend (currently running on Mock APIs).

## 🟢 Integrated (Working with Mock REST API)

These features are fully connected to the `server/api/` mock endpoints and are ready to be migrated to Laravel.

- [x] **Authentication** (Login, Logout, Current User)
- [x] **Registration** (SME/Investor Sign-up, Admin Approval Flow)
- [x] **Industry Sectors** (CRUD management, Color dot tagging)
- [x] **Framework Settings** (Question & Template management)
- [x] **Assessment Engine** (Laravel Integrated: 8-pillar scoring, option weights, real-time calculation)
- [x] **SME Dashboard** (Laravel Integrated: Profile overview, Readiness radar, Progress history)
- [x] **Goal Management** (Creating goals, Updating progress, Status changes)
- [x] **Investor Marketplace** (Dealflow list, Filtering by sector/risk)
- [x] **Investor Dashboard** (Analytics overview, Porfolio stats)
- [x] **Programs & Cohorts** (Program listing, Comments/Forum thread)
- [x] **Messaging System** (Direct chat between users)
- [x] **Notification System** (Bell icon alerts, Notification lists)
- [x] **Reporting Suite** (Audit logs, PDF Report generation, CSV Exports)
- [x] **Document Management** (File uploads, Document lists)

## 🟡 Partial / Placeholder (Needs REST API)

These features are still relying on local `utils` data or hardcoded arrays and need a proper REST endpoint created.

- [x] **SME Public Profile** (`/sme/[id]` view for investors/admin now uses Laravel backend)
- [ ] **Advanced Audit Logging** (System-wide events are limited in mock)
- [ ] **Email Notification Workflows** (Mocked logic only, no real mailer integration)
- [ ] **Search Auto-complete** (Some search bars use local filter, should be API-driven)

---

## 🚀 What to Implement Next (The Flow)

According to your system architecture, here is the exact order you should follow to build the **Laravel RESTful API**:

### Step 1: Auth & User Management (The Gate)

You cannot test anything else without users.

1.  **JWT Auth**: Implement the `Auth/Login` and `Auth/Me` endpoints in Laravel.
2.  **User Models**: Setup the `users`, `sme_profiles`, and `investor_profiles` tables.
3.  **Gatekeeping**: Implement the Admin 'is_verified' check so you can approve SMEs.

### Step 2: Framework & Sectors (The Foundation)

You need valid sectors and templates before an SME can take a test.

1.  **Sectors API**: Move the Sector CRUD to Laravel so your registration dropdowns work.
2.  **Pillars & Questions**: Build the tables for Pillars and Templates so you can seed questions.

### Step 3: Assessment Logic (The Heart)

1.  **Submission Endpoint**: This is your most important route. Implement the logic that calculates the total score based on weights and options.
2.  **History**: Let SMEs view their past assessments.

### Step 4: Dealflow & Marketplace (The Value)

1.  **Dealflow Query**: Write the optimized SQL query in Laravel that sorts SMEs by their latest assessment scores for the Investor dashboard.

### Step 5: Communications (The Polish)

1.  **Messages & Notifications**: Implement the simple CRUD for chat and alerts.
2.  **Audit Logs**: Record all admin actions.

**Current Working Directory for Laravel:** You should create your Laravel project in a separate folder (e.g., `SMEBackend`) and start with Phase 1. I am ready to help you write the specific Migration files whenever you start!
