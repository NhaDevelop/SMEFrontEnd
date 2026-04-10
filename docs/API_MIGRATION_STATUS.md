# Laravel vs. Nuxt API Integration Status

This document shows you exactly which parts of your system are already talking to the **Real Laravel Backend** and which parts are still using the **Internal Nuxt API**.

---

## 🟢 Real Laravel Backend APIs (Live on :8000)
These endpoints are currently being called through the `useApi()` composable pointing to your Laravel server at `http://127.0.0.1:8000/api`.

### Authentication
*   [x] **Login** (`POST /api/auth/login`)
*   [x] **Logout** (`POST /api/auth/logout`)
*   [x] **Fetch Current User** (`GET /api/auth/profile`)

### Admin Management
*   [x] **User Directory** (`GET /api/admin/users`)
*   [x] **Pending Approvals** (`GET /api/admin/users/pending`)
*   [x] **Approve/Reject Status** (`PATCH /api/admin/users/{id}/status`)
*   [x] **Role Management** (`PATCH /api/admin/users/{id}/role`)
*   [x] **Password Reset** (`POST /api/admin/users/{id}/reset-password`)
*   [x] **Program Management** (`GET/POST /api/admin/programs`)
*   [x] **Candidate Enrollment** (`POST /api/admin/programs/enroll`)
*   [x] **SME Directory** (`GET /api/admin/smes`)
*   [x] **Assessment Templates** (`GET/POST /api/admin/templates`)
*   [x] **Question Bank** (`GET/POST/DELETE /api/admin/questions`)
*   [x] **Admin Dashboard Stats** (`GET /api/admin/dashboard`)
*   [x] **Audit Logs** (`GET /api/admin/audit-logs`)
*   [x] **Industry Sectors** (`GET/POST/PUT/DELETE /api/admin/sectors`)

---

## 🟡 Nuxt Internal APIs (Mock / To Be Migrated)
These endpoints are currently being called using `$fetch('/api/...')` which hits your Nuxt server files in `server/api/`. These **still need to be implemented in Laravel**.

### Assessment Engine
*   [ ] **Assessment Questions** (`GET /api/assessment/questions`)
*   [ ] **Submit Assessment** (`POST /api/assessment/submit`)
*   [ ] **Assessment History** (`GET /api/assessment/history`)

### Investor Dealflow
*   [ ] **Dealflow Marketplace** (`GET /api/investor/dealflow`)
*   [ ] **Investor Dashboard** (`GET /api/investor/dashboard`)
*   [ ] **Investor Analytics** (`GET /api/investor/analytics`)

### SME & Goal Operations
*   [ ] **SME Public Profile** (`GET /api/sme/{id}`)
*   [ ] **Goal Management** (`GET/POST/PATCH/DELETE /api/sme/goals`)
*   [ ] **Program Applications** (`POST /api/sme/programs/apply`)
*   [ ] **SME Dashboard** (`GET /api/dashboard`)

### Communications & Documents
*   [ ] **Direct Messaging** (`GET/POST /api/messages`)
*   [ ] **In-App Notifications** (`GET /api/notifications`)
*   [ ] **Document Center** (`GET/POST/DELETE /api/documents`)
*   [ ] **Program Comments** (`GET/POST /api/programs/{id}/comments`)

### Reports
*   [ ] **Report Logs** (`GET /api/reports/logs`)
*   [ ] **CSV/PDF Exports** (`GET /api/reports/export`)
*   [ ] **Readiness Visuals** (`GET /api/reports/readiness`)

---

## 🚀 Priority Checklist for Next Migration
To finish the Laravel backend, I recommend migrating these in this order:
1.  **SME Database Logic**: Move the `goals` and `assessments` tables to Laravel.
2.  **Marketplace Logic**: Move the `investor/dealflow` query to Laravel.
3.  **Communication Logic**: Move `messages` and `notifications` to Laravel.
4.  **Reporting**: Move the CSV/PDF generation logic to Laravel.
