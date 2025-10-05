// Configuração da API OpenAQ
export const OPENAQ_CONFIG = {
  // IMPORTANTE: Substitua pela sua chave de API obtida em https://explore.openaq.org/register
  API_KEY: '38da3c0caa1e5bde8d3a588ecfca29f226cf5255ce2e60ad9318ecb47b4baeb4', // Sua chave de API
  
  // URLs da API v3 - usando proxy para resolver CORS
  BASE_URL: '/api/openaq/v3', // Proxy configurado no Vite
  ENDPOINTS: {
    LOCATIONS: '/locations',
    MEASUREMENTS: '/measurements'
  }
}

// Função para obter headers com autenticação
// Nota: Headers são adicionados automaticamente pelo proxy do Vite
export const getApiHeaders = () => ({
  'Content-Type': 'application/json'
})
