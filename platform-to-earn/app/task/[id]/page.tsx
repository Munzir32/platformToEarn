"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Coins, Users, ExternalLink, Wallet, CheckCircle, AlertCircle, Clock } from "lucide-react"
import Link from "next/link"

interface Task {
  id: number
  title: string
  description: string
  tokenGate: string
  tokenSymbol: string
  rewardToken: string
  rewardAmount: string
  submissions: Submission[]
  maxSubmissions: number
  status: "Open" | "Full" | "Closed"
  creator: string
  winner?: string
}

interface Submission {
  user: string
  submissionLink: string
  timestamp: string
}

export default function TaskDetailPage() {
  const params = useParams()
  const taskId = params.id as string

  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [submissionLink, setSubmissionLink] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [hasRequiredToken, setHasRequiredToken] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  // Mock data - replace with actual smart contract calls
  useEffect(() => {
    const mockTask: Task = {
      id: Number.parseInt(taskId),
      title: "Design a Modern Landing Page",
      description:
        "Create a responsive landing page for a DeFi protocol with modern UI/UX principles. The design should include a hero section, features overview, tokenomics section, and footer. Use modern design trends like glassmorphism, gradients, and clean typography. Deliverable should be a Figma file or live website.",
      tokenGate: "0x1234567890abcdef1234567890abcdef12345678",
      tokenSymbol: "$ZORA",
      rewardToken: "0xabcdefghijklmnopqrstuvwxyz1234567890abcdef",
      rewardAmount: "500",
      submissions: [
        {
          user: "0x1111111111111111111111111111111111111111",
          submissionLink: "https://figma.com/design/example1",
          timestamp: "2024-01-15T10:30:00Z",
        },
        {
          user: "0x2222222222222222222222222222222222222222",
          submissionLink: "https://github.com/user/landing-page",
          timestamp: "2024-01-16T14:20:00Z",
        },
      ],
      maxSubmissions: 3,
      status: "Open",
      creator: "0x9876543210fedcba9876543210fedcba98765432",
    }

    setTimeout(() => {
      setTask(mockTask)
      setLoading(false)
      // Mock wallet connection and token check
      setWalletConnected(true)
      setHasRequiredToken(true)
    }, 1000)
  }, [taskId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!submissionLink.trim()) return

    setSubmitting(true)

    // Mock submission - replace with actual smart contract call
    setTimeout(() => {
      setHasSubmitted(true)
      setSubmitting(false)
      // Update task submissions
      if (task) {
        const newSubmission: Submission = {
          user: "0x3333333333333333333333333333333333333333",
          submissionLink,
          timestamp: new Date().toISOString(),
        }
        setTask({
          ...task,
          submissions: [...task.submissions, newSubmission],
        })
      }
    }, 2000)
  }

  const connectWallet = () => {
    // Mock wallet connection
    setWalletConnected(true)
    setHasRequiredToken(true)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading task details...</p>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Task Not Found</h1>
          <p className="text-gray-600 mb-6">The task you're looking for doesn't exist.</p>
          <Link href="/tasks">
            <Button>Back to Tasks</Button>
          </Link>
        </div>
      </div>
    )
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/tasks" className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6">
            ← Back to Tasks
          </Link>

          {/* Task Header */}
          <Card className="bg-white/60 backdrop-blur-sm border-white/20 mb-8">
            <CardHeader>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{task.title}</CardTitle>
                  <CardDescription className="text-base">Created by {formatAddress(task.creator)}</CardDescription>
                </div>
                <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-semibold text-purple-600 border-purple-200">
                    {task.tokenSymbol}
                  </Badge>
                  <span className="text-sm text-gray-600">Required</span>
                </div>

                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-green-600" />
                  <span className="font-semibold">{task.rewardAmount} tokens</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">
                    {task.submissions.length}/{task.maxSubmissions} submissions
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{task.description}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Submission Form */}
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  Submit Your Work
                </CardTitle>
                <CardDescription>Submit your work to compete for the reward</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!walletConnected ? (
                  <div className="text-center py-8">
                    <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Connect your wallet to submit</p>
                    <Button onClick={connectWallet} className="bg-gradient-to-r from-purple-600 to-blue-600">
                      Connect Wallet
                    </Button>
                  </div>
                ) : !hasRequiredToken ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      You need to hold {task.tokenSymbol} tokens to submit to this task.
                    </AlertDescription>
                  </Alert>
                ) : hasSubmitted ? (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>Your submission has been recorded successfully!</AlertDescription>
                  </Alert>
                ) : task.status === "Closed" ? (
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>This task is closed. No more submissions are accepted.</AlertDescription>
                  </Alert>
                ) : task.submissions.length >= task.maxSubmissions ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>This task has reached the maximum number of submissions.</AlertDescription>
                  </Alert>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="submissionLink">Submission Link</Label>
                      <Input
                        id="submissionLink"
                        type="url"
                        placeholder="https://figma.com/design/... or https://github.com/..."
                        value={submissionLink}
                        onChange={(e) => setSubmissionLink(e.target.value)}
                        required
                        className="mt-1"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Provide a link to your work (Figma, GitHub, live site, etc.)
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                      disabled={submitting || !submissionLink.trim()}
                    >
                      {submitting ? "Submitting..." : "Submit Work"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Submissions List */}
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Submissions ({task.submissions.length})
                </CardTitle>
                <CardDescription>Current submissions for this task</CardDescription>
              </CardHeader>
              <CardContent>
                {task.submissions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No submissions yet. Be the first to submit!</div>
                ) : (
                  <div className="space-y-4">
                    {task.submissions.map((submission, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white/40">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-mono text-sm text-gray-600">{formatAddress(submission.user)}</span>
                          <span className="text-xs text-gray-500">{formatDate(submission.timestamp)}</span>
                        </div>
                        <a
                          href={submission.submissionLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-1"
                        >
                          View Submission
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
