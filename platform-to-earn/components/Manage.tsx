'use client'
import React from 'react'
import { useState, useEffect, useMemo, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trophy, ExternalLink, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWriteContract, useReadContract, useAccount } from "wagmi"
import { contract } from "@/contract"
import ABI from "@/contract/ABI.json"
import TaskCard from '@/components/TaskCard'

interface Submission {
    user: string
    submissionLink: string
}

interface Task {
    id: number
    creator: string
    tokenGate: string
    rewardToken: string
    details: string
    rewardAmount: string
    submissions: Submission[]
    isClosed: boolean
    winner?: string
    status: "Open" | "Full" | "Closed"
    maxSubmissions: number
}

const Manage = () => {
    const [pickingWinner, setPickingWinner] = useState<number | null>(null)
    const [refreshing, setRefreshing] = useState(false)
    const [taskIds, setTaskIds] = useState<Map<string, string>>(new Map())
    const { address } = useAccount()

    // Read task counter from contract
    const { data: taskCounter, refetch: refetchTaskCounter } = useReadContract({
        address: contract as `0x${string}`,
        abi: ABI,
        functionName: 'taskCounter',
    })

    console.log(taskCounter)

    // Write contract for picking winner
    const { writeContract, isPending: isPickingWinner } = useWriteContract()

    // Generate task IDs map
    const getTaskIds = useCallback(() => {
        try {
            if (!taskCounter) {
                console.log("taskCounter is undefined or null");
                return;
            }

            const newMap = new Map<string, string>();
            if (typeof taskCounter === 'bigint' && taskCounter > 0) {
                for (let i = 0; i < taskCounter; i++) {
                    newMap.set(i.toString(), i.toString()); 
                }
                setTaskIds(new Map(newMap));
            } else {
                console.log("taskCounter isn't valid bigint:", taskCounter);
            }
        } catch (error) {
            console.error("Error setting task IDs:", error);
        }
    }, [taskCounter])

    useEffect(() => {
        getTaskIds()
    }, [taskCounter, getTaskIds])

    // Optimized refresh function
    const handleRefresh = async () => {
        setRefreshing(true)
        await refetchTaskCounter()
        setRefreshing(false)
    }

    // Memoized address formatter
    const formatAddress = useMemo(() => (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }, [])

    // Handle picking winner with real contract call
    const handlePickWinner = async (taskId: number, winnerAddress: string) => {
        setPickingWinner(taskId)

        try {
            await writeContract({
                address: contract as `0x${string}`,
                abi: ABI,
                functionName: 'pickWinner',
                args: [BigInt(taskId), winnerAddress as `0x${string}`],
            })

            // Refresh data after successful transaction
            await refetchTaskCounter()
        } catch (error) {
            console.error('Error picking winner:', error)
        } finally {
            setPickingWinner(null)
        }
    }

    // Memoized date formatter
    const formatDate = useMemo(() => (timestamp: string) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }, [])

    // Memoized status color getter
    const getStatusColor = useMemo(() => (status: string) => {
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
    }, [])

    // Parse task details to extract title and description
    const parseTaskDetails = (details: string) => {
        try {
            const parsed = JSON.parse(details)
            return {
                title: parsed.title || "Untitled Task",
                description: parsed.description || "No description provided"
            }
        } catch {
            return {
                title: "Untitled Task",
                description: details || "No description provided"
            }
        }
    }

    const loading = !taskCounter && taskIds.size === 0

    return (
        <div className="space-y-6">
            {/* Header with refresh button */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Manage Tasks</h2>
                <Button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading tasks from blockchain...</p>
                </div>
            ) : taskIds.size === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">No tasks found on blockchain.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {[...taskIds.entries()].map(([key, value]) => (
                        <TaskCard 
                            key={key} 
                            id={value}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Manage