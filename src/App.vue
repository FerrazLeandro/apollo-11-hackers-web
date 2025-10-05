<template>
  <div class="app">
    <div class="container">
      <!-- Header NASA Style -->
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

      <!-- Mission Status -->
      <div class="mission-status">
        <div class="status-item">
          <span class="status-label">MISSION STATUS:</span>
          <span class="status-value active">ACTIVE</span>
        </div>
        <div class="status-item">
          <span class="status-label">STATIONS ONLINE:</span>
          <span class="status-value">{{ stations.length }}</span>
        </div>
        <div class="status-item">
          <span class="status-label">LAST UPDATE:</span>
          <span class="status-value">{{ getCurrentTime() }}</span>
        </div>
      </div>

      <!-- Map Container NASA Style -->
      <div class="map-container nasa-style">
        <div class="map-header">
          <div class="header-content">
            <h2>🌍 GLOBAL AIR QUALITY SURVEILLANCE</h2>
            <p>Click markers to access detailed atmospheric data</p>
          </div>
          <div class="header-controls">
            <div class="control-panel">
              <button @click="loadData" class="nasa-btn primary" :disabled="loading">
                <span class="btn-icon">🔄</span>
                {{ loading ? 'SYNCING...' : 'SYNC DATA' }}
              </button>
              <button @click="centerMap" class="nasa-btn secondary">
                <span class="btn-icon">🎯</span>
                CENTER MAP
              </button>
            </div>
          </div>
        </div>
        <div id="map" class="nasa-map"></div>
      </div>

      <!-- Data Panel NASA Style -->
      <div class="data-panel nasa-style">
        <div v-if="error" class="error-panel">
          <div class="error-icon">⚠️</div>
          <div class="error-content">
            <h3>SYSTEM ERROR</h3>
            <p>{{ error }}</p>
            <div v-if="error.includes('autenticação')" class="error-solution">
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
          <!-- Station Header NASA Style -->
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

          <!-- Station Data NASA Style -->
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

            <!-- Current Readings NASA Style -->
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

          <!-- Mission Controls -->
          <div class="mission-controls">
            <button class="nasa-btn primary" @click="refreshStationData">
              <span class="btn-icon">🔄</span>
              SYNC DATA
            </button>
            <button class="nasa-btn secondary" @click="showStationOnMap">
              <span class="btn-icon">🎯</span>
              LOCATE STATION
            </button>
          </div>
        </div>

        <div v-else class="no-selection">
          <div class="no-selection-icon">🌌</div>
          <h3>SELECT STATION</h3>
          <p>Click on a monitoring station to view atmospheric data</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import L from 'leaflet'
import axios from 'axios'
import { OPENAQ_CONFIG, getApiHeaders } from './config/openaq.js'

