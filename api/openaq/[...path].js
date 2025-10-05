export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    // Extrair o path da URL
    const { path } = req.query
    const apiPath = Array.isArray(path) ? path.join('/') : path || ''
    
    // Construir URL da API OpenAQ
    const apiUrl = `https://api.openaq.org/v3/${apiPath}`
    
    console.log('Fazendo requisição para:', apiUrl)
    
    // Fazer requisição para a API OpenAQ
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        'X-API-Key': '38da3c0caa1e5bde8d3a588ecfca29f226cf5255ce2e60ad9318ecb47b4baeb4',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    res.status(200).json(data)
  } catch (error) {
    console.error('Erro no proxy da API:', error)
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    })
  }
}
