const isProduction = import.meta.env.PROD
const isVercel = import.meta.env.VITE_VERCEL === 'true'

export const OPENAQ_CONFIG = {
  API_KEY: '38da3c0caa1e5bde8d3a588ecfca29f226cf5255ce2e60ad9318ecb47b4baeb4',
  
  BASE_URL: isProduction ? '/api/openaq' : '/api/openaq/v3',
  ENDPOINTS: {
    LOCATIONS: '/locations',
    MEASUREMENTS: '/measurements'
  }
}

export const getApiHeaders = () => ({
  'Content-Type': 'application/json'
})
