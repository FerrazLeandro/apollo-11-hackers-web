# Vercel Deploy - Apollo 11 Hackers

## Automatic Configuration

The project is configured to work in both development and production:

### 🏠 **Local Development**
- **Proxy**: Vite proxy at `/api/openaq/v3`
- **Target**: `https://api.openaq.org`
- **Headers**: Added automatically by proxy
- **Command**: `npm run dev`

### 🚀 **Production (Vercel)**
- **API Route**: `/api/openaq/locations`
- **Target**: `https://api.openaq.org/v3/locations`
- **Headers**: Added by API route
- **Deploy**: Automatic via Git

### 1. API Routes (Production)
- `api/openaq/locations.js` - Specific proxy for OpenAQ locations API
- `api/test.js` - Test endpoint to verify API is working
- Automatic CORS configuration
- Authentication headers included

### 2. File Structure
```
# Development
vite.config.js          <- Vite proxy
src/config/openaq.js    <- API configuration

# Production
api/
  openaq/
    locations.js  <- Specific API route for locations
  test.js        <- Test endpoint
```

### 3. Automatic Environment Detection
```javascript
const isProduction = import.meta.env.PROD
const BASE_URL = isProduction ? '/api/openaq' : '/api/openaq/v3'
```

## How to Deploy

1. Connect your repository to Vercel
2. Deploy will be automatic
3. API will work at `/api/openaq/locations`

## API Testing

### Local Development
```bash
npm run dev
# Access: http://localhost:3001
# API: http://localhost:3001/api/openaq/v3/locations
```

### Production
After deploy, test the endpoints:

1. **Basic test**: `https://your-site.vercel.app/api/test`
2. **OpenAQ API**: `https://your-site.vercel.app/api/openaq/locations?limit=10`

## API Structure

### Development
```
/api/openaq/v3/locations -> https://api.openaq.org/v3/locations
```

### Production
```
/api/openaq/locations -> https://api.openaq.org/v3/locations
/api/test -> Test endpoint
```

## Troubleshooting

If you still get 404 error:

### Local Development
1. Check if `vite.config.js` is correct
2. Restart server: `npm run dev`
3. Check browser console

### Production
1. **Test basic endpoint first**:
   ```
   https://your-site.vercel.app/api/test
   ```

2. **If test works, test OpenAQ API**:
   ```
   https://your-site.vercel.app/api/openaq/locations?limit=10
   ```

3. **Check Vercel logs** for specific errors

4. **Check if files are in correct folder**:
   - `api/openaq/locations.js`
   - `api/test.js`

## Useful Logs

The API route includes logs for debugging:
- Console.log of URL being called
- OpenAQ API response status
- Number of locations received
- Detailed errors in case of failure
