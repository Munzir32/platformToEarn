"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Coins, Users, Search, Filter } from "lucide-react"
import Link from "next/link"

interface Task {
  id: number
  title: string
  description: string
  tokenGate: string
  tokenSymbol: string
  rewardToken: string
  rewardAmount: string
  submissions: number
  maxSubmissions: number
  status: "Open" | "Full" | "Closed"
  creator: string
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  // Mock data - replace with actual smart contract calls
  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: 0,
        title: "Design a Modern Landing Page",
        description: "Create a responsive landing page for a DeFi protocol with modern UI/UX principles",
        tokenGate: "0x1234...5678",
        tokenSymbol: "$ZORA",
        rewardToken: "0xabcd...efgh",
        rewardAmount: "500",
        submissions: 2,
        maxSubmissions: 3,
        status: "Open",
        creator: "0x9876...5432",
      },
      {
        id: 1,
        title: "Build React Component Library",
        description: "Develop a set of reusable React components with TypeScript and Storybook",
        tokenGate: "0x2345...6789",
        tokenSymbol: "$DEGEN",
        rewardToken: "0xbcde...fghi",
        rewardAmount: "1000",
        submissions: 3,
        maxSubmissions: 3,
        status: "Full",
        creator: "0x8765...4321",
      },
      {
        id: 2,
        title: "Write Technical Documentation",
        description: "Create comprehensive API documentation for a Web3 project",
        tokenGate: "0x3456...7890",
        tokenSymbol: "$USDC",
        rewardToken: "0xcdef...ghij",
        rewardAmount: "250",
        submissions: 1,
        maxSubmissions: 3,
        status: "Open",
        creator: "0x7654...3210",
      },
      {
        id: 3,
        title: "Smart Contract Audit",
        description: "Perform security audit on DeFi smart contracts",
        tokenGate: "0x4567...8901",
        tokenSymbol: "$ARB",
        rewardToken: "0xdefg...hijk",
        rewardAmount: "2000",
        submissions: 0,
        maxSubmissions: 3,
        status: "Open",
        creator: "0x6543...2109",
      },
      {
        id: 4,
        title: "Mobile App UI Design",
        description: "Design mobile app interface for crypto wallet",
        tokenGate: "0x5678...9012",
        tokenSymbol: "$OP",
        rewardToken: "0xefgh...ijkl",
        rewardAmount: "750",
        submissions: 3,
        maxSubmissions: 3,
        status: "Closed",
        creator: "0x5432...1098",
      },
      {
        id: 5,
        title: "Video Tutorial Creation",
        description: "Create educational video about DeFi protocols",
        tokenGate: "0x6789...0123",
        tokenSymbol: "$MATIC",
        rewardToken: "0xfghi...jklm",
        rewardAmount: "400",
        submissions: 1,
        maxSubmissions: 3,
        status: "Open",
        creator: "0x4321...0987",
      },
    ]

    setTimeout(() => {
      setTasks(mockTasks)
      setFilteredTasks(mockTasks)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = tasks

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status.toLowerCase() === statusFilter)
    }

    setFilteredTasks(filtered)
  }, [tasks, searchTerm, statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-800 border-green-200"
      case "Full":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Available Tasks
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse and submit to token-gated tasks. Earn ERC-20 rewards for your contributions.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/60 backdrop-blur-sm border-white/20"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 bg-white/60 backdrop-blur-sm border-white/20">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="full">Full</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300 hover:scale-105"
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg line-clamp-2">{task.title}</CardTitle>
                  <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                </div>
                <CardDescription className="line-clamp-3">{task.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Token Required:</span>
                    <Badge variant="outline" className="font-semibold text-purple-600 border-purple-200">
                      {task.tokenSymbol}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-green-600" />
                      <span className="font-semibold">{task.rewardAmount} tokens</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600">
                        {task.submissions}/{task.maxSubmissions}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(task.submissions / task.maxSubmissions) * 100}%` }}
                    ></div>
                  </div>

                  <Link href={`/task/${task.id}`}>
                    <Button
                      className="w-full"
                      variant={task.status === "Open" ? "default" : "secondary"}
                      disabled={task.status === "Closed"}
                    >
                      {task.status === "Open"
                        ? "View & Submit"
                        : task.status === "Full"
                          ? "View Submissions"
                          : "Task Closed"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No tasks found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
