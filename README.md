# 🚀 GitHub Repository Health Dashboard

A comprehensive **repository health analytics dashboard** built with Next.js 15 that helps developers and teams monitor GitHub repository health with automated insights, visual analytics, and intelligent alerts.

[![Dashboard Preview](./assets/preview.png)](https://repo-doc.onrender.com/)

###### Live Demo

Experience the fully deployed **Repo Doc Dashboard**, a sample project dashboard showcasing metrics, reports, and insights from the project. 
📈 [Open Dashboard](https://repo-doc.onrender.com/)



## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [Configuration](#-configuration)
- [Automation & Scheduling](#-automation--scheduling)
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


## 🛠️ Tech Stack

### Frontend

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://reactjs.org/)** - UI library with Server & Client Components
- **[FastAPI](https://fastapi.tiangolo.com/)** - API crafting Web framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

### Data & Analytics

- **[Chart.js](https://www.chartjs.org/)** - Interactive charts and visualizations
- **JSON Data Source** - Flexible data structure for repository metrics
- **Server Actions** - Next.js server-side data processing


## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/DivInstance/github-health-dashboard.git
   cd github-health-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   ##### or

   ```bash
   yarn install
   ```

3. **Run python script file**
   From the root project directory 
   
   ```bash
   python .github/automation/script.py
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Run Fastapi App**
   
   ```bash
   uvicorn app:app --reload 
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Quick Start Commands

```bash
# Development
npm run dev # Start development server
npm run build # Build for production
npm run start # Start production server
npm run lint # Run ESLint
npm run typecheck # Run TypeScript checks
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file for configuration:

```env

# GitHub Configuration (Required)

GITHUB_TOKEN=your_github_personal_access_token_here  #Personal Access Token for GitHub API access
GITHUB_REPOSITORY=username/repository-name           #Repository to monitor in format `owner/repo-name`
```

## 🤖 Automation & Scheduling

### GitHub Actions Workflow

The project includes automated data collection and report generation:

**File:** `.github/workflows/report-scheduling-automation.yml`

**Features:**

- [x] **Daily Reports**: Automatically runs at 9 AM UTC daily
- [x] **Manual Trigger**: Can be triggered manually from GitHub Actions
- [ ] **Email Notifications**: Sends health summaries via email
- [ ] **Data Updates**: Commits updated health data to repository
- [ ] **Failure Alerts**: Notifies on automation failures

### Python Automation Script

**File:** `.github/automation/script.py`

**Capabilities:**

- Fetches live data from GitHub API
- Identifies stale branches and aging PRs
- Generates comprehensive health reports
- Sends email notifications with summaries
- Saves data in JSON format for dashboard

**Manual Execution:**

```bash
python .github/automation/script.py
```


## 🚀 Deployment

### Vercel

```bash

# Install Vercel CLI

npm i -g vercel

# Deploy to Vercel

vercel --prod
```

### Manual Deployment

```bash

# Build the application

npm run build

# Start production server

npm start
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**


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


<!--### 📧 Automated Reporting

- **Email Summaries**: Periodic health reports sent to stakeholders
- **Alert System**: Notifications for stale branches and aging pull requests
- **Custom Scheduling**: Configurable report frequency and recipients

### 🎨 User Experience

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Elements**: Hover effects, smooth transitions, and animations
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Dark/Light Mode**: Theme switching capability (coming soon)


### GitHub API (Optional - for live integration)
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repository_name
```

### Email Configuration (Optional - for automated reports)

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
RECIPIENT_EMAIL=recipient@example.com

### Application Settings

NEXT_PUBLIC_APP_URL=http://localhost:3000
DASHBOARD_URL=https://your-dashboard-url.vercel.app

### Database Configuration (Optional - for future use)

DATABASE_URL=postgresql://username:password@localhost:5432/github_health
MONGODB_URI=mongodb://localhost:27017/github-health-dashboard
-->