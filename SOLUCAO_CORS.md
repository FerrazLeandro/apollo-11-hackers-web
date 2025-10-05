# 🔧 SOLUÇÃO PARA ERRO DE CORS - OpenAQ API

## ❌ Problema
Erro de CORS ao tentar acessar a API OpenAQ diretamente do navegador.

## ✅ Solução Implementada
**Proxy configurado no Vite** que resolve automaticamente o problema de CORS.

## 🚀 Como Funciona

### 1. Proxy Configurado
```javascript
// vite.config.js
proxy: {
  '/api/openaq': {
    target: 'https://api.openaq.org',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api\/openaq/, ''),
    configure: (proxy, options) => {
      proxy.on('proxyReq', (proxyReq, req, res) => {
        proxyReq.setHeader('X-API-Key', 'sua-chave-aqui')
      })
    }
  }
}
```

### 2. URLs Atualizadas
```javascript
// src/config/openaq.js
BASE_URL: '/api/openaq/v3', // Proxy local
// Em vez de: 'https://api.openaq.org/v3'
```

### 3. Headers Automáticos
- Chave de API adicionada automaticamente pelo proxy
- Sem necessidade de configurar CORS manualmente

## 🎯 Resultado
- ✅ **Sem erros de CORS**
- ✅ **Funciona automaticamente**
- ✅ **Sem configuração adicional**
- ✅ **Headers de autenticação automáticos**

## 🔄 Para Testar
```bash
npm run dev
```
Acesse: http://localhost:3000

## 📋 Vantagens da Solução
1. **Simples**: Configuração única no Vite
2. **Automática**: Funciona sem intervenção
3. **Segura**: Chave de API não exposta no cliente
4. **Eficiente**: Proxy otimizado para desenvolvimento

## 🚀 Para Produção
Configure proxy similar no seu servidor:
- **Vercel**: rewrites no vercel.json
- **Netlify**: redirects no _redirects
- **Nginx**: proxy_pass
- **Apache**: ProxyPass
