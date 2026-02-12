# Database Schema Design Guide

This document maps user actions to specific database tables and relationships to help you design the backend schema.

---

## 1. Core Users & Authentication

**Actions:**

- **All Roles:** Register, Login, Update Profile, Manage Preferences.
- **Admin:** Verify users.

**Schema Implications:**

### `users`

- `id` (PK)
- `email` (Unique)
- `password_hash`
- `role` (Enum: 'ADMIN', 'SME', 'INVESTOR')
- `is_verified` (Boolean) - _Controlled by Admin_
- `created_at`, `updated_at`

### `sme_profiles`

- `id` (PK)
- `user_id` (FK -> users.id)
- `company_name`
- `industry`
- `stage` (e.g., 'Pre-seed', 'Growth')
- `founding_date`
- `team_size`
- `location`
- `website_url`
- `verified_by_user_id` (FK -> users.id) - _Which Admin approved this SME?_
- `verification_date`

### `investor_profiles`

- `id` (PK)
- `user_id` (FK -> users.id)
- `organization_name`
- `investor_type` (e.g., 'Angel', 'VC', 'Accelerator')
- `min_ticket_size`
- `max_ticket_size`
- `preferred_industries` (JSON or separate related table)

---

## 2. Assessment Engine (The "Heart")

**Actions:**

- **Admin:** Creates questions, weights, and pillars.
- **SME:** Starts assessment, answers questions, gets scores.

**Schema Implications:**

### `pillars`

- `id` (PK)
- `name` (e.g., "TEAM", "MARKET", "FINANCIALS")
- `weight` (Decimal) - _How much this pillar counts towards the total score_

### `questions`

- `id` (PK)
- `pillar_id` (FK -> pillars.id)
- `text` (The actual question)
- `type` (Enum: 'CHOICE', 'BOOLEAN', 'NUMBER')
- `options` (JSON) - _For multiple choice options and their point values_
- `weight` (Decimal) - _Importance of this specific question_

### `assessments` (An "Instance" of a test)

- `id` (PK)
- `sme_id` (FK -> sme_profiles.id)
- `status` (Enum: 'IN_PROGRESS', 'COMPLETED')
- `started_at`
- `completed_at`
- `total_score` (Decimal) - _Snapshot of the final score_

### `assessment_responses`

- `id` (PK)
- `assessment_id` (FK -> assessments.id)
- `question_id` (FK -> questions.id)
- `answer_value` (Text/JSON) - _What the SME selected_
- `score_awarded` (Decimal) - _Points earned for this answer_

---

## 3. Goals & Progress

**Actions:**

- **SME:** Creates goals based on assessment gaps.
- **SME:** Updates progress (e.g., "In Progress" -> "Done").

**Schema Implications:**

### `goals`

- `id` (PK)
- `sme_id` (FK -> sme_profiles.id)
- `title`
- `description`
- `pillar_id` (FK -> pillars.id) - _Links goal to a specific weakness_
- `status` (Enum: 'ACTIVE', 'COMPLETED', 'ARCHIVED')
- `due_date`
- `progress_percentage` (Integer)

---

## 4. Programs & Enrollment

**Actions:**

- **Admin:** Creates a "Cohort" or "Program".
- **SME:** Enrolls in a program.
- **Admin/Investor:** Tracks SMEs in specific programs.

**Schema Implications:**

### `programs`

- `id` (PK)
- `name` (e.g., "AgriTech 2024 Batch")
- `description`
- `created_by_user_id` (FK -> users.id) - _Admin who launched this_
- `start_date`
- `end_date`

### `program_enrollments`

- `id` (PK)
- `program_id` (FK -> programs.id)
- `sme_id` (FK -> sme_profiles.id)
- `status` (Enum: 'APPLIED', 'ACCEPTED', 'REJECTED')
- `enrollment_date`

---

## 5. Interactions & Documents

**Actions:**

- **Investor:** Watches an SME.
- **SME:** Uploads "Pitch Deck" or "Financial Audit".

**Schema Implications:**

### `investor_interests` (The "Watchlist")

- `id` (PK)
- `investor_id` (FK -> investor_profiles.id)
- `sme_id` (FK -> sme_profiles.id)
- `notes`
- `created_at`

### `documents`

- `id` (PK)
- `sme_id` (FK -> sme_profiles.id)
- `type` (Enum: 'PITCH_DECK', 'FINANCIALS', 'LEGAL')
- `file_url` (S3/Storage path)
- `is_verified` (Boolean) - _Did Admin check this?_
- `verified_by_user_id` (FK -> users.id) - _Admin who checked the doc_
- `uploaded_at`

### `notifications` (For Preferences Page)

- `id` (PK)
- `user_id` (FK -> users.id)
- `type` (Enum: 'GOAL_DUE', 'SCORE_UPDATE', 'NEW_MESSAGE')
- `channel` (Enum: 'EMAIL', 'PUSH', 'IN_APP')
- `is_read` (Boolean)

---

## 6. Admin & System Management

**Actions:**

- **Admin:** Verifies a user.
- **Admin:** Changes a system setting.
- **System:** Logs critical actions for security.

**Schema Implications:**

### `admin_audit_logs`

- `id` (PK)
- `admin_user_id` (FK -> users.id)
- `action_type` (Enum: 'VERIFY_USER', 'CREATE_PROGRAM', 'UPDATE_SETTINGS')
- `target_id` (Integer) - _ID of the object affected (e.g., sme_id)_
- `target_table` (String) - _Table of the object affected_
- `details` (JSON) - _Previous values, or specific notes_
- `ip_address`
- `timestamp`
