/**
 * Template Questions Data
 * Shared between client (admin store) and server (API routes)
 * This avoids Pinia store access issues in server-side code
 */

export const templateQuestions = [
  // --- Standard Investment Readiness (temp_001) - 41 questions ---
  // Team (6)
  { id: 'q1', pillarId: 'team', templateId: 'temp_001', text: 'Does your company have a dedicated CEO?', type: 'Yes/No', weight: 15, required: true },
  { id: 'q2', pillarId: 'team', templateId: 'temp_001', text: 'Do you have a CFO?', type: 'Yes/No', weight: 15, required: true },
  { id: 'q3', pillarId: 'team', templateId: 'temp_001', text: 'Do you have an advisory board?', type: 'Yes/No', weight: 10, required: false },
  { 
    id: 'q4', 
    pillarId: 'team', 
    templateId: 'temp_001', 
    text: 'Years of industry experience in leadership?', 
    type: 'Dropdown Select', 
    weight: 20, 
    required: true,
    options: ['10+ years', '6-10 years', '3-5 years', '0-2 years'] 
  },
  { id: 'q5', pillarId: 'team', templateId: 'temp_001', text: 'Rate team execution ability', type: 'Scale (1-10)', weight: 20, required: true },
  { id: 'q23', pillarId: 'team', templateId: 'temp_001', text: 'Do you have a clear organizational chart?', type: 'Yes/No', weight: 20, required: true },
  
  // Business (5)
  { id: 'q8', pillarId: 'business', templateId: 'temp_001', text: 'Is your value proposition clearly defined?', type: 'Yes/No', weight: 20, required: true },
  { id: 'q9', pillarId: 'business', templateId: 'temp_001', text: 'Do you have a scalable business model?', type: 'Yes/No', weight: 20, required: true },
  { 
    id: 'q10', 
    pillarId: 'business', 
    templateId: 'temp_001', 
    text: 'Primary revenue stream?', 
    type: 'Dropdown Select', 
    weight: 20, 
    required: true,
    options: ['Recurring / Subscription', 'One-time Sales', 'Service Fees', 'Licensing', 'Advertising'] 
  },
  { id: 'q24', pillarId: 'business', templateId: 'temp_001', text: 'Customer acquisition strategy defined?', type: 'Yes/No', weight: 20, required: true },
  { id: 'q25', pillarId: 'business', templateId: 'temp_001', text: 'Partnership strategy in place?', type: 'Yes/No', weight: 20, required: false },

  // Market (5)
  { id: 'q7', pillarId: 'market', templateId: 'temp_001', text: 'Total Addressable Market (TAM) size?', type: 'Number', weight: 30, required: true },
  { id: 'q11', pillarId: 'market', templateId: 'temp_001', text: 'Have you defined your target customer persona?', type: 'Yes/No', weight: 20, required: true },
  { id: 'q12', pillarId: 'market', templateId: 'temp_001', text: 'Who is your main competitor?', type: 'Text', weight: 10, required: false },
  { id: 'q26', pillarId: 'market', templateId: 'temp_001', text: 'Market growth rate (%)', type: 'Number', weight: 20, required: true },
  { id: 'q27', pillarId: 'market', templateId: 'temp_001', text: 'Regulatory barriers to entry?', type: 'Yes/No', weight: 20, required: true },

  // Finance (5)
  { id: 'q13', pillarId: 'finance', templateId: 'temp_001', text: 'Do you have 2 years of financial statements?', type: 'Yes/No', weight: 25, required: true },
  { id: 'q14', pillarId: 'finance', templateId: 'temp_001', text: 'Are you currently profitable?', type: 'Yes/No', weight: 25, required: true },
  { id: 'q15', pillarId: 'finance', templateId: 'temp_001', text: 'Monthly Burn Rate (USD)', type: 'Number', weight: 20, required: true },
  { id: 'q28', pillarId: 'finance', templateId: 'temp_001', text: 'Projected revenue next year?', type: 'Number', weight: 15, required: true },
  { id: 'q29', pillarId: 'finance', templateId: 'temp_001', text: 'Debt to Equity ratio', type: 'Number', weight: 15, required: false },

  // Ops (5)
  { id: 'q16', pillarId: 'ops', templateId: 'temp_001', text: 'Do you have documented SOPs?', type: 'Yes/No', weight: 30, required: true },
  { id: 'q17', pillarId: 'ops', templateId: 'temp_001', text: 'Rate your supply chain stability', type: 'Scale (1-10)', weight: 30, required: true },
  { id: 'q30', pillarId: 'ops', templateId: 'temp_001', text: 'Disaster recovery plan in place?', type: 'Yes/No', weight: 20, required: true },
  { id: 'q31', pillarId: 'ops', templateId: 'temp_001', text: 'Quality control process defined?', type: 'Yes/No', weight: 10, required: true },
  { id: 'q32', pillarId: 'ops', templateId: 'temp_001', text: 'Inventory management system used?', type: 'Yes/No', weight: 10, required: false },

  // Legal (5)
  { id: 'q18', pillarId: 'legal', templateId: 'temp_001', text: 'Is your IP legally protected?', type: 'Yes/No', weight: 40, required: true },
  { id: 'q19', pillarId: 'legal', templateId: 'temp_001', text: 'Any pending litigation?', type: 'Yes/No', weight: 60, required: true },
  { id: 'q33', pillarId: 'legal', templateId: 'temp_001', text: 'Employee contracts signed?', type: 'Yes/No', weight: 30, required: true },
  { id: 'q34', pillarId: 'legal', templateId: 'temp_001', text: 'Compliance with local labor laws?', type: 'Yes/No', weight: 30, required: true },
  { id: 'q35', pillarId: 'legal', templateId: 'temp_001', text: 'Shareholder agreement signed?', type: 'Yes/No', weight: 40, required: true },

  // Data (5)
  { id: 'q20', pillarId: 'data', templateId: 'temp_001', text: 'Do you collect customer data?', type: 'Yes/No', weight: 30, required: true },
  { id: 'q21', pillarId: 'data', templateId: 'temp_001', text: 'Are you compliant with data privacy laws?', type: 'Yes/No', weight: 70, required: true },
  { 
    id: 'q36', 
    pillarId: 'data', 
    templateId: 'temp_001', 
    text: 'Data backup frequency?', 
    type: 'Dropdown Select', 
    weight: 30, 
    required: true,
    options: ['Daily', 'Weekly', 'Monthly', 'Never']
  },
  { id: 'q37', pillarId: 'data', templateId: 'temp_001', text: 'Cybersecurity measures in place?', type: 'Yes/No', weight: 40, required: true },
  { id: 'q38', pillarId: 'data', templateId: 'temp_001', text: 'Analytics tools used?', type: 'Text', weight: 30, required: false },

  // Growth (5)
  { id: 'q22', pillarId: 'growth', templateId: 'temp_001', text: 'Do you have a clear expansion plan?', type: 'Yes/No', weight: 50, required: true },
  { id: 'q39', pillarId: 'growth', templateId: 'temp_001', text: 'International markets identified?', type: 'Yes/No', weight: 25, required: true },
  { id: 'q40', pillarId: 'growth', templateId: 'temp_001', text: 'Product roadmap for next 12 months?', type: 'Yes/No', weight: 25, required: true },
  { id: 'q41', pillarId: 'growth', templateId: 'temp_001', text: 'Hiring plan for next 12 months?', type: 'Yes/No', weight: 25, required: true },
  { id: 'q42', pillarId: 'growth', templateId: 'temp_001', text: 'Marketing budget allocated?', type: 'Yes/No', weight: 25, required: true },

  // --- Financial Focus Assessment (temp_002) - 8 questions ---
  { id: 'q2_f1', pillarId: 'finance', templateId: 'temp_002', text: 'Do you have audited financials?', type: 'Yes/No', weight: 20, required: true },
  { id: 'q2_f2', pillarId: 'finance', templateId: 'temp_002', text: 'Current Runway (Months)', type: 'Number', weight: 20, required: true },
  { id: 'q2_f3', pillarId: 'finance', templateId: 'temp_002', text: 'Gross Margin %', type: 'Number', weight: 20, required: true },
  { id: 'q2_f4', pillarId: 'finance', templateId: 'temp_002', text: 'EBITDA Margin %', type: 'Number', weight: 20, required: true },
  { id: 'q2_f5', pillarId: 'finance', templateId: 'temp_002', text: 'Do you have a dedicated finance team?', type: 'Yes/No', weight: 20, required: true },
  
  { id: 'q2_b1', pillarId: 'business', templateId: 'temp_002', text: 'Customer Lifetime Value (LTV)', type: 'Number', weight: 35, required: true },
  { id: 'q2_b2', pillarId: 'business', templateId: 'temp_002', text: 'Customer Acquisition Cost (CAC)', type: 'Number', weight: 35, required: true },
  { id: 'q2_b3', pillarId: 'business', templateId: 'temp_002', text: 'LTV/CAC Ratio', type: 'Number', weight: 30, required: true },

  // --- AgriTech Sustainability Standard (temp_agritech_001) ---
  { id: 'qa_t1', pillarId: 'team', templateId: 'temp_agritech_001', text: 'Does your team have agricultural expertise?', type: 'Yes/No', weight: 50, required: true },
  { id: 'qa_b1', pillarId: 'business', templateId: 'temp_agritech_001', text: 'Is your solution sustainable?', type: 'Yes/No', weight: 100, required: true },
  { id: 'qa_o1', pillarId: 'ops', templateId: 'temp_agritech_001', text: 'Do you have a stable supply chain?', type: 'Yes/No', weight: 50, required: true },
  { id: 'qa_o2', pillarId: 'ops', templateId: 'temp_agritech_001', text: 'Do you measure your carbon footprint?', type: 'Yes/No', weight: 50, required: true, helperText: 'Custom ESG metric for AgriTech' }
]
