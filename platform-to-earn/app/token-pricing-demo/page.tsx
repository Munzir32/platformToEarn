"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Coins, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import Link from 'next/link'
import RewardValue from '@/components/RewardValue'
import { getTokenPrices, formatUSDValue, getPriceChangeIndicator } from '@/lib/tokenPricing'

const sampleTokens = [
  {
    name: "USDT",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    amount: "1000000000", // 1000 USDT (6 decimals)
    decimals: 6,
    description: "Tether USD - Stablecoin"
  },
  {
    name: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    amount: "1000000000", // 1000 USDC (6 decimals)
    decimals: 6,
    description: "USD Coin - Stablecoin"
  },
  {
    name: "WETH",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    amount: "1000000000000000000", // 1 WETH (18 decimals)
    decimals: 18,
    description: "Wrapped Ether"
  },
  {
    name: "UNI",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    amount: "100000000000000000000", // 100 UNI (18 decimals)
    decimals: 18,
    description: "Uniswap Token"
  }
]

export default function TokenPricingDemoPage() {
  const [customToken, setCustomToken] = useState({
    address: "",
    amount: "",
    decimals: 18
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Real-Time Token Pricing Demo
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience real-time token pricing powered by Nodit API. See USD values, price changes, and market context for any ERC-20 token.
          </p>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This demo uses the Nodit demo API key which has rate limits. 
              For production use, please obtain your own API key from Nodit.
            </p>
          </div>
        </div>

        {/* Features Overview */}
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Token Pricing Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Real-Time USD Values</h3>
                <p className="text-sm text-gray-600">Get instant USD conversions for any token reward amount</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Price Change Tracking</h3>
                <p className="text-sm text-gray-600">Monitor 24-hour price movements and market trends</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Coins className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Market Context</h3>
                <p className="text-sm text-gray-600">Understand reward value relative to market conditions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample Token Examples */}
        <div className="space-y-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Sample Token Rewards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sampleTokens.map((token, index) => (
              <Card key={index} className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{token.name}</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {token.address.slice(0, 6)}...{token.address.slice(-4)}
                    </Badge>
                  </CardTitle>
                  <p className="text-gray-600">{token.description}</p>
                </CardHeader>
                <CardContent>
                  <RewardValue 
                    tokenAddress={token.address}
                    amount={token.amount}
                    decimals={token.decimals}
                    showDetails={true}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Custom Token Tester */}
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Test Your Own Token</CardTitle>
            <p className="text-gray-600">Enter any ERC-20 token address and amount to see real-time pricing</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <Label htmlFor="tokenAddress">Token Address</Label>
                <Input
                  id="tokenAddress"
                  placeholder="0x..."
                  value={customToken.address}
                  onChange={(e) => setCustomToken(prev => ({ ...prev, address: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount (in smallest unit)</Label>
                <Input
                  id="amount"
                  placeholder="1000000000000000000"
                  value={customToken.amount}
                  onChange={(e) => setCustomToken(prev => ({ ...prev, amount: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="decimals">Decimals</Label>
                <Input
                  id="decimals"
                  type="number"
                  placeholder="18"
                  value={customToken.decimals}
                  onChange={(e) => setCustomToken(prev => ({ ...prev, decimals: parseInt(e.target.value) || 18 }))}
                  className="mt-1"
                />
              </div>
            </div>

            {customToken.address && customToken.amount && (
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Custom Token Pricing</h3>
                <RewardValue 
                  tokenAddress={customToken.address}
                  amount={customToken.amount}
                  decimals={customToken.decimals}
                  showDetails={true}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Integration Info */}
        <Card className="bg-white/60 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-xl">Integration Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Nodit API Integration</h4>
                <p className="text-sm text-gray-600 mb-2">
                  This demo uses Nodit's real-time token pricing API to fetch current market data for any ERC-20 token.
                </p>
                <code className="text-xs bg-gray-100 p-2 rounded block">
                  POST https://web3.nodit.io/v1/ethereum/mainnet/token/getTokenPricesByContracts
                </code>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Usage in Platform-to-Earn</h4>
                <p className="text-sm text-gray-600">
                  The token pricing system is integrated throughout the platform to help users understand the real value of task rewards before participating.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Key Benefits</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Real-time USD value conversion</li>
                    <li>• Price change indicators</li>
                    <li>• Market context insights</li>
                    <li>• Stablecoin detection</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Supported Features</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Any ERC-20 token</li>
                    <li>• Multiple token comparison</li>
                    <li>• 24h price change tracking</li>
                    <li>• Automatic decimal handling</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 