// Declare CONFIG variable before using it
const CONFIG = {
  DATA_FILE: "data.json",
  GITHUB_API_BASE: "https://api.github.com",
  getGitHubToken: () => localStorage.getItem("githubToken"),
}

class GitHubHealthDashboard {
  constructor() {
    this.data = null
    this.filteredData = {
      staleBranches: [],
      openPRs: [],
    }

    this.init()
  }

  async init() {
    this.setupEventListeners()
    await this.loadData()
    this.hideLoading()
  }

  setupEventListeners() {
    // Navigation
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        this.switchSection(link.dataset.section)
      })
    })

    // Mobile menu
    const mobileMenuBtn = document.getElementById("mobile-menu-btn")
    const sidebar = document.getElementById("sidebar")
    const sidebarToggle = document.getElementById("sidebar-toggle")

    mobileMenuBtn?.addEventListener("click", () => {
      sidebar.classList.toggle("open")
    })

    sidebarToggle?.addEventListener("click", () => {
      sidebar.classList.remove("open")
    })

    // Filters
    document.getElementById("branch-filter")?.addEventListener("change", (e) => {
      this.filterBranches(e.target.value)
    })

    document.getElementById("pr-filter")?.addEventListener("change", (e) => {
      this.filterPRs(e.target.value)
    })

    // Refresh button
    document.getElementById("refresh-btn")?.addEventListener("click", () => {
      this.refreshData()
    })

    // Close sidebar when clicking outside on mobile
    document.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
          sidebar.classList.remove("open")
        }
      }
    })
  }

  async loadData() {
    try {
      const response = await fetch(CONFIG.DATA_FILE)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      this.data = await response.json()
      this.filteredData.staleBranches = [...this.data.stale_branches]
      this.filteredData.openPRs = [...this.data.open_prs]

      this.updateUI()
      this.showToast("Data loaded successfully!", "success")
    } catch (error) {
      console.error("Error loading data:", error)
      this.showToast("Error loading data. Please check the data.json file.", "error")
    }
  }

  async refreshData() {
    this.showLoading()
    await this.loadData()
    this.hideLoading()
  }

  updateUI() {
    this.updateCounts()
    this.updateRepoTitle()
    this.renderStaleBranches()
    this.renderOpenPRs()
    this.renderRepoInfo()
  }

  updateCounts() {
    const staleCount = document.getElementById("stale-count")
    const prCount = document.getElementById("pr-count")

    if (staleCount) staleCount.textContent = this.data.stale_branches.length
    if (prCount) prCount.textContent = this.data.open_prs.length
  }

  updateRepoTitle() {
    const repoTitle = document.getElementById("repo-title")
    if (repoTitle && this.data.repo_info.length > 0) {
      const repo = this.data.repo_info[0]
      repoTitle.textContent = `${repo.owner}/${repo.name}`
    }
  }

  switchSection(sectionId) {
    // Update navigation
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active")
    })
    document.querySelector(`[data-section="${sectionId}"]`).classList.add("active")

    // Update content sections
    document.querySelectorAll(".content-section").forEach((section) => {
      section.classList.remove("active")
    })
    document.getElementById(`${sectionId}-section`).classList.add("active")

    // Close mobile sidebar
    if (window.innerWidth <= 768) {
      document.getElementById("sidebar").classList.remove("open")
    }
  }

  filterBranches(filterValue) {
    if (filterValue === "all") {
      this.filteredData.staleBranches = [...this.data.stale_branches]
    } else {
      const days = Number.parseInt(filterValue)
      this.filteredData.staleBranches = this.data.stale_branches.filter((branch) => {
        const daysInactive = Number.parseInt(branch.days_inactive.split(" ")[0])
        return daysInactive >= days
      })
    }
    this.renderStaleBranches()
  }

  filterPRs(filterValue) {
    if (filterValue === "all") {
      this.filteredData.openPRs = [...this.data.open_prs]
    } else {
      const days = Number.parseInt(filterValue)
      this.filteredData.openPRs = this.data.open_prs.filter((pr) => {
        const createdDate = new Date(pr.created_at)
        const now = new Date()
        const daysDiff = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24))
        return daysDiff >= days
      })
    }
    this.renderOpenPRs()
  }

  renderStaleBranches() {
    const tbody = document.getElementById("branches-tbody")
    if (!tbody) return

    if (this.filteredData.staleBranches.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-muted">No stale branches found</td>
        </tr>
      `
      return
    }

    tbody.innerHTML = this.filteredData.staleBranches
      .map(
        (branch) => `
      <tr>
        <td>
          <strong>${branch.branch}</strong>
        </td>
        <td>${branch.author}</td>
        <td>${this.formatDate(branch.date)}</td>
        <td class="text-muted">${branch.message}</td>
        <td>
          <span class="badge badge-warning">${branch.days_inactive}</span>
        </td>
        <td>${branch.commits}</td>
        <td>
          <div class="d-flex gap-1">
            <button class="btn btn-sm btn-outline" onclick="dashboard.compareBranch('${branch.branch}')">
              <i class="fas fa-code-compare"></i> Compare
            </button>
            <button class="btn btn-sm btn-danger" onclick="dashboard.deleteBranch('${branch.branch}')">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </td>
      </tr>
    `,
      )
      .join("")
  }

  renderOpenPRs() {
    const tbody = document.getElementById("prs-tbody")
    if (!tbody) return

    if (this.filteredData.openPRs.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-muted">No open pull requests found</td>
        </tr>
      `
      return
    }

    tbody.innerHTML = this.filteredData.openPRs
      .map(
        (pr) => `
      <tr>
        <td>
          <strong>${pr.title}</strong>
        </td>
        <td>#${pr.number}</td>
        <td>${pr.author}</td>
        <td>${this.formatDate(pr.created_at)}</td>
        <td>
          <span class="badge badge-info">${pr.days_active}</span>
        </td>
        <td>
          <span class="badge badge-${pr.state === "open" ? "success" : "danger"}">${pr.state}</span>
        </td>
        <td>
          <div class="d-flex gap-1">
            <button class="btn btn-sm btn-outline" onclick="dashboard.viewPR(${pr.number})">
              <i class="fas fa-eye"></i> View
            </button>
            <button class="btn btn-sm btn-danger" onclick="dashboard.closePR(${pr.number})">
              <i class="fas fa-times"></i> Close
            </button>
          </div>
        </td>
      </tr>
    `,
      )
      .join("")
  }

  renderRepoInfo() {
    const container = document.getElementById("repo-info-grid")
    if (!container || !this.data.repo_info.length) return

    const repo = this.data.repo_info[0]

    container.innerHTML = `
      <div class="info-card">
        <h3><i class="fas fa-info-circle"></i> Basic Information</h3>
        <div class="info-item">
          <span class="info-label">Repository Name</span>
          <span class="info-value">${repo.name}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Owner</span>
          <span class="info-value">${repo.owner}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Description</span>
          <span class="info-value">${repo.description || "No description"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Visibility</span>
          <span class="info-value">
            <span class="badge badge-${repo.visibility === "public" ? "success" : "warning"}">
              ${repo.visibility}
            </span>
          </span>
        </div>
      </div>

      <div class="info-card">
        <h3><i class="fas fa-code"></i> Technical Details</h3>
        <div class="info-item">
          <span class="info-label">Primary Language</span>
          <span class="info-value">${repo.language || "Not specified"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Default Branch</span>
          <span class="info-value">${repo.default_branch}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Forks</span>
          <span class="info-value">${repo.forks_count}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Open Issues</span>
          <span class="info-value">${repo.open_issues_count}</span>
        </div>
      </div>

      <div class="info-card">
        <h3><i class="fas fa-calendar"></i> Timeline</h3>
        <div class="info-item">
          <span class="info-label">Created</span>
          <span class="info-value">${this.formatDate(repo.created_at)}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Last Updated</span>
          <span class="info-value">${this.formatDate(repo.updated_at)}</span>
        </div>
      </div>
    `
  }

  // Action methods
  compareBranch(branchName) {
    const repo = this.data.repo_info[0]
    const url = `https://github.com/${repo.owner}/${repo.name}/compare/${repo.default_branch}...${branchName}`
    window.open(url, "_blank")
    this.showToast(`Opening compare view for branch: ${branchName}`, "info")
  }

  async deleteBranch(branchName) {
    if (!confirm(`Are you sure you want to delete branch "${branchName}"?`)) {
      return
    }

    const token = CONFIG.getGitHubToken()
    if (!token) {
      this.showToast("GitHub token not found. Please set your token.", "error")
      return
    }

    try {
      const repo = this.data.repo_info[0]
      const response = await fetch(
        `${CONFIG.GITHUB_API_BASE}/repos/${repo.owner}/${repo.name}/git/refs/heads/${branchName}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        },
      )

      if (response.ok) {
        this.showToast(`Branch "${branchName}" deleted successfully!`, "success")
        // Remove from local data
        this.data.stale_branches = this.data.stale_branches.filter((b) => b.branch !== branchName)
        this.filteredData.staleBranches = this.filteredData.staleBranches.filter((b) => b.branch !== branchName)
        this.renderStaleBranches()
        this.updateCounts()
      } else {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error("Error deleting branch:", error)
      this.showToast(`Error deleting branch: ${error.message}`, "error")
    }
  }

  viewPR(prNumber) {
    const repo = this.data.repo_info[0]
    const url = `https://github.com/${repo.owner}/${repo.name}/pull/${prNumber}`
    window.open(url, "_blank")
    this.showToast(`Opening PR #${prNumber}`, "info")
  }

  async closePR(prNumber) {
    if (!confirm(`Are you sure you want to close PR #${prNumber}?`)) {
      return
    }

    const token = CONFIG.getGitHubToken()
    if (!token) {
      this.showToast("GitHub token not found. Please set your token.", "error")
      return
    }

    try {
      const repo = this.data.repo_info[0]
      const response = await fetch(`${CONFIG.GITHUB_API_BASE}/repos/${repo.owner}/${repo.name}/pulls/${prNumber}`, {
        method: "PATCH",
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state: "closed" }),
      })

      if (response.ok) {
        this.showToast(`PR #${prNumber} closed successfully!`, "success")
        // Update local data
        const prIndex = this.data.open_prs.findIndex((pr) => pr.number === prNumber)
        if (prIndex !== -1) {
          this.data.open_prs[prIndex].state = "closed"
        }
        this.renderOpenPRs()
        this.updateCounts()
      } else {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error("Error closing PR:", error)
      this.showToast(`Error closing PR: ${error.message}`, "error")
    }
  }

  // Utility methods
  formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  showToast(message, type = "info") {
    const container = document.getElementById("toast-container")
    const toast = document.createElement("div")
    toast.className = `toast ${type}`

    const icon = type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : "info-circle"

    toast.innerHTML = `
      <i class="fas fa-${icon}"></i>
      <span>${message}</span>
    `

    container.appendChild(toast)

    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.remove()
    }, 5000)
  }

  showLoading() {
    document.getElementById("loading-overlay").classList.remove("hidden")
  }

  hideLoading() {
    document.getElementById("loading-overlay").classList.add("hidden")
  }
}

// Initialize the dashboard
const dashboard = new GitHubHealthDashboard()

// Make dashboard globally available for onclick handlers
window.dashboard = dashboard
