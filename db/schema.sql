-- Database Schema for IRIP (Investment Readiness Intelligence Platform)
-- Target Database: MySQL
-- ============================================================================
-- MySQL uses inline ENUMs or strict VARCHARs.
-- MySQL uses AUTO_INCREMENT instead of SERIAL.
-- PostgreSQL JSONB becomes MySQL JSON.
-- TEXT [] arrays in PostgreSQL become JSON in MySQL.
-- ============================================================================
-- 1. USERS & AUTHENTICATION
-- ============================================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role ENUM('ADMIN', 'SME', 'INVESTOR') NOT NULL,
    status ENUM('PENDING', 'ACTIVE', 'REJECTED', 'SUSPENDED') DEFAULT 'PENDING',
    is_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- ============================================================================
-- 2. PROFILES
-- ============================================================================
CREATE TABLE sme_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    stage VARCHAR(50),
    years_in_business VARCHAR(50),
    team_size VARCHAR(50),
    address TEXT,
    registration_number VARCHAR(100),
    website_url VARCHAR(255),
    description TEXT,
    logo_url VARCHAR(255),
    readiness_score INT DEFAULT 0,
    risk_level ENUM('Low', 'Medium', 'High') DEFAULT 'High',
    growth_potential INT DEFAULT 0,
    verified_by_user_id INT,
    verification_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by_user_id) REFERENCES users(id) ON DELETE
    SET NULL
);
CREATE TABLE investor_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    organization_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100),
    industry VARCHAR(100),
    years_in_business VARCHAR(50),
    team_size VARCHAR(50),
    address TEXT,
    investor_type VARCHAR(50),
    min_ticket_size DECIMAL(15, 2),
    max_ticket_size DECIMAL(15, 2),
    preferred_industries JSON,
    -- Replaces PostgreSQL TEXT[]
    website_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- ============================================================================
-- 3. ASSESSMENT FRAMEWORK (Admin Configurable)
-- ============================================================================
CREATE TABLE templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(20) NOT NULL,
    description TEXT,
    status ENUM('DRAFT', 'ACTIVE', 'ARCHIVED') DEFAULT 'DRAFT',
    created_by_user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE
    SET NULL
);
CREATE TABLE pillars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    weight DECIMAL(5, 2) NOT NULL,
    description TEXT,
    template_id INT,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
);
CREATE TABLE indicators (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pillar_id INT,
    name VARCHAR(255) NOT NULL,
    weight DECIMAL(5, 2) NOT NULL,
    description TEXT,
    FOREIGN KEY (pillar_id) REFERENCES pillars(id) ON DELETE CASCADE
);
CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_id INT,
    pillar_id INT,
    indicator_id INT,
    text TEXT NOT NULL,
    type ENUM(
        'Is/No',
        'Scale (1-10)',
        'Dropdown',
        'Number',
        'Text',
        'Checkbox'
    ) NOT NULL,
    weight DECIMAL(5, 2) DEFAULT 1.0,
    required BOOLEAN DEFAULT TRUE,
    helper_text TEXT,
    options JSON,
    -- Replaces PostgreSQL JSONB
    status ENUM('ACTIVE', 'INACTIVE', 'ARCHIVED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE,
    FOREIGN KEY (pillar_id) REFERENCES pillars(id) ON DELETE
    SET NULL,
        FOREIGN KEY (indicator_id) REFERENCES indicators(id) ON DELETE
    SET NULL
);
-- ============================================================================
-- 4. ASSESSMENTS & SCORING
-- ============================================================================
CREATE TABLE assessments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sme_id INT,
    template_id INT,
    status ENUM('IN_PROGRESS', 'COMPLETED', 'ARCHIVED') DEFAULT 'IN_PROGRESS',
    total_score DECIMAL(5, 2),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    pillar_scores JSON,
    -- Replaces PostgreSQL JSONB
    FOREIGN KEY (sme_id) REFERENCES sme_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE
    SET NULL
);
CREATE TABLE assessment_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assessment_id INT,
    question_id INT,
    answer_value TEXT,
    score_awarded DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE
    SET NULL
);
-- ============================================================================
-- 5. IMPROVEMENT & GOALS
-- ============================================================================
CREATE TABLE goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sme_id INT,
    pillar_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM',
    status ENUM('ACTIVE', 'COMPLETED', 'PAUSED', 'CANCELLED') DEFAULT 'ACTIVE',
    progress_percentage INT DEFAULT 0,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (sme_id) REFERENCES sme_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (pillar_id) REFERENCES pillars(id) ON DELETE
    SET NULL
);
-- ============================================================================
-- 6. PROGRAMS & COHORTS
-- ============================================================================
CREATE TABLE programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    template_id INT,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status ENUM('ACTIVE', 'DRAFT', 'ARCHIVED') DEFAULT 'ACTIVE',
    created_by_user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE
    SET NULL,
        FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE
    SET NULL
);
CREATE TABLE program_enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    program_id INT,
    sme_id INT,
    status ENUM(
        'INVITED',
        'APPLIED',
        'ACCEPTED',
        'REJECTED',
        'COMPLETED',
        'DROPPED'
    ) DEFAULT 'INVITED',
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    FOREIGN KEY (sme_id) REFERENCES sme_profiles(id) ON DELETE CASCADE
);
-- ============================================================================
-- 7. INVESTOR TOOLS
-- ============================================================================
CREATE TABLE investor_watchlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    investor_id INT,
    sme_id INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (investor_id) REFERENCES investor_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (sme_id) REFERENCES sme_profiles(id) ON DELETE CASCADE
);
-- ============================================================================
-- 8. DOCUMENTS & VERIFICATION
-- ============================================================================
CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sme_id INT,
    type VARCHAR(50),
    name VARCHAR(255),
    file_url TEXT NOT NULL,
    verification_status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    verified_by_user_id INT,
    verification_notes TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sme_id) REFERENCES sme_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by_user_id) REFERENCES users(id) ON DELETE
    SET NULL
);
CREATE TABLE verification_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sme_id INT,
    document_id INT,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (sme_id) REFERENCES sme_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
);
-- ============================================================================
-- 9. ADMIN & SYSTEM
-- ============================================================================
CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    target_entity VARCHAR(100),
    target_id VARCHAR(50),
    details TEXT,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE
    SET NULL
);
CREATE TABLE scoring_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    condition_expression TEXT,
    score_modifier INT,
    is_active BOOLEAN DEFAULT TRUE
);
CREATE TABLE custom_fields (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entity_type ENUM('SME', 'USER', 'PROGRAM') NOT NULL,
    name VARCHAR(100) NOT NULL,
    label VARCHAR(255) NOT NULL,
    field_type ENUM('TEXT', 'NUMBER', 'DATE', 'DROPDOWN') NOT NULL,
    required BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    options JSON
);
CREATE TABLE custom_field_values (
    id INT AUTO_INCREMENT PRIMARY KEY,
    custom_field_id INT,
    entity_id INT NOT NULL,
    value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (custom_field_id) REFERENCES custom_fields(id) ON DELETE CASCADE
);
CREATE TABLE notification_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('email', 'in-app', 'sms') NOT NULL,
    trigger_event VARCHAR(100) NOT NULL,
    subject VARCHAR(255),
    body TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type ENUM('ALERT', 'INFO', 'SUCCESS'),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE report_logs (
    id VARCHAR(255) PRIMARY KEY,
    type ENUM('PDF', 'CSV') NOT NULL,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    sme_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sme_id) REFERENCES sme_profiles(id) ON DELETE
    SET NULL
);