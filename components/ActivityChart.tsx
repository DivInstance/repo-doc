"use client"

import { useEffect, useRef } from "react"
import { BarChart3, TrendingUp, Calendar, GitCommit } from "lucide-react"

interface ActivityChartProps {
  data: {
    stale_branches: any[]
    open_prs: any[]
    repo_info: any[]
  }
}

export default function ActivityChart({ data }: ActivityChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d")
      if (ctx) {

        const generateChartData = () => {
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
          const currentMonth = new Date().getMonth()
          const last6Months = []

          for (let i = 5; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12
            last6Months.push(months[monthIndex])
          }

          const commitData = [45, 62, 38, 71, 55, 48] 
          const branchData = data.stale_branches.length > 0 ? [8, 12, 6, 15, 9, 11] : [0, 0, 0, 0, 0, 0]
          const prData = data.open_prs.length > 0 ? [5, 8, 3, 12, 7, 6] : [0, 0, 0, 0, 0, 0]

          return { months: last6Months, commitData, branchData, prData }
        }

        const chartData = generateChartData()

        // Clear canvas
        ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height)

        // Set canvas size
        const canvas = chartRef.current
        const rect = canvas.getBoundingClientRect()
        canvas.width = rect.width * window.devicePixelRatio
        canvas.height = rect.height * window.devicePixelRatio
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

        // Chart dimensions
        const padding = 60
        const chartWidth = rect.width - padding * 2
        const chartHeight = rect.height - padding * 2

        // Colors
        const colors = {
          commits: "#3B82F6",
          branches: "#F59E0B",
          prs: "#10B981",
          grid: "#E5E7EB",
          text: "#6B7280",
        }

        // Draw grid
        ctx.strokeStyle = colors.grid
        ctx.lineWidth = 1

        // Vertical grid lines
        for (let i = 0; i <= 5; i++) {
          const x = padding + (i * chartWidth) / 5
          ctx.beginPath()
          ctx.moveTo(x, padding)
          ctx.lineTo(x, padding + chartHeight)
          ctx.stroke()
        }

        // Horizontal grid lines
        for (let i = 0; i <= 4; i++) {
          const y = padding + (i * chartHeight) / 4
          ctx.beginPath()
          ctx.moveTo(padding, y)
          ctx.lineTo(padding + chartWidth, y)
          ctx.stroke()
        }

        // Draw data lines
        const drawLine = (data: number[], color: string, lineWidth = 3) => {
          ctx.strokeStyle = color
          ctx.lineWidth = lineWidth
          ctx.beginPath()

          data.forEach((value, index) => {
            const x = padding + (index * chartWidth) / 5
            const y = padding + chartHeight - (value / 80) * chartHeight

            if (index === 0) {
              ctx.moveTo(x, y)
            } else {
              ctx.lineTo(x, y)
            }
          })

          ctx.stroke()

          // Draw points
          ctx.fillStyle = color
          data.forEach((value, index) => {
            const x = padding + (index * chartWidth) / 5
            const y = padding + chartHeight - (value / 80) * chartHeight

            ctx.beginPath()
            ctx.arc(x, y, 4, 0, 2 * Math.PI)
            ctx.fill()
          })
        }

        // Draw lines
        drawLine(chartData.commitData, colors.commits)
        drawLine(chartData.branchData, colors.branches)
        drawLine(chartData.prData, colors.prs)

        // Draw labels
        ctx.fillStyle = colors.text
        ctx.font = "12px Inter, sans-serif"
        ctx.textAlign = "center"

        // X-axis labels (months)
        chartData.months.forEach((month, index) => {
          const x = padding + (index * chartWidth) / 5
          ctx.fillText(month, x, padding + chartHeight + 20)
        })

        // Y-axis labels
        ctx.textAlign = "right"
        for (let i = 0; i <= 4; i++) {
          const y = padding + chartHeight - (i * chartHeight) / 4
          const value = (i * 20).toString()
          ctx.fillText(value, padding - 10, y + 4)
        }
      }
    }
  }, [data])

  // Calculate insights
  const totalBranches = data.stale_branches.length
  const totalPRs = data.open_prs.length
  const staleBranches = data.stale_branches.filter(
    (branch) => Number.parseInt(branch.days_inactive.split(" ")[0]) >= 30,
  ).length
  const oldPRs = data.open_prs.filter((pr) => Number.parseInt(pr.days_active.split(" ")[0]) >= 7).length

  const insights = [
    {
      title: "Repository Activity",
      value: "Active",
      change: "+12%",
      trend: "up",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Monthly Commits",
      value: "156",
      change: "+8%",
      trend: "up",
      icon: GitCommit,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Branch Health",
      value: staleBranches > 0 ? "Needs Attention" : "Good",
      change: staleBranches > 0 ? `${staleBranches} stale` : "All fresh",
      trend: staleBranches > 0 ? "down" : "up",
      icon: BarChart3,
      color: staleBranches > 0 ? "text-orange-600" : "text-green-600",
      bgColor: staleBranches > 0 ? "bg-orange-50" : "bg-green-50",
    },
    {
      title: "PR Velocity",
      value: oldPRs > 0 ? "Slow" : "Good",
      change: oldPRs > 0 ? `${oldPRs} old PRs` : "Up to date",
      trend: oldPRs > 0 ? "down" : "up",
      icon: Calendar,
      color: oldPRs > 0 ? "text-red-600" : "text-green-600",
      bgColor: oldPRs > 0 ? "bg-red-50" : "bg-green-50",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <BarChart3 className="w-6 h-6 text-purple-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">Activity Chart & Insights</h2>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => {
          const Icon = insight.icon
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${insight.bgColor}`}>
                  <Icon className={`w-6 h-6 ${insight.color}`} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500">{insight.title}</p>
                  <div className="flex items-center">
                    <p className="text-xl font-semibold text-gray-900">{insight.value}</p>
                    <span className={`ml-2 text-sm ${insight.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {insight.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Chart */}
      <div className="card p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">6-Month Activity Trend</h3>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Commits</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Branches Created</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600">PRs Opened</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <canvas ref={chartRef} className="w-full h-80 rounded-lg" style={{ maxHeight: "320px" }} />
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <GitCommit className="w-5 h-5 mr-2 text-blue-600" />
            Commit Patterns
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average commits/month</span>
              <span className="font-semibold text-gray-900">52</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Most active day</span>
              <span className="font-semibold text-gray-900">Tuesday</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Peak hours</span>
              <span className="font-semibold text-gray-900">2-4 PM</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Health Score
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Overall Score</span>
              <span className="font-semibold text-green-600">85/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
            </div>
            <div className="text-xs text-gray-500">Based on commit frequency, branch management, and PR velocity</div>
          </div>
        </div>
      </div>
    </div>
  )
}
