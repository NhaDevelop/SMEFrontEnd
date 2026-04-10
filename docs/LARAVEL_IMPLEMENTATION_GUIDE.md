# Complete Laravel Backend Build Map: From Mock APIs to Real Database

This document outlines the exact flow of development required to rebuild the Nuxt mock endpoints into a true Laravel backend. You must follow the Phases in order to avoid foreign key dependency errors. This guide provides the exact database columns and data types required for every step so your frontend payload structure does not break.

---

## Phase 1: The Core Foundation (Security & Registrations)

**1. Setup & Package Installation**

- Initialize Laravel 11 project and hook up the MySQL connection.
- Install: `composer require php-open-source-saver/jwt-auth`
- Configure `config/auth.php` to use the `api` guard via `jwt`.

**2. The Database Migrations (Profiles & Auth)**
Create these tables exactly as listed.

- `users`: `id` (VARCHAR PK), `email` (VARCHAR UNIQUE), `password_hash` (VARCHAR), `role` (VARCHAR), `is_verified` (BOOLEAN), `created_at` (TIMESTAMP), `updated_at` (TIMESTAMP).
- `sme_profiles`: `id` (VARCHAR PK), `user_id` (VARCHAR FK -> users.id), `company_name` (VARCHAR), `industry` (VARCHAR), `stage` (VARCHAR), `founding_date` (DATE), `team_size` (VARCHAR), `location` (VARCHAR), `website_url` (VARCHAR), `verified_by_user_id` (VARCHAR FK -> users.id), `verification_date` (TIMESTAMP).
- `investor_profiles`: `id` (VARCHAR PK), `user_id` (VARCHAR FK -> users.id), `organization_name` (VARCHAR), `investor_type` (VARCHAR), `min_ticket_size` (DECIMAL), `max_ticket_size` (DECIMAL).

**3. Registration Endpoints (`server/api/registrations`)**

- **`POST /api/registrations`:** Validates payload. Creates the base `User` with `status: 'PENDING'`. Creates a blank `sme_profile` or `investor_profile` attached to the `user_id`.
- **`GET /api/registrations`:** Returns pending users to the admin dashboard.
- **`PATCH /api/registrations/{id}`:** Updates the user `is_verified` boolean to `true`.

**4. Auth Endpoints (`server/api/auth`)**

- **`POST /api/auth/login`:** Checks if credentials match AND if `is_verified` is true. Returns the JWT string.
- **`GET /api/auth/user`:** Requires Auth. Returns the `User` model, heavily eager-loading the relations (`smeProfile`, `investorProfile`).
- **`POST /api/auth/logout`:** Requires Auth. Destroys the JWT token.

---

## Phase 2: System Configuration (Admin Settings)

**1. Managing Sectors (Industries) Database & API**

- `sectors` table: `id` (INT PK), `name` (VARCHAR UNIQUE), `color` (VARCHAR), `description` (TEXT), `created_at` (TIMESTAMP).
- **`GET /api/admin/sectors`:** Returns all `Sector` objects.
- **`POST /api/admin/sectors`:** Requires (`name`, `color`, `description`). Creates `Sector`.
- **`PUT /api/admin/sectors/{id}`:** Updates `Sector`.
- **`DELETE /api/admin/sectors/{id}`:** Deletes `Sector`.

**2. Managing Assessment Framework Database**

- `pillars` table: `id` (VARCHAR PK), `name` (VARCHAR), `weight` (DECIMAL).
- `templates` table: `id` (VARCHAR PK), `name` (VARCHAR), `version` (VARCHAR), `industry` (VARCHAR), `status` (VARCHAR), `description` (TEXT), `created_at` (TIMESTAMP).
- `questions` table: `id` (VARCHAR PK), `pillar_id` (VARCHAR FK -> pillars.id), `template_id` (VARCHAR FK -> templates.id), `text` (TEXT), `type` (VARCHAR), `options` (JSON), `weight` (DECIMAL).

**3. Assessment Framework API Endpoints**

- **`GET /api/admin/templates`:** Returns list of templates.
- **`POST /api/admin/templates`:** Creates a `Template` model.
- **`GET /api/admin/questions`:** Returns all questions.
- **`POST /api/admin/questions`:** Requires (`template_id`, `pillar_id`, `text`, `type`, `options` array, `weight`). Creates `Question` model.
- **`DELETE /api/admin/questions/{id}`:** Deletes `Question`.

---

## Phase 3: The SME Core Loop (Assessments & Goals)

**1. Database Tables for Tracking Tests**

- `assessments` table: `id` (VARCHAR PK), `sme_id` (VARCHAR FK -> sme_profiles.id), `template_id` (VARCHAR FK -> templates.id), `status` (VARCHAR), `started_at` (TIMESTAMP), `completed_at` (TIMESTAMP), `total_score` (DECIMAL).
- `assessment_responses` table: `id` (VARCHAR PK), `assessment_id` (VARCHAR FK -> assessments.id), `question_id` (VARCHAR FK -> questions.id), `answer_value` (JSON), `score_awarded` (DECIMAL).
- `goals` table: `id` (VARCHAR PK), `sme_id` (VARCHAR FK -> sme_profiles.id), `title` (VARCHAR), `description` (TEXT), `pillar_id` (VARCHAR FK -> pillars.id), `status` (VARCHAR), `due_date` (DATE), `progress_percentage` (INT).
- `documents` table: `id` (VARCHAR PK), `sme_id` (VARCHAR FK -> sme_profiles.id), `type` (VARCHAR), `file_url` (VARCHAR), `is_verified` (BOOLEAN), `verified_by_user_id` (VARCHAR FK -> users.id), `uploaded_at` (TIMESTAMP).

