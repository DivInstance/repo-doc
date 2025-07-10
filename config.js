// Configuration file
// In a real application, you would load these from environment variables
// For demo purposes, we'll use default values and sessionStorage for the token

const CONFIG = {
  // Default repository info - you can change these
  REPO_OWNER: "DivInstance",
  REPO_NAME: "Health-Wellness-App-Rejected",

  // GitHub API base URL
  GITHUB_API_BASE: "https://api.github.com",

  // Data file path
  DATA_FILE: "data.json",

  // Get GitHub token from sessionStorage
  getGitHubToken: () => {
    return sessionStorage.getItem("github_token") || ""
  },

  // Set GitHub token in sessionStorage
  setGitHubToken: (token) => {
    sessionStorage.setItem("github_token", token)
  },
}

// Initialize token if not present 
if (!CONFIG.getGitHubToken()) {
  // Prompt user for token on first visit
  const token = prompt("Please enter your GitHub Personal Access Token:")
  if (token) {
    CONFIG.setGitHubToken(token)
  }
}
