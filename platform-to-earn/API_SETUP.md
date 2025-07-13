# API Setup Guide - Platform-to-Earn

## Nodit API Configuration

The platform uses Nodit's API for real-time token pricing. To avoid rate limiting issues, you need to set up your own API key.

### 1. Get Your Nodit API Key

1. Visit [Nodit.io](https://nodit.io)
2. Sign up for an account
3. Navigate to your API dashboard
4. Generate a new API key
5. Copy the API key

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Nodit API Key (replace with your actual key)
NEXT_PUBLIC_NODIT_API_KEY=your_actual_nodit_api_key_here

# Pinata JWT (for IPFS uploads)
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token_here
```

### 3. Rate Limiting

The demo API key has strict rate limits. With your own API key, you'll get:

- **Higher rate limits**: More requests per minute
- **Better reliability**: Dedicated API access
- **Production support**: Priority support for issues

### 4. Fallback System

The platform includes a fallback system that:

- **Caches responses**: Reduces API calls
- **Uses fallback data**: When API is unavailable
- **Debounces requests**: Prevents rapid-fire calls
- **Graceful degradation**: Continues working even with API issues

### 5. Testing

After setting up your API key:

1. Restart your development server
2. Visit `/token-pricing-demo`
3. Test with different tokens
4. Check browser console for any remaining errors

### 6. Production Deployment

For production deployment:

1. Set the environment variable in your hosting platform
2. Ensure the API key is properly configured
3. Monitor API usage and rate limits
4. Consider implementing additional caching strategies

### Troubleshooting

**429 Error (Too Many Requests)**
- Get your own API key
- Check rate limit settings
- Implement proper caching

**API Key Not Working**
- Verify the key is correct
- Check if the key is active
- Ensure proper environment variable setup

**Fallback Data Showing**
- This is normal when API is unavailable
- Check your internet connection
- Verify API key permissions 