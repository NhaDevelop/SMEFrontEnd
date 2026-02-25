// Mock Users Data
export const mockUsers = [
  // Admin Users
  {
    id: 1,
    email: 'sarah@techhub.com',
    role: 'ADMIN',
    is_verified: true,
    created_at: '2024-01-15T08:00:00Z'
  },
  {
    id: 2,
    email: 'admin@irip.com',
    role: 'ADMIN',
    is_verified: true,
    created_at: '2024-01-10T08:00:00Z'
  },
  
  // SME Users
  {
    id: 3,
    email: 'sokha@angkortech.com',
    role: 'SME',
    is_verified: true,
    created_at: '2024-02-01T10:00:00Z'
  },
  {
    id: 4,
    email: 'founder@greendata.com',
    role: 'SME',
    is_verified: true,
    created_at: '2024-02-15T09:00:00Z'
  },
  {
    id: 5,
    email: 'ceo@fintech-solutions.com',
    role: 'SME',
    is_verified: false,
    created_at: '2024-03-01T11:00:00Z'
  },
  
  // Investor Users
  {
    id: 6,
    email: 'james@mekongcapital.com',
    role: 'INVESTOR',
    is_verified: true,
    created_at: '2024-01-20T08:00:00Z'
  },
  {
    id: 7,
    email: 'investor@sequoia.com',
    role: 'INVESTOR',
    is_verified: true,
    created_at: '2024-01-25T08:00:00Z'
  }
]

export const mockSMEProfiles = [
  {
    id: 1,
    user_id: 3,
    company_name: 'Angkor Tech',
    industry: 'Technology',
    stage: 'Growth',
    founding_date: '2020-06-15',
    team_size: 25,
    location: 'Phnom Penh, Cambodia',
    website_url: 'https://angkortech.com',
    description: 'A leading technology company providing innovative software solutions for the Cambodian market.',
    verified_by_user_id: 1,
    verification_date: '2024-02-02T10:00:00Z'
  },
  {
    id: 2,
    user_id: 4,
    company_name: 'GreenData Farm Solutions',
    industry: 'AgriTech',
    stage: 'Seed',
    founding_date: '2022-03-10',
    team_size: 8,
    location: 'Siem Reap, Cambodia',
    website_url: 'https://greendata.com',
    description: 'Empowering farmers with data-driven insights to improve crop yields and sustainability.',
    verified_by_user_id: 1,
    verification_date: '2024-02-16T09:00:00Z'
  },
  {
    id: 3,
    user_id: 5,
    company_name: 'FinTech Solutions',
    industry: 'FinTech',
    stage: 'Pre-seed',
    founding_date: '2023-11-01',
    team_size: 5,
    location: 'Phnom Penh, Cambodia',
    website_url: 'https://fintech-solutions.com',
    description: 'Revolutionizing financial access for underserved communities through mobile technology.',
    verified_by_user_id: null,
    verification_date: null
  }
]

export const mockInvestorProfiles = [
  {
    id: 1,
    user_id: 6,
    organization_name: 'Mekong Capital',
    investor_type: 'VC',
    min_ticket_size: 50000,
    max_ticket_size: 500000,
    preferred_industries: ['AgriTech', 'FinTech', 'HealthTech']
  },
  {
    id: 2,
    user_id: 7,
    organization_name: 'Sequoia SEA',
    investor_type: 'VC',
    min_ticket_size: 100000,
    max_ticket_size: 2000000,
    preferred_industries: ['Technology', 'SaaS', 'AI']
  }
]
