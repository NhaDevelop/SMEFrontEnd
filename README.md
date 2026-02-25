# Investment Readiness Intelligence Platform (IRIP)

IRIP is a comprehensive, data-driven platform designed to bridge the gap between Small and Medium Enterprises (SMEs) and Investors. It provides a structured 8-pillar assessment framework that helps SMEs measure, track, and improve their investment readiness while offering investors a reliable source of pre-qualified deal flow.

![Dashboard Preview](assets/dashboard-preview.png)

## 🚀 Key Features

### 🏢 For SMEs & Founders

**Goal:** Assess readiness, identify gaps, and showcase potential to investors.

- **Comprehensive Assessment:** Detailed evaluation across 8 critical pillars:
  1. Team & Leadership
  2. Business Model
  3. Market & Traction
  4. Financial Readiness
  5. Operations
  6. Legal & Governance
  7. Data & Digital Maturity
  8. Growth & Scalability
- **Readiness Dashboard:** Real-time scoring (0-100), spider charts for visualization, and risk analysis.
- **Actionable Insights:** AI-driven recommendations to improve pillar scores.
- **Goal Tracking:** Set and monitor specific business goals linked to readiness improvements.
- **What-If Analysis:** Simulate how specific improvements (e.g., "Hiring a CFO") would impact overall readiness scores.

### 💼 For Investors & Funds

**Goal:** Efficiently discover, filter, and monitor high-potential investment opportunities.

- **Pre-Qualified Deal Flow:** Access a curated marketplace of SMEs that have completed the rigorous assessment.
- **Smart Filtering:** Advanced filters for **Sector**, **Readiness Score**, **Risk Level**, and **Growth Potential**.
- **Risk Visibility Matrix:** Visual scatter plot to balance risk vs. growth potential across a portfolio.
- **Portfolio Tracking:** Monitor aggregate stats (Avg Score, Active Goals, Readiness Distribution).
- **In-Depth Reports:** Generate comprehensive PDF/CSV reports on any SME for due diligence.

### 🛠 For Program Administrators

**Goal:** Manage assessment frameworks, user access, and accelerator cohorts.

- **Program Management:** Create and manage cohorts (e.g., "Investment Accelerator 2024").
- **Assessment Framework Control:** Customize questions, weightings, and scoring logic templates.
- **User Management:** Approve and manage SME and Investor access.
- **Platform Analytics:** Monitor platform-wide adoption and completion rates.

## 🛠 Tech Stack

- **Framework:** [Nuxt 3](https://nuxt.com/) (Vue 3)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [Pinia](https://pinia.vuejs.org/)
- **Icons:** [Heroicons](https://heroicons.com/)
- **Charts:** Chart.js / Vue-Chartjs
- **API Handling:** Nuxt Server Routes (perfect for serverless deployment)

## 📂 Project Structure

```bash
SMEFrontend/
├── assets/             # Static assets (images, fonts)
├── components/         # Reusable Vue components
│   ├── admin/          # Admin-specific components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Shared dashboard widgets
│   ├── investor/       # Investor-specific components
│   └── sme/            # SME-specific components
├── layouts/            # Layout wrappers (Default, Admin, Investor)
├── pages/              # Application Routes
│   ├── index.vue       # Public Landing Page
│   ├── admin/          # Admin Dashboard & Management
│   ├── assessment/     # The Core Assessment Tool
│   ├── investor/       # Investor Portal
│   └── sme/            # SME Dashboard & Tools
├── public/             # Publicly accessible files
├── server/             # API Routes & Backend Logic
│   └── api/            # REST API endpoints
├── stores/             # Pinia State Stores
└── utils/              # Helper functions & Constants
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-org/irip-frontend.git
   cd irip-frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` to see the app running.

## 📚 User Guide

### Logging In

The platform features a **Role Selection Modal** on the landing page for easy access to different user flows:

- **SME User:** Access the readiness assessment and improvement tools.
- **Investor:** Access deal flow and portfolio management.
- **Admin:** Access platform configuration and user management.

### Taking an Assessment (SME)

1. Go to **Assessment** from the sidebar.
2. Complete questions across all 8 pillars.
3. Submit to see your **Standardized Score**.
4. Use the **My Goals** section to plan improvements.

### Interpreting Scores

- **80-100 (Investment Ready):** High potential, low risk. Ready for due diligence.
- **60-79 (Near Ready):** Strong fundamentals but specific gaps need addressing.
- **40-59 (Developing):** Early stage or missing key operational structures.
- **<40 (Early Stage):** Focus on product-market fit and core team building.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

_Built with ❤️ for the SME ecosystem._
