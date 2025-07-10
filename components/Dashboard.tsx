"use client"

import { useState } from "react"
import { GitBranch, GitPullRequest, Info, BarChart3, Menu, X, RefreshCw } from "lucide-react"
import StaleBranches from "./StaleBranches"
import OpenPRs from "./OpenPRs"
import RepoInfo from "./RepoInfo"
import ActivityChart from "./ActivityChart"

interface DashboardProps {
  data: {
    stale_branches: any[]
    open_prs: any[]
    repo_info: any[]
  }
}

type ActiveSection = "stale-branches" | "open-prs" | "repo-info" | "activity-chart"

export default function Dashboard({ data }: DashboardProps) {
  const [activeSection, setActiveSection] = useState<ActiveSection>("stale-branches")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    {
      id: "stale-branches" as ActiveSection,
      name: "Stale Branches",
      icon: GitBranch,
      count: data.stale_branches.length,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      activeColor: "bg-orange-100 text-orange-700 border-orange-300",
    },
    {
      id: "open-prs" as ActiveSection,
      name: "Open PRs",
      icon: GitPullRequest,
      count: data.open_prs.length,
      color: "text-green-600",
      bgColor: "bg-green-50",
      activeColor: "bg-green-100 text-green-700 border-green-300",
    },
    {
      id: "repo-info" as ActiveSection,
      name: "Repository Info",
      icon: Info,
      count: null,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      activeColor: "bg-blue-100 text-blue-700 border-blue-300",
    },
    {
      id: "activity-chart" as ActiveSection,
      name: "Activity Chart",
      icon: BarChart3,
      count: null,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      activeColor: "bg-purple-100 text-purple-700 border-purple-300",
    },
  ]

  const repoInfo = data.repo_info[0]

  const renderContent = () => {
    switch (activeSection) {
      case "stale-branches":
        return <StaleBranches branches={data.stale_branches} repoInfo={repoInfo} />
      case "open-prs":
        return <OpenPRs prs={data.open_prs} repoInfo={repoInfo} />
      case "repo-info":
        return <RepoInfo repoInfo={repoInfo} />
      case "activity-chart":
        return <ActivityChart data={data} />
      default:
        return <StaleBranches branches={data.stale_branches} repoInfo={repoInfo} />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 to-slate-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold text-white">Repo Doc</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-white text-slate-900 shadow-lg transform scale-[1.02]"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg mr-3 ${isActive ? item.bgColor : "bg-slate-700 group-hover:bg-slate-600"}`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? item.color : "text-slate-300 group-hover:text-white"}`} />
                  </div>
                  <span className="flex-1 text-left">{item.name}</span>
                  {item.count !== null && (
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        isActive
                          ? "bg-slate-100 text-slate-700"
                          : "bg-slate-600 text-slate-200 group-hover:bg-slate-500"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="text-xs text-slate-400 text-center">
            <p>GitHub Repository</p>
            <p className="font-medium text-slate-300">Health Dashboard</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="ml-2 lg:ml-0">
                <h1 className="text-2xl font-bold text-gray-900">
                  {repoInfo ? `${repoInfo.owner}/${repoInfo.name}` : "Repository Health Dashboard"}
                </h1>
                <p className="text-sm text-gray-500 mt-1">Monitor your repository health and analytics</p>
              </div>
            </div>
            <button className="btn btn-primary btn-sm shadow-sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </button>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">{renderContent()}</div>
        </main>
      </div>
    </div>
  )
}
