# Deploy na Vercel - Apollo 11 Hackers

## Configuração Automática

O projeto já está configurado para funcionar na Vercel com:

### 1. API Routes
- `api/openaq/locations.js` - Proxy específico para locations da API OpenAQ
- `api/test.js` - Endpoint de teste para verificar se a API está funcionando
- Configuração automática de CORS
- Headers de autenticação incluídos

### 2. Estrutura de Arquivos
```
api/
  openaq/
    locations.js  <- API route específica para locations
  test.js        <- Endpoint de teste
```

### 3. Variáveis de Ambiente
Não são necessárias variáveis de ambiente adicionais.

## Como Fazer Deploy

1. Conecte seu repositório à Vercel
2. O deploy será automático
3. A API funcionará em `/api/openaq/locations`

## Teste da API

Após o deploy, teste os endpoints:

1. **Teste básico**: `https://seu-site.vercel.app/api/test`
2. **API OpenAQ**: `https://seu-site.vercel.app/api/openaq/locations?limit=10`

## Estrutura da API

```
/api/openaq/locations -> https://api.openaq.org/v3/locations
/api/test -> Endpoint de teste
```

## Troubleshooting

Se ainda houver erro 404:

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
