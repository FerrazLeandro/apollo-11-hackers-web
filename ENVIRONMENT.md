# Configuração de Ambiente - Apollo 11 Hackers

## Desenvolvimento Local (npm run dev)

- **Proxy**: Vite proxy em `/api/openaq/v3`
- **Target**: `https://api.openaq.org`
- **Headers**: Adicionados automaticamente pelo proxy
- **URL final**: `http://localhost:3001/api/openaq/v3/locations`

## Produção (Vercel Deploy)

- **API Route**: `/api/openaq/locations`
- **Target**: `https://api.openaq.org/v3/locations`
- **Headers**: Adicionados pela API route
- **URL final**: `https://seu-site.vercel.app/api/openaq/locations`

## Detecção Automática

O código detecta automaticamente o ambiente:

```javascript
const isProduction = import.meta.env.PROD
const BASE_URL = isProduction ? '/api/openaq' : '/api/openaq/v3'
```

## Estrutura de Arquivos

```
# Desenvolvimento
vite.config.js          <- Proxy do Vite
src/config/openaq.js    <- Configuração da API

# Produção
api/openaq/locations.js <- API route da Vercel
api/test.js            <- Endpoint de teste
```

## Teste

### Local
```bash
npm run dev
# Acesse: http://localhost:3001
```

### Produção
```bash
# Deploy automático na Vercel
# Acesse: https://seu-site.vercel.app
```
