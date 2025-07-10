"use client"

import { useState } from "react"
import { GitBranch, ExternalLink, Trash2, Filter } from "lucide-react"

interface Branch {
  branch: string
  author: string
  date: string
  message: string
  days_inactive: string
  last_commit: number
  commits: string
}

interface StaleBranchesProps {
  branches: Branch[]
  repoInfo: any
}

export default function StaleBranches({ branches, repoInfo }: StaleBranchesProps) {
  const [filter, setFilter] = useState("all")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  const filteredBranches = branches.filter((branch) => {
    if (filter === "all") return true
    const days = Number.parseInt(branch.days_inactive.split(" ")[0])
    return days >= Number.parseInt(filter)
  })

  const handleCompare = (branchName: string) => {
    const url = `https://github.com/${repoInfo.owner}/${repoInfo.name}/compare/${repoInfo.default_branch}...${branchName}`
    window.open(url, "_blank")
  }

  const handleDelete = async (branchName: string) => {
    if (!confirm(`Are you sure you want to delete branch "${branchName}"?`)) {
      return
    }
    // TODO: Implement GitHub API call
    alert(`Delete functionality for branch "${branchName}" would be implemented here`)
  }

  const getBadgeColor = (daysInactive: string) => {
    const days = Number.parseInt(daysInactive.split(" ")[0])
    if (days >= 30) return "badge-destructive"
    if (days >= 7) return "badge-secondary"
    return "badge-outline"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <GitBranch className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Stale Branches</h2>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All branches</option>
            <option value="1">1+ days inactive</option>
            <option value="7">7+ days inactive</option>
            <option value="30">30+ days inactive</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <GitBranch className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Stale Branches</p>
              <p className="text-2xl font-semibold text-gray-900">{branches.length}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-semibold">!</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Critical (30+ days)</p>
              <p className="text-2xl font-semibold text-gray-900">
                {branches.filter((b) => Number.parseInt(b.days_inactive.split(" ")[0]) >= 30).length}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold">✓</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Recently Active</p>
              <p className="text-2xl font-semibold text-gray-900">
                {branches.filter((b) => Number.parseInt(b.days_inactive.split(" ")[0]) < 7).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="overflow-hidden">
          <div className="hidden lg:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Branch
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Commit
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inactive
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBranches.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                      No stale branches found with the current filter.
                    </td>
                  </tr>
                ) : (
                  filteredBranches.map((branch, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <GitBranch className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                            {branch.branch}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 max-w-[100px] truncate">{branch.author}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(branch.date)}</td>
                      <td className="px-4 py-4 text-sm text-gray-500 max-w-[200px] truncate">{branch.message}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`badge ${getBadgeColor(branch.days_inactive)}`}>{branch.days_inactive}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleCompare(branch.branch)}
                            className="btn btn-outline btn-sm text-xs"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Compare
                          </button>
                          <button
                            onClick={() => handleDelete(branch.branch)}
                            className="btn btn-destructive btn-sm text-xs"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4 p-4">
            {filteredBranches.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No stale branches found with the current filter.</div>
            ) : (
              filteredBranches.map((branch, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <GitBranch className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{branch.branch}</span>
                    </div>
                    <span className={`badge ${getBadgeColor(branch.days_inactive)}`}>{branch.days_inactive}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>
                      <span className="font-medium">Author:</span> {branch.author}
                    </p>
                    <p>
                      <span className="font-medium">Last Commit:</span> {formatDate(branch.date)}
                    </p>
                    <p>
                      <span className="font-medium">Message:</span> {branch.message}
                    </p>
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <button onClick={() => handleCompare(branch.branch)} className="btn btn-outline btn-sm flex-1">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Compare
                    </button>
                    <button onClick={() => handleDelete(branch.branch)} className="btn btn-destructive btn-sm flex-1">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
