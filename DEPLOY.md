# Deploy na Vercel - Apollo 11 Hackers

## Configuração Automática

O projeto está configurado para funcionar tanto em desenvolvimento quanto em produção:

### 🏠 **Desenvolvimento Local**
- **Proxy**: Vite proxy em `/api/openaq/v3`
- **Target**: `https://api.openaq.org`
- **Headers**: Adicionados automaticamente pelo proxy
- **Comando**: `npm run dev`

### 🚀 **Produção (Vercel)**
- **API Route**: `/api/openaq/locations`
- **Target**: `https://api.openaq.org/v3/locations`
- **Headers**: Adicionados pela API route
- **Deploy**: Automático via Git

### 1. API Routes (Produção)
- `api/openaq/locations.js` - Proxy específico para locations da API OpenAQ
- `api/test.js` - Endpoint de teste para verificar se a API está funcionando
- Configuração automática de CORS
- Headers de autenticação incluídos

### 2. Estrutura de Arquivos
```
# Desenvolvimento
vite.config.js          <- Proxy do Vite
src/config/openaq.js    <- Configuração da API

# Produção
api/
  openaq/
    locations.js  <- API route específica para locations
  test.js        <- Endpoint de teste
```

### 3. Detecção Automática de Ambiente
```javascript
const isProduction = import.meta.env.PROD
const BASE_URL = isProduction ? '/api/openaq' : '/api/openaq/v3'
```

## Como Fazer Deploy

1. Conecte seu repositório à Vercel
2. O deploy será automático
3. A API funcionará em `/api/openaq/locations`

## Teste da API

### Desenvolvimento Local
```bash
npm run dev
# Acesse: http://localhost:3001
# API: http://localhost:3001/api/openaq/v3/locations
```

### Produção
Após o deploy, teste os endpoints:

1. **Teste básico**: `https://seu-site.vercel.app/api/test`
2. **API OpenAQ**: `https://seu-site.vercel.app/api/openaq/locations?limit=10`

## Estrutura da API

### Desenvolvimento
```
/api/openaq/v3/locations -> https://api.openaq.org/v3/locations
```

### Produção
```
/api/openaq/locations -> https://api.openaq.org/v3/locations
/api/test -> Endpoint de teste
```

## Troubleshooting

Se ainda houver erro 404:

### Desenvolvimento Local
1. Verifique se o `vite.config.js` está correto
2. Reinicie o servidor: `npm run dev`
3. Verifique o console do navegador

### Produção
1. **Teste o endpoint básico primeiro**:
   ```
   https://seu-site.vercel.app/api/test
   ```

2. **Se o teste funcionar, teste a API OpenAQ**:
   ```
   https://seu-site.vercel.app/api/openaq/locations?limit=10
   ```

3. **Verifique os logs da Vercel** para erros específicos

4. **Verifique se os arquivos estão na pasta correta**:
   - `api/openaq/locations.js`
   - `api/test.js`

## Logs Úteis

A API route inclui logs para debug:
- Console.log da URL sendo chamada
- Status da resposta da API OpenAQ
- Número de locations recebidas
- Erros detalhados em caso de falha
