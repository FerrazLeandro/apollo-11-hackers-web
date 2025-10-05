// Configuração da API OpenAQ - ARQUIVO DE EXEMPLO
// Copie este arquivo para src/config/openaq.js e configure sua chave

export const OPENAQ_CONFIG = {
  // IMPORTANTE: Substitua pela sua chave de API obtida em https://explore.openaq.org/register
  API_KEY: '38da3c0caa1e5bde8d3a588ecfca29f226cf5255ce2e60ad9318ecb47b4baeb4', // Obtenha sua chave gratuita em https://explore.openaq.org/register
  
  // URLs da API v3
  BASE_URL: 'https://api.openaq.org/v3',
  ENDPOINTS: {
    LOCATIONS: '/locations',
    MEASUREMENTS: '/measurements'
  }
}

// Função para obter headers com autenticação
export const getApiHeaders = () => ({
  'X-API-Key': OPENAQ_CONFIG.API_KEY,
  'Content-Type': 'application/json'
})

// Instruções:
// 1. Acesse https://explore.openaq.org/register
// 2. Registre-se gratuitamente
// 3. Acesse https://explore.openaq.org/account
// 4. Copie sua chave de API
// 5. Substitua 'SUA_CHAVE_DE_API_AQUI' pela sua chave real
