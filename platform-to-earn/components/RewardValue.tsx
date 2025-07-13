"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Coins, TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react'
import { 
  getRewardValue, 
  formatUSDValue, 
  getPriceChangeIndicator, 
  isStablecoin,
  type RewardValue 
} from '@/lib/tokenPricing'

interface RewardValueProps {
  tokenAddress: string
  amount: string
  decimals?: number
  showDetails?: boolean
  className?: string
}

const RewardValue: React.FC<RewardValueProps> = ({ 
  tokenAddress, 
  amount, 
  decimals = 18,
  showDetails = false,
  className = ""
}) => {
  const [rewardData, setRewardData] = useState<RewardValue | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRewardValue = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await getRewardValue(tokenAddress, amount, decimals)
        setRewardData(data)
      } catch (err) {
        console.error('Error fetching reward value:', err)
        setError('Unable to fetch token price')
      } finally {
        setLoading(false)
      }
    }

    if (tokenAddress && amount) {
      // Add debounce to prevent rapid requests
      const timeoutId = setTimeout(() => {
        fetchRewardValue()
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }, [tokenAddress, amount, decimals])

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-12" />
      </div>
    )
  }

  if (error || !rewardData) {
    return (
      <div className={`flex items-center gap-2 text-gray-500 ${className}`}>
        <Coins className="w-4 h-4" />
        <span className="text-sm">
          {error === 'Unable to fetch token price' ? 'Using fallback pricing' : 'Price unavailable'}
        </span>
      </div>
    )
  }

  const { indicator, color } = getPriceChangeIndicator(rewardData.change24h)
  const isStable = isStablecoin(tokenAddress)

  if (!showDetails) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Coins className="w-4 h-4 text-green-600" />
        <span className="font-semibold">{amount} tokens</span>
        <span className="text-sm text-gray-600">
          ({formatUSDValue(rewardData.usdValue)})
        </span>
        {rewardData.change24h !== undefined && !isStable && (
          <Badge variant="outline" className={`text-xs ${color}`}>
            {indicator}
          </Badge>
        )}
      </div>
    )
  }

  return (
    <Card className={`bg-white/60 backdrop-blur-sm border-white/20 ${className}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Main Reward Display */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-lg">{amount} tokens</span>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-gray-900">
                {formatUSDValue(rewardData.usdValue)}
              </div>
              <div className="text-sm text-gray-600">
                @ ${rewardData.price.toFixed(6)}
              </div>
            </div>
          </div>

          {/* Price Change Indicator */}
          {rewardData.change24h !== undefined && !isStable && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">24h Change</span>
              <div className="flex items-center gap-1">
                {rewardData.change24h > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : rewardData.change24h < 0 ? (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                ) : null}
                <Badge variant="outline" className={color}>
                  {indicator}
                </Badge>
              </div>
            </div>
          )}

          {/* Token Info */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Token Address</span>
            <span className="font-mono text-xs">
              {tokenAddress.slice(0, 6)}...{tokenAddress.slice(-4)}
            </span>
          </div>

          {/* Market Context */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-900">Market Context</span>
            </div>
            <div className="text-xs text-gray-600">
              {isStable ? (
                <span>This is a stablecoin reward with minimal price volatility</span>
              ) : rewardData.usdValue > 100 ? (
                <span>High-value reward opportunity</span>
              ) : rewardData.usdValue > 10 ? (
                <span>Moderate reward value</span>
              ) : (
                <span>Small reward amount - consider market conditions</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default RewardValue 