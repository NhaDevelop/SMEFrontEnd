# Laravel Backend Implementation Plan: Full System API Migration

This plan details the step-by-step implementation for migrating the current Nuxt/Mock API frontend to a robust Laravel backend using JWT (JSON Web Tokens) for authentication and covering the entire assessment engine and dealflow logic.

---

## Phase 1: Foundation & Package Installation

1.  **Initialize Project**
    - Create a clean, new Laravel 11 project (or use your existing one).
    - Configure the `.env` file with your MySQL database credentials.

2.  **Install JWT Package**
    - Install the industry-standard package: `composer require php-open-source-saver/jwt-auth`
    - Publish the configuration: `php artisan vendor:publish --provider="PHPOpenSourceSaver\JWTAuth\Providers\LaravelServiceProvider"`
    - Generate the secret key: `php artisan jwt:secret`

3.  **Configure Auth Guards**
    - In `config/auth.php`, update the `api` guard to use the `jwt` driver instead of `token` or `sanctum`.

---

## Phase 2: Database Models & Migrations

Based on the schema architecture we established, create the following core models and their corresponding `_create_..._tables.php` migrations.

1.  **User Model (`app/Models/User.php`)**
    - Add fields: `email`, `password_hash`, `role` (Enum), `is_verified`.
    - **Crucial:** Implement the `PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject` interface.
    - Setup relationships: `hasOne(SmeProfile::class)`, `hasOne(InvestorProfile::class)`.

2.  **Sector Model (`app/Models/Sector.php`)**
    - Add fields: `name`, `color`, `description`.

3.  **Pillar & Template Models (`app/Models/Pillar.php`, `Template.php`)**
    - **Pillar:** `name`, `weight`. (e.g., TEAM, MARKET, FINANCIALS).
    - **Template:** `name`, `version`, `industry`, `status`.

4.  **SmeProfile Model (`app/Models/SmeProfile.php`)**
    - Add fields: `user_id`, `company_name`, `industry` (FK to sectors), `stage`, `team_size`, `location`.
    - Setup `belongsTo(User::class)`, `hasMany(Assessment::class)`, `hasMany(Goal::class)`.

5.  **Assessment Engine Models (`app/Models/Assessment.php`, `Question.php`, `AssessmentResponse.php`)**
    - **Question:** `template_id`, `pillar_id`, `text`, `type`, `options`, `weight`.
    - **Assessment:** `sme_id`, `template_id`, `status`, `total_score`.
    - **AssessmentResponse:** `assessment_id`, `question_id`, `answer_value`, `score_awarded`.

6.  **Run Migrations:** `php artisan migrate`

---

## Phase 3: Core Authentication API Endpoints

Create an `AuthController` (`php artisan make:controller AuthController`) to handle the auth endpoints. Place in `routes/api.php` under `prefix('auth')`.

| HTTP Method | Route                | Controller Action | Description & Logic                                                                                                                                                                             |
| :---------- | :------------------- | :---------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **POST**    | `/api/auth/register` | `register()`      | Validates payload (`name`, `email`, `password`, `role`). Creates a User (default status: 'PENDING'). Hashes password. If role is SME/INVESTOR, creates the respective profile model.            |
| **POST**    | `/api/auth/login`    | `login()`         | Checks credentials with `auth('api')->attempt()`. If successful, verifies the user `status === 'ACTIVE'`. If 'PENDING', aborts with customizable 403 error. If 'ACTIVE', returns the JWT token. |
| **GET**     | `/api/auth/me`       | `me()`            | Requires `auth:api` middleware. Returns `auth('api')->user()` along with eager-loaded profile data based on role.                                                                               |
| **POST**    | `/api/auth/logout`   | `logout()`        | Requires `auth:api` middleware. Calls `auth('api')->logout()` to invalidate the current JWT token.                                                                                              |
| **POST**    | `/api/auth/refresh`  | `refresh()`       | Requires `auth:api` middleware. Calls `auth('api')->refresh()` to issue a new token.                                                                                                            |

---

## Phase 4: Admin Management Endpoints

Create controllers like `Admin/SectorController`, `Admin/TemplateController`. Protect with `auth:api` and `role:ADMIN` middleware.

### Route Definitions:

1.  **Manage Industry Sectors**
    - **Route:** `GET /api/admin/sectors` and `POST /api/admin/sectors`
    - **Logic:** `Sector::all()` and `Sector::create($validated)`.
    - **Returns:** Array of sector objects to populate the dynamic dropdowns on the frontend.

2.  **Manage Assessment Templates**
    - **Route:** `POST /api/templates`
    - **Logic:** Creates a new Template framework tied to a specific industry.
    - **Returns:** Created Template model.

3.  **Manage Questions**
    - **Route:** `POST /api/templates/{id}/questions`
    - **Logic:** Validates payload. Assigns a new question to the specific `$id` template. **Crucial:** Ties the question to a specific `pillar_id` so frontend can group them by sections.

---

## Phase 5: SME Operations & Assessment Engine

Create `SmeProfileController`, `AssessmentController`. Protect with `role:SME`.

### Route Definitions:

1.  **Start Assessment**
    - **Route:** `POST /api/sme/assessments/start`
    - **Payload:** `{ template_id: 123 }`
    - **Logic:** Initializes a new `Assessment` record for `auth()->user()->smeProfile->id` with status returning `IN_PROGRESS`.
    - **Returns:** Assessment ID.

2.  **Submit Assessment Answers**
    - **Route:** `POST /api/assessments/{id}/submit`
    - **Payload:** Array of answers matching question IDs.
    - **Logic:** Evaluates the selected options against the Question's stored `options` JSON and `weight`. Calculates `score_awarded` for each response. Sums the final `total_score`, updates the Assessment status to `COMPLETED`.
    - **Returns:** Detailed score breakdown grouped by Pillars.

3.  **Manage Goals**
    - **Route:** `POST /api/sme/goals`
    - **Logic:** Creates a tracking goal tied to a specific `pillar_id` to address weaknesses identified in the assessment.

---

## Phase 6: Programs & Dealflow Marketplace

Create `ProgramController`, `DealflowController`.

### Route Definitions:

1.  **Create Program (Admin)**
    - **Route:** `POST /api/programs`
    - **Logic:** Admin launches a new Cohort assigned to a `template_id` and `sector`.

2.  **Apply to Program (SME)**
    - **Route:** `POST /api/programs/{id}/apply`
    - **Logic:** Creates a `program_enrollment` record with status `APPLIED`.

3.  **Investor Dealflow (Investor)**
    - **Route:** `GET /api/investor/dealflow`
    - **Logic:** `SmeProfile::with('sector', 'latestAssessment')->orderBy('latestAssessment.total_score', 'desc')->get();`
    - **Returns:** Array of highly ranked, investment-ready SMEs.

---

## Phase 7: Nuxt Frontend Connectivity

Once the Laravel backend is scaffolded and tested (e.g., via Postman):

1.  **Configure Axios/Fetch:** Ensure your Nuxt HTTP client is setting the `Authorization: Bearer <token>` header on every request if a token exists in local storage or cookies.
2.  **Repoint Nuxt API Paths:** Wipe the local JSON `server/utils/storage.ts` logic and point your Nuxt `$fetch` composites to the real `http://localhost:8000/api/...` Laravel backend.
