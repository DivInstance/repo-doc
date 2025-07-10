# 🚀 GitHub Repository Health Dashboard

A comprehensive **repository health analytics dashboard** built with Next.js 15 that helps developers and teams monitor GitHub repository health with automated insights, visual analytics, and intelligent alerts.

![Dashboard Preview](https://via.placeholder.com/800x400/1f2937/ffffff?text=GitHub+Repository+Health+Dashboard)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Automation & Scheduling](#-automation--scheduling)
- [Usage](#-usage)
- [API Integration](#-api-integration)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Future Roadmap](#-future-roadmap)
- [Author](#-author)
- [License](#-license)

## 🎯 Overview

The **GitHub Repository Health Dashboard** is an automated analytics platform that provides comprehensive insights into repository health metrics. It tracks stale branches, monitors pull request activity, analyzes commit patterns, and delivers actionable insights through an intuitive web interface.

### Key Benefits

- **🔍 Health Monitoring**: Track repository health with real-time metrics
- **📊 Visual Analytics**: Interactive charts and graphs for data visualization
- **⚡ Automated Alerts**: Email notifications for critical repository issues
- **📱 Responsive Design**: Works seamlessly across all devices
- **🎨 Modern UI**: Clean, professional interface built with Tailwind CSS

## ✨ Features

### 📈 Dashboard Analytics

- **Stale Branch Detection**: Identify branches inactive for 1, 7, or 30+ days
- **Pull Request Management**: View, filter, and manage open PRs
- **Repository Insights**: Display key metrics like forks, stars, issues, and language stats
- **Activity Charts**: Visual representation of commit patterns and repository activity

### 🎛️ Advanced Filtering

- **Date-based Filters**: Filter branches and PRs by activity periods
- **Status Filtering**: Sort by branch status, PR state, and activity levels
- **Search Functionality**: Quick search across branches and pull requests

### 📧 Automated Reporting

- **Email Summaries**: Periodic health reports sent to stakeholders
- **Alert System**: Notifications for stale branches and aging pull requests
- **Custom Scheduling**: Configurable report frequency and recipients

### 🎨 User Experience

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Elements**: Hover effects, smooth transitions, and animations
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Dark/Light Mode**: Theme switching capability (coming soon)

## 🛠️ Tech Stack

### Frontend

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://reactjs.org/)** - UI library with Server & Client Components
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

### Data & Analytics

- **[Chart.js](https://www.chartjs.org/)** - Interactive charts and visualizations
- **JSON Data Source** - Flexible data structure for repository metrics
- **Server Actions** - Next.js server-side data processing

### UI Components

- **Custom Design System** - Consistent component library
- **Responsive Tables** - Mobile-optimized data display
- **Interactive Cards** - Modern card-based layouts
- **Dynamic Badges** - Status indicators and metrics

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/github-health-dashboard.git
   cd github-health-dashboard
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install

   # or

   yarn install
   \`\`\`

3. **Set up data source**
   \`\`\`bash

   # Place your data.json file in the root directory

   cp data.example.json data.json
   \`\`\`

4. **Start development server**
   \`\`\`bash
   npm run dev

   # or

   yarn dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Quick Start Commands

\`\`\`bash

# Development

npm run dev # Start development server
npm run build # Build for production
npm run start # Start production server
npm run lint # Run ESLint
npm run type-check # Run TypeScript checks
\`\`\`

## 📂 Project Structure

\`\`\`
github-health-dashboard/
├── app/ # Next.js App Router
│ ├── globals.css # Global styles and Tailwind imports
│ ├── layout.tsx # Root layout component
│ └── page.tsx # Home page (main dashboard)
├── components/ # React components
│ ├── Dashboard.tsx # Main dashboard container
│ ├── StaleBranches.tsx # Stale branches section
│ ├── OpenPRs.tsx # Pull requests management
│ ├── RepoInfo.tsx # Repository information
│ └── ActivityChart.tsx # Charts and analytics
├── lib/ # Utility functions
│ ├── utils.ts # Helper functions
│ └── types.ts # TypeScript type definitions
├── public/ # Static assets
│ └── images/ # Image assets
├── data.json # Repository data source
├── tailwind.config.js # Tailwind CSS configuration
├── next.config.js # Next.js configuration
├── package.json # Dependencies and scripts
└── README.md # Project documentation
\`\`\`

## ⚙️ Configuration

### Data Structure

The dashboard expects a \`data.json\` file with the following structure:

\`\`\`json
{
"stale_branches": [
{
"branch": "feature/user-auth",
"author": "John Doe",
"date": "2024-11-15",
"message": "Add authentication system",
"days_inactive": "8 days",
"commits": "12 commits"
}
],
"open_prs": [
{
"title": "Fix responsive design issues",
"number": 43,
"author": "jane.smith",
"created_at": "2024-12-03T14:20:00Z",
"days_active": "6 days",
"state": "open",
"reviewers": ["john.doe"]
}
],
"repo_info": [
{
"name": "my-awesome-repo",
"owner": "username",
"description": "Repository description",
"language": "JavaScript",
"visibility": "public",
"forks_count": 15,
"open_issues_count": 3
}
]
}
\`\`\`

### Environment Variables

Create a \`.env.local\` file for configuration:

\`\`\`env

# GitHub Configuration (Required)

GITHUB_TOKEN=your_github_personal_access_token_here
GITHUB_REPOSITORY=username/repository-name

# GitHub API (Optional - for live integration)

GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repository_name

# Email Configuration (Optional - for automated reports)

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
RECIPIENT_EMAIL=recipient@example.com

# Application Settings

NEXT_PUBLIC_APP_URL=http://localhost:3000
DASHBOARD_URL=https://your-dashboard-url.vercel.app

# Database Configuration (Optional - for future use)

DATABASE_URL=postgresql://username:password@localhost:5432/github_health
MONGODB_URI=mongodb://localhost:27017/github-health-dashboard
\`\`\`

**Required Environment Variables:**

- `GITHUB_TOKEN`: Personal Access Token for GitHub API access
- `GITHUB_REPOSITORY`: Repository in format `owner/repo-name`

**Optional Environment Variables:**

- Email settings for automated reports
- Database URLs for persistent storage
- Application URLs for deployment

## 🤖 Automation & Scheduling

### GitHub Actions Workflow

The project includes automated data collection and report generation:

**File:** `.github/workflows/report-scheduling-automation.yml`

**Features:**

- **Daily Reports**: Automatically runs at 9 AM UTC daily
- **Manual Trigger**: Can be triggered manually from GitHub Actions
- **Email Notifications**: Sends health summaries via email
- **Data Updates**: Commits updated health data to repository
- **Failure Alerts**: Notifies on automation failures

**Setup:**

1. Add required secrets to your GitHub repository:

   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
   - `RECIPIENT_EMAIL` (optional, defaults to SMTP_USER)

2. Set repository variables:
   - `DASHBOARD_URL`: Your deployed dashboard URL

### Python Automation Script

**File:** `.github/automation/script.py`

**Capabilities:**

- Fetches live data from GitHub API
- Identifies stale branches and aging PRs
- Generates comprehensive health reports
- Sends email notifications with summaries
- Saves data in JSON format for dashboard

**Manual Execution:**
\`\`\`bash
python .github/automation/script.py
\`\`\`

## 📖 Usage

### Dashboard Navigation

- **Stale Branches**: Monitor inactive branches and take cleanup actions
- **Open PRs**: Track pull request status and review progress
- **Repository Info**: View comprehensive repository statistics
- **Activity Chart**: Analyze commit patterns and development trends

### Filtering Options

- **Time-based Filters**: 1 day, 7 days, 30+ days for branches and PRs
- **Status Filters**: Open, closed, merged states for pull requests
- **Search**: Quick search across all repository data

### Actions Available

- **Compare Branches**: Direct links to GitHub compare views
- **Delete Branches**: Mark branches for cleanup (requires API integration)
- **View PRs**: Open pull requests in GitHub
- **Export Data**: Download reports in CSV format (coming soon)

## 🔌 API Integration

### GitHub API Setup (Optional)

For live data integration, configure GitHub API access:

\`\`\`javascript
// lib/github.ts
export async function fetchRepositoryData(owner: string, repo: string) {
const response = await fetch(\`https://api.github.com/repos/\${owner}/\${repo}\`, {
headers: {
'Authorization': \`token \${process.env.GITHUB_TOKEN}\`,
'Accept': 'application/vnd.github.v3+json'
}
});

return response.json();
}
\`\`\`

### Email Integration (Optional)

Set up automated email reports:

\`\`\`javascript
// lib/email.ts
import nodemailer from 'nodemailer';

export async function sendHealthReport(data: RepositoryData) {
const transporter = nodemailer.createTransporter({
host: process.env.SMTP_HOST,
port: parseInt(process.env.SMTP_PORT || '587'),
auth: {
user: process.env.SMTP_USER,
pass: process.env.SMTP_PASS
}
});

// Email logic here
}
\`\`\`

## 🚀 Deployment

### Vercel

\`\`\`bash

# Install Vercel CLI

npm i -g vercel

# Deploy to Vercel

vercel --prod
\`\`\`

### Manual Deployment

\`\`\`bash

# Build the application

npm run build

# Start production server

npm start
\`\`\`

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: \`git checkout -b feature/amazing-feature\`
3. **Commit changes**: \`git commit -m 'Add amazing feature'\`
4. **Push to branch**: \`git push origin feature/amazing-feature\`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 🗺️ Future Roadmap

### Phase 1: Core Enhancements

- [ ] **Database Integration** - PostgreSQL/MongoDB for data persistence
- [ ] **User Authentication** - Login system with personalized dashboards
- [ ] **Real-time Updates** - WebSocket integration for live data

### Phase 2: Advanced Features

- [ ] **CI/CD Metrics** - Integration with GitHub Actions and deployment pipelines
- [ ] **Team Collaboration** - Multi-user support with role-based access
- [ ] **Custom Alerts** - Configurable notification rules and thresholds

### Phase 3: Enterprise Features

- [ ] **Multi-Repository Support** - Dashboard for multiple repositories
- [ ] **White-label Solution** - Customizable branding and themes
- [ ] **Enterprise SSO** - SAML/OIDC integration for enterprise users

## 🧑‍💻 Author

**Divyaranjan Sahoo**  
CSE Student & Cybersecurity Enthusiast

🌐 **Links:**

- [Portfolio](https://divyaranjansahoo.vercel.app/)
- [GitHub](https://github.com/DivInstance)
- [LinkedIn](https://linkedin.com/in/divyaranjansahoo)

📧 **Contact:** divyaranjan20175@gmail.com

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js Team** for the amazing React framework
- **Tailwind CSS** for the utility-first CSS framework
- **Chart.js** for beautiful data visualizations
- **GitHub** for providing the inspiration and API
- **Open Source Community** for continuous inspiration and support

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

[Report Bug](https://github.com/yourusername/github-health-dashboard/issues) • [Request Feature](https://github.com/yourusername/github-health-dashboard/issues) • [Documentation](https://github.com/yourusername/github-health-dashboard/wiki)

</div>