export default {
  name: 'App',
  setup() {
    const map = ref(null)
    const loading = ref(false)
    const error = ref('')
    const selectedStation = ref(null)
    const stations = ref([])

    // Configurar ícones do Leaflet para Vue
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    })

    const initMap = () => {
      map.value = L.map('map').setView([0, 0], 2)
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map.value)
    }

    const loadData = async () => {
      loading.value = true
      error.value = ''
      
      try {
        // Buscar dados da OpenAQ API v3 via proxy (resolve CORS)
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

        // Processar dados da API v3
        stations.value = response.data.results.map(location => {
          // Na API v3, os parâmetros estão em location.parameters como array
          const parameters = location.parameters || []
          
          // Criar objeto com os valores dos parâmetros
          const measurements = {}
          parameters.forEach(param => {
            if (param.lastValue !== null && param.lastValue !== undefined) {
              measurements[param.parameter] = param.lastValue
            }
          })
          
          return {
            id: location.id,
            name: location.name || 'N/A',
            city: location.city || 'N/A',
            country: typeof location.country === 'object' ? location.country?.name || 'N/A' : location.country || 'N/A',
            coordinates: [location.coordinates.latitude, location.coordinates.longitude],
            pm25: measurements.pm25,
            pm10: measurements.pm10,
            o3: measurements.o3,
            no2: measurements.no2,
            so2: measurements.so2,
            co: measurements.co,
            lastUpdated: location.lastUpdated,
            firstUpdated: location.firstUpdated,
            sensorType: location.sensorType || 'Reference Grade',
            sourceName: location.sourceName || 'OpenAQ',
            parameters: parameters
          }
        })

        addMarkersToMap()
      } catch (err) {
        if (err.response?.status === 401) {
          error.value = 'Erro de autenticação: Verifique sua chave de API OpenAQ'
        } else if (err.response?.status === 410) {
          error.value = 'API descontinuada: Atualizando para versão mais recente...'
        } else if (err.code === 'ERR_NETWORK' || err.message.includes('CORS')) {
          error.value = 'Erro de CORS resolvido: Proxy configurado no Vite'
        } else {
          error.value = 'Erro ao carregar dados: ' + (err.response?.data?.message || err.message)
        }
        console.error('Erro na API:', err)
      } finally {
        loading.value = false
      }
    }

    const addMarkersToMap = () => {
      // Limpar marcadores existentes
      map.value.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          map.value.removeLayer(layer)
        }
      })

      stations.value.forEach(station => {
        if (station.coordinates[0] && station.coordinates[1]) {
          const marker = L.marker(station.coordinates).addTo(map.value)
          
          // Criar popup com informações básicas
          const formatValue = (value) => {
            if (value === null || value === undefined) return 'N/A'
            if (typeof value === 'object') {
              // Se for um objeto, tentar extrair propriedades úteis
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
              <h3 style="margin: 0 0 10px 0; color: #2196F3;">${formatValue(station.name)}</h3>
              <p style="margin: 5px 0; color: #666;">${formatValue(station.city)}, ${formatValue(station.country)}</p>
              ${station.pm25 ? `<p style="margin: 5px 0;"><strong>PM2.5:</strong> ${formatValue(station.pm25)} μg/m³</p>` : ''}
              ${station.pm10 ? `<p style="margin: 5px 0;"><strong>PM10:</strong> ${formatValue(station.pm10)} μg/m³</p>` : ''}
              ${station.o3 ? `<p style="margin: 5px 0;"><strong>O₃:</strong> ${formatValue(station.o3)} μg/m³</p>` : ''}
              ${station.no2 ? `<p style="margin: 5px 0;"><strong>NO₂:</strong> ${formatValue(station.no2)} μg/m³</p>` : ''}
              <button onclick="window.selectStation('${station.id}')" 
                      style="background: #2196F3; color: white; border: none; padding: 8px 16px; 
                             border-radius: 5px; cursor: pointer; margin-top: 10px;">
                Ver Detalhes
              </button>
            </div>
          `
          
          marker.bindPopup(popupContent)
          
          // Adicionar evento de clique
          marker.on('click', () => {
            selectStation(station.id)
          })
        }
      })
    }

    const selectStation = (stationId) => {
      selectedStation.value = stations.value.find(s => s.id == stationId) // Usar == para comparar string/number
      
      if (selectedStation.value) {
        map.value.setView(selectedStation.value.coordinates, 10)
      }
    }

    const centerMap = () => {
      if (stations.value.length > 0) {
        const group = new L.featureGroup()
        stations.value.forEach(station => {
          if (station.coordinates[0] && station.coordinates[1]) {
            group.addLayer(L.marker(station.coordinates))
          }
        })
        map.value.fitBounds(group.getBounds().pad(0.1))
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('pt-BR')
    }

    const formatTime = (dateString) => {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleTimeString('pt-BR')
    }

    const formatDataValue = (value) => {
      if (value === null || value === undefined) return 'N/A'
      if (typeof value === 'object') {
        // Se for um objeto, tentar extrair propriedades úteis
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

      if (diffMins < 60) return `${diffMins} minutos atrás`
      if (diffHours < 24) return `${diffHours} horas atrás`
      return `${diffDays} dias atrás`
    }

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
      return labels[status] || 'Desconhecida'
    }

    const refreshStationData = () => {
      loadData()
    }

    const showStationOnMap = () => {
      if (selectedStation.value) {
        map.value.setView(selectedStation.value.coordinates, 15)
      }
    }

    const getCurrentTime = () => {
      return new Date().toLocaleTimeString('pt-BR', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }

    // Expor função globalmente para uso nos popups
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
      centerMap,
      selectStation,
      formatDate,
      formatTime,
      formatDataValue,
      getMeasuredParameters,
      getTimeAgo,
      getAirQualityStatus,
      getAirQualityLabel,
      refreshStationData,
      showStationOnMap,
      getCurrentTime
    }
  }
}
</script>
