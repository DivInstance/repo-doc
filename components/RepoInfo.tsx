"use client"

import { Info, Calendar, Code, GitFork, AlertCircle, Globe, Lock } from "lucide-react"

interface RepoInfoProps {
  repoInfo: {
    name: string
    owner: string
    description: string
    created_at: string
    updated_at: string
    pushed_at: string
    language: string
    default_branch: string
    visibility: string
    forks_count: number
    open_issues_count: number
    license: string
    contributors: any[]
  }
}

export default function RepoInfo({ repoInfo }: RepoInfoProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getVisibilityIcon = (visibility: string) => {
    return visibility === "public" ? Globe : Lock
  }

  const getVisibilityColor = (visibility: string) => {
    return visibility === "public" ? "text-green-600 bg-green-100" : "text-yellow-600 bg-yellow-100"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <Info className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">Repository Information</h2>
      </div>

      {/* Repository Overview */}
      <div className="card p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {repoInfo.owner}/{repoInfo.name}
            </h3>
            <p className="text-gray-600 mb-4">{repoInfo.description || "No description available"}</p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {(() => {
                  const VisibilityIcon = getVisibilityIcon(repoInfo.owner)
                  return (
                    <div
                      className={`flex items-center px-2 py-1 rounded-full text-sm font-medium ${getVisibilityColor(repoInfo.visibility)}`}
                    >
                      <VisibilityIcon className="w-4 h-4 mr-1" />
                      {repoInfo.owner}
                    </div>
                  )
                })()}
              </div>
              {repoInfo.language && (
                <div className="flex items-center text-sm text-gray-500">
                  <Code className="w-4 h-4 mr-1" />
                  {repoInfo.language}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <GitFork className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Forks</p>
              <p className="text-2xl font-semibold text-gray-900">{repoInfo.forks_count}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Open Issues</p>
              <p className="text-2xl font-semibold text-gray-900">{repoInfo.open_issues_count}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Code className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Default Branch</p>
              <p className="text-lg font-semibold text-gray-900">{repoInfo.default_branch}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {(() => {
                const VisibilityIcon = getVisibilityIcon(repoInfo.visibility)
                return <VisibilityIcon className="w-8 h-8 text-purple-600" />
              })()}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Visibility</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">{repoInfo.visibility}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Info className="w-5 h-5 mr-2 text-blue-600" />
              Basic Information
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">Repository Name</span>
              <span className="text-sm text-gray-900">{repoInfo.name}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">Owner</span>
              <span className="text-sm text-gray-900">{repoInfo.owner}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">Contributors</span>
              <span className="text-sm text-gray-900">{repoInfo.contributors && repoInfo.contributors.length>0 ? repoInfo.contributors.join(", "): "Not specified"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">Primary Language</span>
              <span className="text-sm text-gray-900">{repoInfo.language || "Not specified"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">License</span>
              <span className="text-sm text-gray-900">{repoInfo.license || "None"}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium text-gray-500">Default Branch</span>
              <span className="text-sm text-gray-900">{repoInfo.default_branch}</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-600" />
              Timeline
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">Created</span>
              <span className="text-sm text-gray-900">{formatDate(repoInfo.created_at)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">Last Updated</span>
              <span className="text-sm text-gray-900">{formatDate(repoInfo.updated_at)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-500">Last Pushed</span>
              <span className="text-sm text-gray-900">{formatDate(repoInfo.pushed_at)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium text-gray-500">Days Since Creation</span>
              <span className="text-sm text-gray-900">
                {Math.floor((new Date().getTime() - new Date(repoInfo.created_at).getTime()) / (1000 * 60 * 60 * 24))}{" "}
                days
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description Card */}
      {repoInfo.description && (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
          <p className="text-gray-600 leading-relaxed">{repoInfo.description}</p>
        </div>
      )}
    </div>
  )
}
