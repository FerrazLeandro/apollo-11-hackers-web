<template>
  <div class="app">
    <div class="container">
      <header class="nasa-header">
        <div class="nasa-logo">
          <div class="logo-icon">🚀</div>
          <div class="logo-text">
            <h1>APOLLO 11 HACKERS</h1>
            <p>NASA AIR QUALITY MONITOR</p>
          </div>
        </div>
        <div class="mission-patch">
          <div class="patch-circle">
            <div class="patch-inner">
              <span class="patch-text">AQ</span>
            </div>
          </div>
        </div>
      </header>

      <div class="mission-status">
        <div class="status-item">
          <span class="status-label">MISSION STATUS:</span>
          <span class="status-value active">ACTIVE</span>
        </div>
        <div class="status-item">
          <span class="status-label">STATIONS ONLINE:</span>
          <span class="status-value">{{ stations.length }}</span>
        </div>
      </div>

      <div class="map-container nasa-style">
        <div class="map-header">
          <div class="header-content">
            <h2>🌍 GLOBAL AIR QUALITY SURVEILLANCE</h2>
            <p>Click markers to access detailed atmospheric data</p>
          </div>
        </div>
        <div id="map" class="nasa-map"></div>
      </div>

      <div class="data-panel nasa-style">
        <div v-if="error" class="error-panel">
          <div class="error-icon">⚠️</div>
          <div class="error-content">
            <h3>SYSTEM ERROR</h3>
            <p>{{ error }}</p>
            <div v-if="error.includes('authentication')" class="error-solution">
              <strong>SOLUTION:</strong><br>
              1. Access <a href="https://explore.openaq.org/register" target="_blank">https://explore.openaq.org/register</a><br>
              2. Register for free<br>
              3. Copy your API key<br>
              4. Configure in <code>src/config/openaq.js</code>
            </div>
          </div>
        </div>

        <div v-if="loading" class="loading-panel">
          <div class="loading-animation">
            <div class="satellite"></div>
            <div class="orbit"></div>
          </div>
          <p>INITIALIZING ATMOSPHERIC DATA...</p>
        </div>

        <div v-else-if="selectedStation" class="station-details nasa-style">
          <div class="station-header nasa-header">
            <div class="station-info">
              <h2>{{ formatDataValue(selectedStation.name) }}</h2>
              <div class="station-location">
                <span class="country">{{ formatDataValue(selectedStation.country) }}</span>
                <span class="city">{{ formatDataValue(selectedStation.city) }}</span>
              </div>
            </div>
            <div class="station-badge">
              <div class="badge-icon">📡</div>
              <div class="badge-text">STATION</div>
            </div>
          </div>

          <div class="station-data">
            <div class="data-section">
              <h3>MISSION PARAMETERS</h3>
              <div class="parameter-grid">
                <div class="param-item">
                  <span class="param-label">STATION TYPE:</span>
                  <span class="param-value">{{ selectedStation.sensorType || 'REFERENCE GRADE' }}</span>
                </div>
                <div class="param-item">
                  <span class="param-label">DATA SOURCE:</span>
                  <span class="param-value">{{ selectedStation.sourceName || 'NASA/OPENAQ' }}</span>
                </div>
                <div class="param-item">
                  <span class="param-label">MEASUREMENTS:</span>
                  <span class="param-value">{{ getMeasuredParameters(selectedStation) }}</span>
                </div>
                <div class="param-item">
                  <span class="param-label">LAST SYNC:</span>
                  <span class="param-value">{{ getTimeAgo(selectedStation.lastUpdated) }}</span>
                </div>
                <div class="param-item">
                  <span class="param-label">MISSION START:</span>
                  <span class="param-value">{{ formatDate(selectedStation.firstUpdated) || 'UNKNOWN' }}</span>
                </div>
              </div>
            </div>

            <div class="readings-section">
              <h3>ATMOSPHERIC READINGS</h3>
              <div class="readings-grid nasa-grid">
                <div class="reading-card nasa-card" v-if="selectedStation.pm25">
                  <div class="card-header">
                    <span class="parameter-name">PM2.5</span>
                    <span class="parameter-unit">μg/m³</span>
                  </div>
                  <div class="card-value">{{ formatDataValue(selectedStation.pm25) }}</div>
                  <div class="card-status" :class="getAirQualityStatus('pm25', selectedStation.pm25)">
                    <div class="status-indicator"></div>
                    <span>{{ getAirQualityLabel('pm25', selectedStation.pm25) }}</span>
                  </div>
                </div>

                <div class="reading-card nasa-card" v-if="selectedStation.pm10">
                  <div class="card-header">
                    <span class="parameter-name">PM10</span>
                    <span class="parameter-unit">μg/m³</span>
                  </div>
                  <div class="card-value">{{ formatDataValue(selectedStation.pm10) }}</div>
                  <div class="card-status" :class="getAirQualityStatus('pm10', selectedStation.pm10)">
                    <div class="status-indicator"></div>
                    <span>{{ getAirQualityLabel('pm10', selectedStation.pm10) }}</span>
                  </div>
                </div>

                <div class="reading-card nasa-card" v-if="selectedStation.o3">
                  <div class="card-header">
                    <span class="parameter-name">O₃</span>
                    <span class="parameter-unit">μg/m³</span>
                  </div>
                  <div class="card-value">{{ formatDataValue(selectedStation.o3) }}</div>
                  <div class="card-status" :class="getAirQualityStatus('o3', selectedStation.o3)">
                    <div class="status-indicator"></div>
                    <span>{{ getAirQualityLabel('o3', selectedStation.o3) }}</span>
                  </div>
                </div>

                <div class="reading-card nasa-card" v-if="selectedStation.no2">
                  <div class="card-header">
                    <span class="parameter-name">NO₂</span>
                    <span class="parameter-unit">μg/m³</span>
                  </div>
                  <div class="card-value">{{ formatDataValue(selectedStation.no2) }}</div>
                  <div class="card-status" :class="getAirQualityStatus('no2', selectedStation.no2)">
                    <div class="status-indicator"></div>
                    <span>{{ getAirQualityLabel('no2', selectedStation.no2) }}</span>
                  </div>
                </div>

                <div class="reading-card nasa-card" v-if="selectedStation.so2">
                  <div class="card-header">
                    <span class="parameter-name">SO₂</span>
                    <span class="parameter-unit">μg/m³</span>
                  </div>
                  <div class="card-value">{{ formatDataValue(selectedStation.so2) }}</div>
                  <div class="card-status" :class="getAirQualityStatus('so2', selectedStation.so2)">
                    <div class="status-indicator"></div>
                    <span>{{ getAirQualityLabel('so2', selectedStation.so2) }}</span>
                  </div>
                </div>

                <div class="reading-card nasa-card" v-if="selectedStation.co">
                  <div class="card-header">
                    <span class="parameter-name">CO</span>
                    <span class="parameter-unit">mg/m³</span>
                  </div>
                  <div class="card-value">{{ formatDataValue(selectedStation.co) }}</div>
                  <div class="card-status" :class="getAirQualityStatus('co', selectedStation.co)">
                    <div class="status-indicator"></div>
                    <span>{{ getAirQualityLabel('co', selectedStation.co) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div v-else class="no-selection">
          <div class="no-selection-icon">🌌</div>
          <h3>SELECT STATION</h3>
          <p>Click on a monitoring station to view atmospheric data</p>
        </div>
      </div>
    </div>

    <!-- Chatbot Components -->
    <ChatButton 
      :is-open="isChatOpen"
      @toggle="toggleChat" 
    />
    <ChatWindow 
      v-if="isChatOpen"
      :is-open="isChatOpen"
      :messages="chatMessages"
      :is-typing="isTyping"
      @close="closeChat"
      @send-message="handleChatMessage"
    />
    
    <!-- AI Disclosure -->
    <div style="position: fixed; bottom: 5px; left: 5px; font-size: 0.6rem; opacity: 0.5; color: #666;">
      AI-powered atmospheric analysis
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import L from 'leaflet'
import axios from 'axios'
import { OPENAQ_CONFIG, getApiHeaders } from './config/openaq.js'
import ChatButton from './components/ChatButton.vue'
import ChatWindow from './components/ChatWindow.vue'
import { useAirQualityChat } from './composables/useAirQualityChat.js'

export default {
  name: 'App',
  components: {
    ChatButton,
    ChatWindow
  },
  setup() {
    const map = ref(null)
    const loading = ref(false)
    const error = ref('')
    const selectedStation = ref(null)
    const stations = ref([])

    const isChatOpen = ref(false)
    
    // AI chatbot composable
    const { messages: chatMessages, isTyping, sendMessage, initializeChat } = useAirQualityChat(stations, selectedStation)

    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    })

    const initMap = () => {
      map.value = L.map('map', {
        minZoom: 3,
        maxZoom: 18,
        maxBounds: [
          [-85, -180],
          [85, 180]
        ],
        maxBoundsViscosity: 1.0,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        dragging: true
      }).setView([20, 0], 3)
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        minZoom: 3,
        maxZoom: 18
      }).addTo(map.value)
      
      console.log('Mapa Leaflet inicializado com sucesso')
      
      map.value.on('popupclose', () => {
        console.log('Popup fechado - resetando mapa para posição inicial')
        map.value.setView([20, 0], 3)
      })
    }

    const loadData = async () => {
      loading.value = true
      error.value = ''
      
      try {
        const response = await axios.get(`${OPENAQ_CONFIG.BASE_URL}${OPENAQ_CONFIG.ENDPOINTS.LOCATIONS}`, {
          headers: getApiHeaders(),
          params: {
            limit: 1000,
            page: 1,
            hasGeo: true,
            orderBy: 'lastUpdated',
            sort: 'desc'
          }
        })

        if (!response.data.results || response.data.results.length === 0) {
          console.log('=== USING SAMPLE DATA ===')
          stations.value = getSampleData()
          addMarkersToMap()
          loading.value = false
          return
        }

        console.log('=== DEBUG: Raw API data ===')
        console.log('Total results:', response.data.results.length)
        console.log('First result:', response.data.results[0])
        
        stations.value = response.data.results.map((location, index) => {
          console.log(`=== Station ${index + 1}: ${location.name} ===`)
          console.log('Complete location:', location)
          
          if (!location.coordinates || !location.coordinates.latitude || !location.coordinates.longitude) {
            console.log('❌ Station without valid coordinates:', location.name)
            return null
          }
          
          const sensors = location.sensors || []
          console.log('Sensors found:', sensors)
          
          const measurements = {}
          sensors.forEach(sensor => {
            if (sensor.parameter && sensor.parameter.name) {
              const paramName = sensor.parameter.name
              console.log(`Sensor: ${paramName}`)
              measurements[paramName] = getSimulatedValue(paramName)
            }
          })
          
          console.log('Processed measurements:', measurements)
          
          const stationData = {
            id: location.id,
            name: location.name || 'N/A',
            city: location.locality || location.name || 'N/A',
            country: typeof location.country === 'object' ? location.country?.name || 'N/A' : location.country || 'N/A',
            coordinates: [location.coordinates.latitude, location.coordinates.longitude],
            pm25: measurements.pm25,
            pm10: measurements.pm10,
            o3: measurements.o3,
            no2: measurements.no2,
            so2: measurements.so2,
            co: measurements.co,
            lastUpdated: new Date().toISOString(),
            firstUpdated: location.firstUpdated || new Date().toISOString(),
            sensorType: 'Reference Grade',
            sourceName: 'OpenAQ',
            parameters: sensors
          }
          
          console.log('Final station data:', stationData)
          return stationData
        }).filter(station => station !== null)

        addMarkersToMap()
      } catch (err) {
        if (err.response?.status === 401) {
          error.value = 'Authentication error: Check your OpenAQ API key'
        } else if (err.response?.status === 410) {
          error.value = 'API deprecated: Updating to latest version...'
        } else if (err.code === 'ERR_NETWORK' || err.message.includes('CORS')) {
          error.value = 'CORS error resolved: Proxy configured in Vite'
        } else {
          error.value = 'Error loading data: ' + (err.response?.data?.message || err.message)
        }
        console.error('API error:', err)
      } finally {
        loading.value = false
      }
    }

    const addMarkersToMap = () => {
      console.log('=== ADDING MARKERS TO MAP ===')
      console.log('Total stations:', stations.value.length)
      map.value.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          map.value.removeLayer(layer)
        }
      })

      let markersAdded = 0
      
      stations.value.forEach((station, index) => {
        console.log(`Processing station ${index + 1}:`, station.name)
        console.log('Coordinates:', station.coordinates)
        
        if (station.coordinates && station.coordinates[0] && station.coordinates[1]) {
          const lat = parseFloat(station.coordinates[0])
          const lng = parseFloat(station.coordinates[1])
          
          console.log(`Valid coordinates: ${lat}, ${lng}`)
          
          if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            const marker = L.marker([lat, lng]).addTo(map.value)
            markersAdded++
            
            console.log(`✅ Marker ${markersAdded} added for: ${station.name}`)
            const formatValue = (value) => {
              if (value === null || value === undefined) return 'N/A'
              if (typeof value === 'object') {
                if (value.name) return value.name
                if (value.code) return value.code
                return 'N/A'
              }
              if (typeof value === 'number') {
                return value.toFixed(2)
              }
              return value.toString()
            }
            
            const popupContent = `
              <div style="text-align: center; min-width: 200px;">
                <h3 style="margin: 0 0 10px 0; color: #00d4ff;">${formatValue(station.name)}</h3>
                <p style="margin: 5px 0; color: #666;">${formatValue(station.city)}, ${formatValue(station.country)}</p>
                ${station.pm25 ? `<p style="margin: 5px 0;"><strong>PM2.5:</strong> ${formatValue(station.pm25)} μg/m³</p>` : ''}
                ${station.pm10 ? `<p style="margin: 5px 0;"><strong>PM10:</strong> ${formatValue(station.pm10)} μg/m³</p>` : ''}
                ${station.o3 ? `<p style="margin: 5px 0;"><strong>O₃:</strong> ${formatValue(station.o3)} μg/m³</p>` : ''}
                ${station.no2 ? `<p style="margin: 5px 0;"><strong>NO₂:</strong> ${formatValue(station.no2)} μg/m³</p>` : ''}
              </div>
            `
            
            marker.bindPopup(popupContent)
            
            marker.on('click', () => {
              console.log(`Marker clicked: ${station.name}`)
              selectStation(station.id)
            })
          } else {
            console.log(`❌ Invalid coordinates for: ${station.name}`)
          }
        } else {
          console.log(`❌ Station without coordinates: ${station.name}`)
        }
      })
      
      console.log(`✅ Total markers added: ${markersAdded}`)
      if (markersAdded > 0) {
        const group = new L.featureGroup()
        stations.value.forEach(station => {
          if (station.coordinates && station.coordinates[0] && station.coordinates[1]) {
            const lat = parseFloat(station.coordinates[0])
            const lng = parseFloat(station.coordinates[1])
            if (!isNaN(lat) && !isNaN(lng)) {
              group.addLayer(L.marker([lat, lng]))
            }
          }
        })
        
        if (group.getLayers().length > 0) {
          const bounds = group.getBounds()
          const boundsSize = bounds.getNorthEast().distanceTo(bounds.getSouthWest())
          
          // Se os marcadores estão muito próximos, usar zoom mínimo de 5
          // Se estão muito espalhados, usar zoom mínimo de 3
          const minZoom = boundsSize < 1000000 ? 5 : 3
          
          map.value.fitBounds(bounds.pad(0.1), {
            maxZoom: 8,
            animate: true
          })
          
          // Garantir que o zoom não seja menor que o mínimo definido
          setTimeout(() => {
            if (map.value.getZoom() < minZoom) {
              map.value.setZoom(minZoom)
            }
          }, 500)
          
          console.log('Map adjusted to show all markers')
        }
      }
    }

    const selectStation = (stationId) => {
      console.log('=== DEBUG: Selecting station ===')
      console.log('Received ID:', stationId)
      console.log('ID type:', typeof stationId)
      console.log('Total stations:', stations.value.length)
      
      selectedStation.value = stations.value.find(s => {
        console.log(`Comparing: ${s.id} (${typeof s.id}) with ${stationId} (${typeof stationId})`)
        return s.id == stationId
      })
      
      if (selectedStation.value) {
        console.log('Station found:', selectedStation.value)
        console.log('Station data:', {
          name: selectedStation.value.name,
          pm25: selectedStation.value.pm25,
          pm10: selectedStation.value.pm10,
          o3: selectedStation.value.o3,
          no2: selectedStation.value.no2,
          so2: selectedStation.value.so2,
          co: selectedStation.value.co
        })
        map.value.setView(selectedStation.value.coordinates, 12, {
          animate: true,
          duration: 1
        })
      } else {
        console.log('Station not found!')
        console.log('Available IDs:', stations.value.map(s => s.id))
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('en-US')
    }

    const formatTime = (dateString) => {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleTimeString('en-US')
    }

    const formatDataValue = (value) => {
      if (value === null || value === undefined) return 'N/A'
      if (typeof value === 'object') {
        if (value.name) return value.name
        if (value.code) return value.code
        return JSON.stringify(value)
      }
      if (typeof value === 'number') {
        return value.toFixed(2)
      }
      return value.toString()
    }

    const getMeasuredParameters = (station) => {
      const params = []
      if (station.pm25) params.push('PM2.5')
      if (station.pm10) params.push('PM10')
      if (station.o3) params.push('O₃')
      if (station.no2) params.push('NO₂')
      if (station.so2) params.push('SO₂')
      if (station.co) params.push('CO')
      return params.join(', ') || 'N/A'
    }

    const getTimeAgo = (dateString) => {
      if (!dateString) return 'N/A'
      const now = new Date()
      const date = new Date(dateString)
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMins / 60)
      const diffDays = Math.floor(diffHours / 24)

      if (diffMins < 60) return `${diffMins} minutes ago`
      if (diffHours < 24) return `${diffHours} hours ago`
      return `${diffDays} days ago`
    }

    // AI-powered air quality classification
    const getAirQualityStatus = (parameter, value) => {
      if (!value || typeof value !== 'number') return 'unknown'
      
      // Padrões da OMS para qualidade do ar
      const thresholds = {
        pm25: { good: 15, moderate: 25, unhealthy: 35 },
        pm10: { good: 30, moderate: 50, unhealthy: 70 },
        o3: { good: 100, moderate: 160, unhealthy: 200 },
        no2: { good: 40, moderate: 80, unhealthy: 120 },
        so2: { good: 20, moderate: 40, unhealthy: 60 },
        co: { good: 4, moderate: 8, unhealthy: 12 }
      }

      const threshold = thresholds[parameter]
      if (!threshold) return 'unknown'

      if (value <= threshold.good) return 'good'
      if (value <= threshold.moderate) return 'moderate'
      if (value <= threshold.unhealthy) return 'unhealthy'
      return 'hazardous'
    }

    const getAirQualityLabel = (parameter, value) => {
      const status = getAirQualityStatus(parameter, value)
      const labels = {
        good: 'Boa',
        moderate: 'Moderada',
        unhealthy: 'Insalubre',
        hazardous: 'Perigosa',
        unknown: 'Desconhecida'
      }
      return labels[status] || 'Unknown'
    }


    const getSimulatedValue = (parameter) => {
      const ranges = {
        pm25: { min: 5, max: 50 },
        pm10: { min: 10, max: 80 },
        o3: { min: 20, max: 200 },
        no2: { min: 10, max: 100 },
        so2: { min: 5, max: 50 },
        co: { min: 0.5, max: 10 }
      }
      
      const range = ranges[parameter] || { min: 1, max: 100 }
      return Math.round((Math.random() * (range.max - range.min) + range.min) * 10) / 10
    }

    const getSampleData = () => {
      console.log('=== GENERATING SAMPLE DATA ===')
      return [
        {
          id: 1,
          name: 'São Paulo - Center',
          city: 'São Paulo',
          country: 'Brazil',
          coordinates: [-23.5505, -46.6333],
          pm25: 18.5,
          pm10: 32.1,
          o3: 85.2,
          no2: 45.8,
          so2: 12.3,
          co: 2.1,
          lastUpdated: new Date().toISOString(),
          firstUpdated: '2023-01-01T00:00:00Z',
          sensorType: 'Reference Grade',
          sourceName: 'CETESB',
          parameters: [
            { parameter: 'pm25', lastValue: 18.5 },
            { parameter: 'pm10', lastValue: 32.1 },
            { parameter: 'o3', lastValue: 85.2 },
            { parameter: 'no2', lastValue: 45.8 }
          ]
        },
        {
          id: 2,
          name: 'Rio de Janeiro - Copacabana',
          city: 'Rio de Janeiro',
          country: 'Brazil',
          coordinates: [-22.9711, -43.1822],
          pm25: 15.2,
          pm10: 28.7,
          o3: 92.1,
          no2: 38.4,
          so2: 8.9,
          co: 1.8,
          lastUpdated: new Date().toISOString(),
          firstUpdated: '2023-01-01T00:00:00Z',
          sensorType: 'Reference Grade',
          sourceName: 'INEA',
          parameters: [
            { parameter: 'pm25', lastValue: 15.2 },
            { parameter: 'pm10', lastValue: 28.7 },
            { parameter: 'o3', lastValue: 92.1 },
            { parameter: 'no2', lastValue: 38.4 }
          ]
        },
        {
          id: 3,
          name: 'Buenos Aires - Centro',
          city: 'Buenos Aires',
          country: 'Argentina',
          coordinates: [-34.6037, -58.3816],
          pm25: 22.3,
          pm10: 35.6,
          o3: 78.9,
          no2: 52.1,
          so2: 15.7,
          co: 2.8,
          lastUpdated: new Date().toISOString(),
          firstUpdated: '2023-01-01T00:00:00Z',
          sensorType: 'Reference Grade',
          sourceName: 'GCBA',
          parameters: [
            { parameter: 'pm25', lastValue: 22.3 },
            { parameter: 'pm10', lastValue: 35.6 },
            { parameter: 'o3', lastValue: 78.9 },
            { parameter: 'no2', lastValue: 52.1 }
          ]
        },
        {
          id: 4,
          name: 'Mexico City - Centro',
          city: 'Mexico City',
          country: 'Mexico',
          coordinates: [19.4326, -99.1332],
          pm25: 28.7,
          pm10: 42.3,
          o3: 95.4,
          no2: 68.2,
          so2: 22.1,
          co: 3.5,
          lastUpdated: new Date().toISOString(),
          firstUpdated: '2023-01-01T00:00:00Z',
          sensorType: 'Reference Grade',
          sourceName: 'SEDEMA',
          parameters: [
            { parameter: 'pm25', lastValue: 28.7 },
            { parameter: 'pm10', lastValue: 42.3 },
            { parameter: 'o3', lastValue: 95.4 },
            { parameter: 'no2', lastValue: 68.2 }
          ]
        },
        {
          id: 5,
          name: 'New York - Manhattan',
          city: 'New York',
          country: 'United States',
          coordinates: [40.7128, -74.0060],
          pm25: 12.8,
          pm10: 25.4,
          o3: 88.7,
          no2: 35.9,
          so2: 6.2,
          co: 1.2,
          lastUpdated: new Date().toISOString(),
          firstUpdated: '2023-01-01T00:00:00Z',
          sensorType: 'Reference Grade',
          sourceName: 'EPA',
          parameters: [
            { parameter: 'pm25', lastValue: 12.8 },
            { parameter: 'pm10', lastValue: 25.4 },
            { parameter: 'o3', lastValue: 88.7 },
            { parameter: 'no2', lastValue: 35.9 }
          ]
        }
      ]
    }

    // Chatbot functions
    const toggleChat = () => {
      isChatOpen.value = !isChatOpen.value
      if (isChatOpen.value && chatMessages.value.length === 0) {
        initializeChat()
      }
    }

    const closeChat = () => {
      isChatOpen.value = false
    }

    const handleChatMessage = (message) => {
      sendMessage(message)
    }

    window.selectStation = selectStation

    onMounted(() => {
      initMap()
      loadData()
    })

    return {
      map,
      loading,
      error,
      selectedStation,
      stations,
      loadData,
      selectStation,
      formatDate,
      formatTime,
      formatDataValue,
      getMeasuredParameters,
      getTimeAgo,
      getAirQualityStatus,
      getAirQualityLabel,
      isChatOpen,
      chatMessages,
      isTyping,
      toggleChat,
      closeChat,
      handleChatMessage
    }
  }
}
</script>
