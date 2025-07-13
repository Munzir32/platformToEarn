export interface TokenPrice {
  contractAddress: string
  price: number
  currency: string
  timestamp: string
  change24h?: number
  volume24h?: number
}

export interface TokenPriceResponse {
  items: TokenPrice[]
  totalCount: number
}

export interface RewardValue {
  tokenAddress: string
  amount: string
  usdValue: number
  price: number
  change24h?: number
}

/**
 * Get real-time token prices for multiple contract addresses
 * @param contractAddresses Array of token contract addresses
 * @param currency Currency for price conversion (default: USD)
 * @returns Promise<TokenPriceResponse>
 */
// Cache for token prices to avoid rate limiting
const priceCache = new Map<string, { data: TokenPriceResponse; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function getTokenPrices(
  contractAddresses: string[],
  currency: string = "USD"
): Promise<TokenPriceResponse> {
  try {
    // Check cache first
    const cacheKey = `${contractAddresses.sort().join(',')}-${currency}`
    const cached = priceCache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Using cached token prices')
      return cached.data
    }

    const apiKey = process.env.NEXT_PUBLIC_NODIT_API_KEY || 'nodit-demo'
    
    // Add delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const response = await fetch('https://web3.nodit.io/v1/ethereum/mainnet/token/getTokenPricesByContracts', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'accept': 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        contractAddresses,
        currency
      })
    })

    if (response.status === 429) {
      console.warn('Rate limit hit, using fallback data')
      return getFallbackTokenPrices(contractAddresses, currency)
    }

    if (!response.ok) {
      throw new Error(`Nodit API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    // Cache the result
    priceCache.set(cacheKey, { data, timestamp: Date.now() })
    
    return data
  } catch (error) {
    console.error('Error fetching token prices:', error)
    // Return fallback data on error
    return getFallbackTokenPrices(contractAddresses, currency)
  }
}

// Fallback token prices for when API is unavailable
function getFallbackTokenPrices(contractAddresses: string[], currency: string): TokenPriceResponse {
  const fallbackPrices: { [key: string]: number } = {
    "0xdAC17F958D2ee523a2206206994597C13D831ec7": 1.00, // USDT
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": 1.00, // USDC
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": 2500.00, // WETH
    "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984": 7.50, // UNI
    "0x514910771AF9Ca656af840dff83E8264EcF986CA": 15.00, // LINK
    "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9": 250.00, // AAVE
  }

  const items: TokenPrice[] = contractAddresses.map(address => ({
    contractAddress: address,
    price: fallbackPrices[address] || 0,
    currency,
    timestamp: new Date().toISOString(),
    change24h: 0
  }))

  return {
    items,
    totalCount: items.length
  }
}

/**
 * Get USD value for a specific token reward
 * @param tokenAddress Token contract address
 * @param amount Token amount (in wei or smallest unit)
 * @param decimals Token decimals (default: 18)
 * @returns Promise<RewardValue>
 */
export async function getRewardValue(
  tokenAddress: string,
  amount: string,
  decimals: number = 18
): Promise<RewardValue> {
  try {
    const priceData = await getTokenPrices([tokenAddress])
    
    if (!priceData.items || priceData.items.length === 0) {
      throw new Error('No price data available for token')
    }

    const tokenPrice = priceData.items[0]
    const tokenAmount = parseFloat(amount) / Math.pow(10, decimals)
    const usdValue = tokenAmount * tokenPrice.price

    return {
      tokenAddress,
      amount,
      usdValue,
      price: tokenPrice.price,
      change24h: tokenPrice.change24h
    }
  } catch (error) {
    console.error('Error calculating reward value:', error)
    throw error
  }
}

/**
 * Get multiple reward values for comparison
 * @param rewards Array of reward objects with tokenAddress and amount
 * @returns Promise<RewardValue[]>
 */
export async function getMultipleRewardValues(
  rewards: Array<{ tokenAddress: string; amount: string; decimals?: number }>
): Promise<RewardValue[]> {
  try {
    const uniqueAddresses = [...new Set(rewards.map(r => r.tokenAddress))]
    const priceData = await getTokenPrices(uniqueAddresses)
    
    const priceMap = new Map(
      priceData.items.map(item => [item.contractAddress.toLowerCase(), item])
    )

    return rewards.map(reward => {
      const tokenPrice = priceMap.get(reward.tokenAddress.toLowerCase())
      if (!tokenPrice) {
        throw new Error(`No price data for token: ${reward.tokenAddress}`)
      }

      const decimals = reward.decimals || 18
      const tokenAmount = parseFloat(reward.amount) / Math.pow(10, decimals)
      const usdValue = tokenAmount * tokenPrice.price

      return {
        tokenAddress: reward.tokenAddress,
        amount: reward.amount,
        usdValue,
        price: tokenPrice.price,
        change24h: tokenPrice.change24h
      }
    })
  } catch (error) {
    console.error('Error calculating multiple reward values:', error)
    throw error
  }
}

/**
 * Format USD value with appropriate precision
 * @param value USD value to format
 * @returns Formatted string
 */
export function formatUSDValue(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}K`
  } else if (value >= 1) {
    return `$${value.toFixed(2)}`
  } else {
    return `$${value.toFixed(4)}`
  }
}

/**
 * Get price change indicator and color
 * @param change24h 24-hour price change percentage
 * @returns Object with indicator and color class
 */
export function getPriceChangeIndicator(change24h?: number) {
  if (!change24h) return { indicator: '', color: 'text-gray-500' }
  
  if (change24h > 0) {
    return { indicator: `+${change24h.toFixed(2)}%`, color: 'text-green-600' }
  } else if (change24h < 0) {
    return { indicator: `${change24h.toFixed(2)}%`, color: 'text-red-600' }
  } else {
    return { indicator: '0.00%', color: 'text-gray-500' }
  }
}

/**
 * Check if token is a known stablecoin
 * @param tokenAddress Token contract address
 * @returns boolean
 */
export function isStablecoin(tokenAddress: string): boolean {
  const stablecoins = [
    '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
    '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
    '0x4Fabb145d64652a948d72533023f6E7A623C7C53', // BUSD
  ]
  
  return stablecoins.includes(tokenAddress.toLowerCase())
} 