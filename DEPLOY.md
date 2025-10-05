# Deploy na Vercel - Apollo 11 Hackers

## Configuração Automática

O projeto já está configurado para funcionar na Vercel com:

### 1. API Routes
- `api/openaq/[...path].js` - Proxy para a API OpenAQ
- Configuração automática de CORS
- Headers de autenticação incluídos
- Usa fetch nativo do Node.js 18+

### 2. Estrutura de Arquivos
```
api/
  openaq/
    [...path].js  <- API route da Vercel
```

### 3. Variáveis de Ambiente
Não são necessárias variáveis de ambiente adicionais.

## Como Fazer Deploy

1. Conecte seu repositório à Vercel
2. O deploy será automático
3. A API funcionará em `/api/openaq/locations`

## Estrutura da API

```
/api/openaq/locations -> https://api.openaq.org/v3/locations
/api/openaq/measurements -> https://api.openaq.org/v3/measurements
```

## Troubleshooting

Se ainda houver erro 404:
1. Verifique se o arquivo `api/openaq/[...path].js` existe
2. Verifique se está na pasta correta: `api/openaq/`
3. Faça um novo deploy
4. Verifique os logs da Vercel para erros

## Logs Úteis

A API route inclui logs para debug:
- Console.log da URL sendo chamada
- Erros detalhados em caso de falha
