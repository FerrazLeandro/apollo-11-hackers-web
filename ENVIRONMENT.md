# Environment Configuration - Apollo 11 Hackers

## Local Development (npm run dev)

- **Proxy**: Vite proxy at `/api/openaq/v3`
- **Target**: `https://api.openaq.org`
- **Headers**: Added automatically by proxy
- **Final URL**: `http://localhost:3001/api/openaq/v3/locations`

## Production (Vercel Deploy)

- **API Route**: `/api/openaq/locations`
- **Target**: `https://api.openaq.org/v3/locations`
- **Headers**: Added by API route
- **Final URL**: `https://your-site.vercel.app/api/openaq/locations`

## Automatic Detection

The code automatically detects the environment:

```javascript
const isProduction = import.meta.env.PROD
const BASE_URL = isProduction ? '/api/openaq' : '/api/openaq/v3'
```

## File Structure

```
# Development
vite.config.js          <- Vite proxy
src/config/openaq.js    <- API configuration

# Production
api/openaq/locations.js <- Vercel API route
api/test.js            <- Test endpoint
```

## Testing

### Local
```bash
npm run dev
# Access: http://localhost:3001
```

### Production
```bash
# Automatic deploy on Vercel
# Access: https://your-site.vercel.app
```