**2. The Assessment Endpoints (`server/api/assessment`)**

- **`GET /api/assessment/questions`:** Queries `questions` table grouped by `pillar_id` for the SME's industry template.
- **`POST /api/assessment/submit`:** Complex logic. Receives payload of answers. Loops through responses. Uses the `options` JSON mapping on the `Question` model to calculate `score_awarded`. Creates `AssessmentResponse` rows. Sums total, updates `assessments.total_score` and `assessments.status` to 'COMPLETED'.
- **`GET /api/assessment/history`:** Returns the SME's completed `Assessment` models.

**3. SME Goal Endpoints (`server/api/sme/goals`)**

- **`GET /api/sme/goals`:** Returns goals for Auth'd SME.
- **`POST /api/sme/goals`:** Creates `Goal` model requiring (`title`, `description`, `pillar_id`, `due_date`).
- **`PATCH /api/sme/goals/{id}`:** Updates `progress_percentage` or `status` of a goal.
- **`DELETE /api/sme/goals/{id}`:** Deletes goal.

**4. SME Document Endpoints (`server/api/documents`)**

- **`GET /api/documents`:** Returns all documents for Auth'd SME.
- **`POST /api/documents`:** Handles multipart file logic. Stores to disk/S3. Creates `Document` row with `file_url`.
- **`GET /api/documents/{id}`:** Downloads/returns specific document.
- **`DELETE /api/documents/{id}`:** Deletes file from storage and database.

---

## Phase 4: Programs & The Dealflow Marketplace

**1. Database Tables for Community**

- `programs` table: `id` (VARCHAR PK), `name` (VARCHAR), `description` (TEXT), `template_id` (VARCHAR FK -> templates.id), `sector` (VARCHAR), `start_date` (DATE), `end_date` (DATE), `created_by_user_id` (VARCHAR FK -> users.id).
- `program_enrollments` table: `id` (VARCHAR PK), `program_id` (VARCHAR FK -> programs.id), `sme_id` (VARCHAR FK -> sme_profiles.id), `status` (VARCHAR), `enrollment_date` (TIMESTAMP).
- `investor_interests` table: `id` (VARCHAR PK), `investor_id` (VARCHAR FK -> investor_profiles.id), `sme_id` (VARCHAR FK -> sme_profiles.id), `notes` (TEXT), `created_at` (TIMESTAMP).

**2. Program Endpoints (`server/api/programs`)**

- **`GET /api/programs` & `GET /api/admin/programs`:** Lists active `Program` models.
- **`POST /api/admin/programs`:** Requires (`name`, `description`, `template_id`, `sector`, `start_date`, `end_date`).
- **`POST /api/sme/programs/apply`:** Creates `ProgramEnrollment` junction row for SME with status 'APPLIED'.
- **`POST /api/admin/programs/enroll`:** Updates `ProgramEnrollment` status to 'ACCEPTED'.

**3. Investor Dealflow Endpoints (`server/api/investor`)**

- **`GET /api/investor/dealflow`:** Master query. Queries `SmeProfile` models. Joins `Sector` and the `latestAssessment()`. Orders array by `latestAssessment.total_score` descending.
- **`GET /api/investor/smes`:** Returns general directory of SMEs.

---

## Phase 5: Dashboards, Reports, & Communications

**1. Database Tables for Social & Tracking**

- `messages` table: `id` (VARCHAR PK), `sender_id` (VARCHAR FK -> users.id), `receiver_id` (VARCHAR FK -> users.id), `content` (TEXT), `read` (BOOLEAN), `created_at` (TIMESTAMP).
- `notifications` table: `id` (VARCHAR PK), `user_id` (VARCHAR FK -> users.id), `type` (VARCHAR), `message` (TEXT), `is_read` (BOOLEAN), `created_at` (TIMESTAMP).
- `program_comments` table: `id` (VARCHAR PK), `program_id` (VARCHAR FK -> programs.id), `user_id` (VARCHAR FK -> users.id), `content` (TEXT), `created_at` (TIMESTAMP).
- `admin_audit_logs` table: `id` (VARCHAR PK), `admin_user_id` (VARCHAR FK -> users.id), `action_type` (VARCHAR), `target_id` (VARCHAR), `target_table` (VARCHAR), `details` (JSON), `timestamp` (TIMESTAMP).

**2. Messaging & Comments Endpoints**

- **`GET /api/messages` & `POST /api/messages`:** Fetches/Creates `Message` string contents.
- **`GET /api/programs/{id}/comments` & `POST /api/programs/{id}/comments`:** Handles forum thread logic for a specific cohort.
- **`GET /api/notifications`:** Fetches unread `Notification` alerts for the `auth()->user()`.

**3. Dashboard Analytics Endpoints (`server/api/dashboard`)**

- **`GET /api/admin/dashboard`:** Aggregates statistics (Counts of `User::class`, averages from `Assessment::class`).
- **`GET /api/investor/dashboard`:** Aggregates dealflow statistics for the investor UI.
- **`GET /api/dashboard`:** Standard SME dashboard metrics.

**4. Reporting & Audit Endpoints**

- **`GET /api/admin/audit-logs`:** Returns `AdminAuditLog` events.
- **`GET /api/reports/export`:** Query builder generating CSV/Excel download payloads for Admins.
- **`GET /api/reports/portfolio` & `GET /api/reports/readiness`:** Specific queries driving the Admin charting components.
