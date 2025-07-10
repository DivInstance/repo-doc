"use client"

import { useState } from "react"
import { GitPullRequest, ExternalLink, X, Filter, User } from "lucide-react"

interface PR {
  title: string
  number: number
  author: string
  created_at: string
  days_active: string
  state: string
  reviewers: string[]
}

interface OpenPRsProps {
  prs: PR[]
  repoInfo: any
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

export default function OpenPRs({ prs, repoInfo }: OpenPRsProps) {
  const [filter, setFilter] = useState("all")

  const filteredPRs = prs.filter((pr) => {
    if (filter === "all") return true
    const days = Number.parseInt(pr.days_active.split(" ")[0])
    return days >= Number.parseInt(filter)
  })

  const handleViewPR = (prNumber: number) => {
    const url = `https://github.com/${repoInfo.owner}/${repoInfo.name}/pull/${prNumber}`
    window.open(url, "_blank")
  }

  const handleClosePR = async (prNumber: number) => {
    if (!confirm(`Are you sure you want to close PR #${prNumber}?`)) {
      return
    }
    // TODO: Implement GitHub API call
    alert(`Close functionality for PR #${prNumber} would be implemented here`)
  }

  const getStateBadgeColor = (state: string) => {
    switch (state.toLowerCase()) {
      case "open":
        return "badge-default"
      case "closed":
        return "badge-destructive"
      case "merged":
        return "badge-secondary"
      default:
        return "badge-outline"
    }
  }

  const getAgeBadgeColor = (daysActive: string) => {
    const days = Number.parseInt(daysActive.split(" ")[0])
    if (days >= 7) return "badge-destructive"
    if (days >= 3) return "badge-secondary"
    return "badge-outline"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <GitPullRequest className="w-6 h-6 text-green-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Open Pull Requests</h2>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All PRs</option>
            <option value="1">1+ days old</option>
            <option value="3">3+ days old</option>
            <option value="7">7+ days old</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <GitPullRequest className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Open PRs</p>
              <p className="text-2xl font-semibold text-gray-900">{prs.length}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-semibold">!</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Stale (7+ days)</p>
              <p className="text-2xl font-semibold text-gray-900">
                {prs.filter((pr) => Number.parseInt(pr.days_active.split(" ")[0]) >= 7).length}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Needs Review</p>
              <p className="text-2xl font-semibold text-gray-900">
                {prs.filter((pr) => pr.reviewers.length > 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  State
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reviewers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPRs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No open pull requests found with the current filter.
                  </td>
                </tr>
              ) : (
                filteredPRs.map((pr, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <GitPullRequest className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900 truncate max-w-xs">{pr.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{pr.number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pr.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(pr.created_at)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${getAgeBadgeColor(pr.days_active)}`}>{pr.days_active}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${getStateBadgeColor(pr.state)}`}>{pr.state}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {pr.reviewers.length === 0 ? (
                          <span className="text-sm text-gray-400">No reviewers</span>
                        ) : (
                          pr.reviewers.slice(0, 2).map((reviewer, idx) => (
                            <span key={idx} className="badge badge-outline text-xs">
                              {reviewer}
                            </span>
                          ))
                        )}
                        {pr.reviewers.length > 2 && (
                          <span className="badge badge-outline text-xs">+{pr.reviewers.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button onClick={() => handleViewPR(pr.number)} className="btn btn-outline btn-sm">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View
                        </button>
                        <button onClick={() => handleClosePR(pr.number)} className="btn btn-destructive btn-sm">
                          <X className="w-4 h-4 mr-1" />
                          Close
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
