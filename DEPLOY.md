# Deploy na Vercel - Apollo 11 Hackers

## Configuração Automática

O projeto já está configurado para funcionar na Vercel com:

### 1. API Routes
- `api/openaq/[...path].js` - Proxy para a API OpenAQ
- Configuração automática de CORS
- Headers de autenticação incluídos

### 2. Configuração Vercel
- `vercel.json` - Configuração de rewrites e headers
- Proxy automático para `/api/openaq/*`

### 3. Variáveis de Ambiente
Não são necessárias variáveis de ambiente adicionais.

## Como Fazer Deploy

1. Conecte seu repositório à Vercel
2. O deploy será automático
3. A API funcionará em `/api/openaq/v3/locations`

## Estrutura da API

```
/api/openaq/v3/locations -> https://api.openaq.org/v3/locations
/api/openaq/v3/measurements -> https://api.openaq.org/v3/measurements
```

## Troubleshooting

Se ainda houver erro 404:
1. Verifique se o arquivo `api/openaq/[...path].js` existe
2. Verifique se o `vercel.json` está na raiz do projeto
3. Faça um novo deploy
