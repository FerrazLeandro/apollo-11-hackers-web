export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const apiUrl = 'https://api.openaq.org/v3/locations'
    
    console.log('Making request to:', apiUrl)
    console.log('Query params:', req.query)
    
    const queryParams = new URLSearchParams({
      limit: req.query.limit || '1000',
      page: req.query.page || '1',
      hasGeo: req.query.hasGeo || 'true',
      orderBy: req.query.orderBy || 'lastUpdated',
      sort: req.query.sort || 'desc'
    })
    
    const fullUrl = `${apiUrl}?${queryParams.toString()}`
    console.log('Full URL:', fullUrl)
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'X-API-Key': '38da3c0caa1e5bde8d3a588ecfca29f226cf5255ce2e60ad9318ecb47b4baeb4',
        'Content-Type': 'application/json'
      }
    })

    console.log('Response status:', response.status)

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Data received:', data.results?.length || 0, 'locations')
    
    res.status(200).json(data)
  } catch (error) {
    console.error('API proxy error:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    })
  }
}
