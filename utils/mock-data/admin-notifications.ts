// Admin Audit Logs
export const mockAdminAuditLogs = [
  {
    id: 1,
    admin_user_id: 1, // Sarah
    action_type: 'VERIFY_USER',
    target_id: 1,
    target_table: 'sme_profiles',
    details: {
      company_name: 'Angkor Tech',
      previous_status: 'pending',
      new_status: 'verified'
    },
    ip_address: '192.168.1.100',
    timestamp: '2024-02-02T10:00:00Z'
  },
  {
    id: 2,
    admin_user_id: 1,
    action_type: 'CREATE_PROGRAM',
    target_id: 1,
    target_table: 'programs',
    details: {
      program_name: 'AgriTech 2024 Batch',
      start_date: '2024-09-01'
    },
    ip_address: '192.168.1.100',
    timestamp: '2024-07-15T09:00:00Z'
  },
  {
    id: 3,
    admin_user_id: 1,
    action_type: 'VERIFY_USER',
    target_id: 2,
    target_table: 'sme_profiles',
    details: {
      company_name: 'GreenData Farm Solutions',
      previous_status: 'pending',
      new_status: 'verified'
    },
    ip_address: '192.168.1.100',
    timestamp: '2024-02-16T09:00:00Z'
  },
  {
    id: 4,
    admin_user_id: 2,
    action_type: 'CREATE_PROGRAM',
    target_id: 3,
    target_table: 'programs',
    details: {
      program_name: 'Tech Growth Accelerator',
      start_date: '2024-08-01'
    },
    ip_address: '192.168.1.105',
    timestamp: '2024-06-10T08:00:00Z'
  },
  {
    id: 5,
    admin_user_id: 1,
    action_type: 'VERIFY_DOCUMENT',
    target_id: 1,
    target_table: 'documents',
    details: {
      document_type: 'PITCH_DECK',
      sme_name: 'Angkor Tech',
      verification_notes: 'Comprehensive and professional'
    },
    ip_address: '192.168.1.100',
    timestamp: '2024-08-10T10:30:00Z'
  },
  {
    id: 6,
    admin_user_id: 1,
    action_type: 'VERIFY_DOCUMENT',
    target_id: 3,
    target_table: 'documents',
    details: {
      document_type: 'FINANCIALS',
      sme_name: 'GreenData Farm Solutions',
      verification_notes: 'Audited financials verified'
    },
    ip_address: '192.168.1.100',
    timestamp: '2024-10-29T09:00:00Z'
  }
]

// Notifications
export const mockNotifications = [
  {
    id: 1,
    user_id: 4, // GreenData founder
    type: 'GOAL_DUE',
    channel: 'EMAIL',
    is_read: true,
    title: 'Goal Deadline Approaching',
    message: 'Your goal "Complete 2023 Financial Audit" is due in 7 days',
    created_at: '2024-10-24T09:00:00Z'
  },
  {
    id: 2,
    user_id: 6, // James (Investor)
    type: 'SCORE_UPDATE',
    channel: 'PUSH',
    is_read: false,
    title: 'SME Score Updated',
    message: 'GreenData Farm Solutions updated their readiness score to 78',
    created_at: '2024-11-02T11:30:00Z'
  },
  {
    id: 3,
    user_id: 4,
    type: 'GOAL_ACHIEVED',
    channel: 'EMAIL',
    is_read: true,
    title: 'Congratulations!',
    message: 'You completed your goal "Complete 2023 Financial Audit"',
    created_at: '2024-10-28T16:05:00Z'
  },
  {
    id: 4,
    user_id: 3, // Angkor Tech
    type: 'NEW_MESSAGE',
    channel: 'IN_APP',
    is_read: false,
    title: 'New Investor Interest',
    message: 'Sequoia SEA has added you to their watchlist',
    created_at: '2024-10-12T11:15:00Z'
  },
  {
    id: 5,
    user_id: 5, // FinTech Solutions
    type: 'ASSESSMENT_REMINDER',
    channel: 'EMAIL',
    is_read: false,
    title: 'Complete Your Assessment',
    message: 'You have an incomplete assessment. Complete it to get your readiness score.',
    created_at: '2024-11-25T10:00:00Z'
  }
]
