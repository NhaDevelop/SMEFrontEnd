-- Database Schema for IRIP (Investment Readiness Intelligence Platform)
-- Target Database: PostgreSQL
-- ============================================================================
-- 1. USERS & AUTHENTICATION
-- ============================================================================
CREATE TYPE user_role AS ENUM ('ADMIN', 'SME', 'INVESTOR');
CREATE TYPE user_status AS ENUM ('PENDING', 'ACTIVE', 'REJECTED', 'SUSPENDED');
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    -- Managed by Auth Provider (e.g. Supabase/Firebase)
    role user_role NOT NULL,
    status user_status DEFAULT 'PENDING',
    is_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ============================================================================
-- 2. PROFILES
-- ============================================================================
CREATE TABLE sme_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    stage VARCHAR(50),
    -- e.g., Pre-Seed, Seed, Series A
    founding_date DATE,
    team_size INTEGER,
    location VARCHAR(255),
    website_url VARCHAR(255),
    description TEXT,
    logo_url VARCHAR(255),
    -- Calculated/Cached Fields for Performance
    readiness_score INTEGER DEFAULT 0,
    risk_level VARCHAR(20) DEFAULT 'High',
    -- Low, Medium, High
    growth_potential INTEGER DEFAULT 0,
    verified_by_user_id INTEGER REFERENCES users(id),
    verification_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE investor_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    organization_name VARCHAR(255) NOT NULL,
    investor_type VARCHAR(50),
    -- VC, Angel, PE, etc.
    min_ticket_size DECIMAL(15, 2),
    max_ticket_size DECIMAL(15, 2),
    preferred_industries TEXT [],
    -- Array of strings
    website_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ============================================================================
-- 3. ASSESSMENT FRAMEWORK (Admin Configurable)
-- ============================================================================
CREATE TYPE template_status AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');
CREATE TABLE templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(20) NOT NULL,
    description TEXT,
    status template_status DEFAULT 'DRAFT',
    created_by_user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE pillars (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    -- e.g., "Team & Leadership"
    weight DECIMAL(5, 2) NOT NULL,
    -- Percentage (0-100)
    description TEXT,
    template_id INTEGER REFERENCES templates(id) ON DELETE CASCADE
);
CREATE TABLE indicators (
    id SERIAL PRIMARY KEY,
    pillar_id INTEGER REFERENCES pillars(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    weight DECIMAL(5, 2) NOT NULL,
    -- Relative weight within Pillar
    description TEXT
);
CREATE TYPE question_type AS ENUM (
    'Is/No',
    'Scale (1-10)',
    'Dropdown',
    'Number',
    'Text',
    'Checkbox'
);
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES templates(id) ON DELETE CASCADE,
    pillar_id INTEGER REFERENCES pillars(id),
    -- Optional direct link
    indicator_id INTEGER REFERENCES indicators(id),
    -- Optional link for granular scoring
    text TEXT NOT NULL,
    type question_type NOT NULL,
    weight DECIMAL(5, 2) DEFAULT 1.0,
    -- Weight within its group (Indicator or Pillar)
    required BOOLEAN DEFAULT TRUE,
    helper_text TEXT,
    options JSONB,
    -- For dropdowns/checkboxes: [{"label": "Yes", "value": 10}, ...]
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ============================================================================
-- 4. ASSESSMENTS & SCORING
-- ============================================================================
CREATE TYPE assessment_status AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ARCHIVED');
CREATE TABLE assessments (
    id SERIAL PRIMARY KEY,
    sme_id INTEGER REFERENCES sme_profiles(id) ON DELETE CASCADE,
    template_id INTEGER REFERENCES templates(id),
    status assessment_status DEFAULT 'IN_PROGRESS',
    total_score DECIMAL(5, 2),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    -- Snapshots of calculated scores per pillar at time of completion
    pillar_scores JSONB -- {"Team": 80, "Market": 60}
);
CREATE TABLE assessment_responses (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER REFERENCES assessments(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id),
    answer_value TEXT,
    -- The actual input
    score_awarded DECIMAL(5, 2),
    -- The calculated points for this answer
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ============================================================================
-- 5. IMPROVEMENT & GOALS
-- ============================================================================
CREATE TYPE goal_status AS ENUM ('ACTIVE', 'COMPLETED', 'PAUSED', 'CANCELLED');
CREATE TYPE goal_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH');
CREATE TABLE goals (
    id SERIAL PRIMARY KEY,
    sme_id INTEGER REFERENCES sme_profiles(id) ON DELETE CASCADE,
    pillar_id INTEGER REFERENCES pillars(id),
    -- Optional link to specific pillar
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority goal_priority DEFAULT 'MEDIUM',
    status goal_status DEFAULT 'ACTIVE',
    progress_percentage INTEGER DEFAULT 0,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);
-- ============================================================================
-- 6. PROGRAMS & COHORTS
-- ============================================================================
CREATE TABLE programs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_by_user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TYPE enrollment_status AS ENUM (
    'INVITED',
    'APPLIED',
    'ACCEPTED',
    'REJECTED',
    'COMPLETED',
    'DROPPED'
);
CREATE TABLE program_enrollments (
    id SERIAL PRIMARY KEY,
    program_id INTEGER REFERENCES programs(id) ON DELETE CASCADE,
    sme_id INTEGER REFERENCES sme_profiles(id) ON DELETE CASCADE,
    status enrollment_status DEFAULT 'INVITED',
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);
-- ============================================================================
-- 7. INVESTOR TOOLS
-- ============================================================================
CREATE TABLE investor_watchlist (
    id SERIAL PRIMARY KEY,
    investor_id INTEGER REFERENCES investor_profiles(id) ON DELETE CASCADE,
    sme_id INTEGER REFERENCES sme_profiles(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ============================================================================
-- 8. DOCUMENTS & VERIFICATION
-- ============================================================================
CREATE TYPE doc_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    sme_id INTEGER REFERENCES sme_profiles(id) ON DELETE CASCADE,
    type VARCHAR(50),
    -- Pitch Deck, Financials, Legal
    name VARCHAR(255),
    file_url TEXT NOT NULL,
    verification_status doc_status DEFAULT 'PENDING',
    verified_by_user_id INTEGER REFERENCES users(id),
    verification_notes TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE verification_requests (
    id SERIAL PRIMARY KEY,
    sme_id INTEGER REFERENCES sme_profiles(id) ON DELETE CASCADE,
    document_id INTEGER REFERENCES documents(id),
    status doc_status DEFAULT 'PENDING',
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);
-- ============================================================================
-- 9. ADMIN & SYSTEM
-- ============================================================================
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    target_entity VARCHAR(100),
    target_id VARCHAR(50),
    details TEXT,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE scoring_rules (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    condition_expression TEXT,
    -- e.g. "revenue > 100000"
    score_modifier INTEGER,
    is_active BOOLEAN DEFAULT TRUE
);
CREATE TABLE custom_fields (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    -- SME, USER, PROGRAM
    name VARCHAR(100) NOT NULL,
    label VARCHAR(255) NOT NULL,
    field_type VARCHAR(50) NOT NULL,
    -- TEXT, NUMBER, DATE, DROPDOWN
    required BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    options JSONB -- Options for dropdowns
);
CREATE TABLE custom_field_values (
    id SERIAL PRIMARY KEY,
    custom_field_id INTEGER REFERENCES custom_fields(id),
    entity_id INTEGER NOT NULL,
    -- ID of the SME/User/Program
    value TEXT,
    -- Store as text, parse based on field_type
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type VARCHAR(50),
    -- ALERT, INFO, SUCCESS
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);