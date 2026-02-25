# Fix: Persistence System for Assessments and Programs

## The Issue

The user reported that assessment scores and dashboard data were resetting (showing 0) after server restarts or hot module reloads (HMR). This was because the application relied entirely on in-memory mock data, which resets every time the dev server recompiles.

## The Solution

I implemented a file-based persistence layer that saves critical data to a local JSON file (`.data/sme_frontend_db.json`). This ensures data survives server restarts.

### 1. New Storage Utility (`server/utils/storage.ts`)

- Created a `storage` service using `node:fs`.
- It saves `assessments`, `responses`, `templates`, and `programs` to `.data/sme_frontend_db.json`.
- It handles reading and merging data safely.

### 2. Updated Server DB (`server/utils/db.ts`)

- Modified the mock DB to load persisted **Templates** and **Programs** on startup.
- Updated `db.templates.create` and `db.programs.create` to save new items to storage immediately.
- This ensures Admin-created resources are permanent.

### 3. Updated Assessment Submission (`server/api/assessment/submit.post.ts`)

- Updated the submit endpoint to save the **New Assessment** and its **Responses** to `storage`.
- It now appends to the file instead of just updating memory.

### 4. Updated Dashboard API (`server/api/dashboard.get.ts`)

- Updated the dashboard endpoint to READ from `storage`.
- It merges the persisted assessments with the default in-memory mocks.
- It passes this merged data to `getSMEData`.

### 5. Updated Mock Data Helper (`utils/mock-data/index.ts`)

- Refactored `getSMEData` to accept `overrideAssessments` and `overrideResponses`.
- Refactored `getPillarScores` to calculate scores using the persisted response data.

---

## Verification

1. **Submit an Assessment** as an SME.
2. **Reload the Server** (or trigger HMR by editing a file).
3. **Refresh the Dashboard**.
4. The score should REMAIN visible and correct (not 0).
5. **Create a Program** as Admin -> Restart Server -> Program still exists.

This architecture decouples ephemeral mock data from critical user test data.
