import { ref, computed } from 'vue'

// AI-powered atmospheric analysis system
export function useAirQualityChat(stations, selectedStation) {
  const messages = ref([])
  const isTyping = ref(false)

  const getCurrentAirQuality = () => {
    if (!selectedStation.value) {
      return null
    }

    const station = selectedStation.value
    const measurements = {
      pm25: station.pm25,
      pm10: station.pm10,
      o3: station.o3,
      no2: station.no2,
      so2: station.so2,
      co: station.co
    }

    const qualityScores = []
    
    if (measurements.pm25) {
      const score = getAirQualityScore('pm25', measurements.pm25)
      qualityScores.push(score)
    }
    if (measurements.pm10) {
      const score = getAirQualityScore('pm10', measurements.pm10)
      qualityScores.push(score)
    }
    if (measurements.o3) {
      const score = getAirQualityScore('o3', measurements.o3)
      qualityScores.push(score)
    }
    if (measurements.no2) {
      const score = getAirQualityScore('no2', measurements.no2)
      qualityScores.push(score)
    }
    if (measurements.so2) {
      const score = getAirQualityScore('so2', measurements.so2)
      qualityScores.push(score)
    }
    if (measurements.co) {
      const score = getAirQualityScore('co', measurements.co)
      qualityScores.push(score)
    }

    const worstScore = Math.max(...qualityScores)
    const overallQuality = getQualityLabel(worstScore)

    return {
      station: station,
      measurements: measurements,
      overallQuality: overallQuality,
      qualityScore: worstScore,
      hasData: Object.values(measurements).some(value => value !== null && value !== undefined)
    }
  }

  // AI classification algorithm
  const getAirQualityScore = (parameter, value) => {
    if (!value || typeof value !== 'number') return 0
    
    const thresholds = {
      pm25: { good: 15, moderate: 25, unhealthy: 35 },
      pm10: { good: 30, moderate: 50, unhealthy: 70 },
      o3: { good: 100, moderate: 160, unhealthy: 200 },
      no2: { good: 40, moderate: 80, unhealthy: 120 },
      so2: { good: 20, moderate: 40, unhealthy: 60 },
      co: { good: 4, moderate: 8, unhealthy: 12 }
    }

    const threshold = thresholds[parameter]
    if (!threshold) return 0

    if (value <= threshold.good) return 0
    if (value <= threshold.moderate) return 1
    if (value <= threshold.unhealthy) return 2
    return 3
  }

  const getQualityLabel = (score) => {
    const labels = {
      0: 'Good',
      1: 'Moderate', 
      2: 'Unhealthy',
      3: 'Hazardous'
    }
    return labels[score] || 'Unknown'
  }

  // AI response generation
  const generateAirQualityResponse = (airQuality) => {
    if (!airQuality || !airQuality.hasData) {
      return {
        text: "🌌 Unable to capture satellite signals now. Try again in a moment to get atmospheric data.",
        type: "no-data"
      }
    }

    const { overallQuality, measurements, station } = airQuality
    const stationName = station.name || 'Unknown Station'
    const location = `${station.city || 'N/A'}, ${station.country || 'N/A'}`

    let response = {
      text: "",
      type: overallQuality.toLowerCase(),
      station: stationName,
      location: location
    }

    switch (overallQuality) {
      case 'Good':
        response.text = `🚀✨ Excellent! Air quality in ${stationName} is GOOD! 
        
📊 Atmospheric data:
• PM2.5: ${measurements.pm25 ? measurements.pm25.toFixed(2) + ' μg/m³' : 'N/A'}
• PM10: ${measurements.pm10 ? measurements.pm10.toFixed(2) + ' μg/m³' : 'N/A'}
• O₃: ${measurements.o3 ? measurements.o3.toFixed(2) + ' μg/m³' : 'N/A'}

🌍 Ideal conditions for outdoor activities!`
        break

      case 'Moderate':
        response.text = `⚠️ Attention! Air quality in ${stationName} is MODERATE.

📊 Atmospheric data:
• PM2.5: ${measurements.pm25 ? measurements.pm25.toFixed(2) + ' μg/m³' : 'N/A'}
• PM10: ${measurements.pm10 ? measurements.pm10.toFixed(2) + ' μg/m³' : 'N/A'}
• O₃: ${measurements.o3 ? measurements.o3.toFixed(2) + ' μg/m³' : 'N/A'}

💡 Recommendation: Sensitive people should avoid prolonged outdoor activities.`
        break

      case 'Unhealthy':
        response.text = `🚨 ALERT! Air quality in ${stationName} is UNHEALTHY!

📊 Atmospheric data:
• PM2.5: ${measurements.pm25 ? measurements.pm25.toFixed(2) + ' μg/m³' : 'N/A'}
• PM10: ${measurements.pm10 ? measurements.pm10.toFixed(2) + ' μg/m³' : 'N/A'}
• O₃: ${measurements.o3 ? measurements.o3.toFixed(2) + ' μg/m³' : 'N/A'}

🛡️ PROTECTION NEEDED:
• Avoid outdoor activities
• Use N95 mask if necessary
• Keep windows closed`
        break

      case 'Hazardous':
        response.text = `🚨🚨 ATMOSPHERIC EMERGENCY! HAZARDOUS air quality in ${stationName}!

📊 Critical data:
• PM2.5: ${measurements.pm25 ? measurements.pm25.toFixed(2) + ' μg/m³' : 'N/A'}
• PM10: ${measurements.pm10 ? measurements.pm10.toFixed(2) + ' μg/m³' : 'N/A'}
• O₃: ${measurements.o3 ? measurements.o3.toFixed(2) + ' μg/m³' : 'N/A'}

🛡️ IMMEDIATE ACTIONS:
• STAY INDOORS
• Use air purifier
• N95 mask mandatory
• Avoid physical exercise`
        break

      default:
        response.text = `🌌 Atmospheric data unavailable at the moment. Apollo 11 Hackers system trying to reconnect...`
    }

    return response
  }

  // AI natural language processing
  const processUserMessage = async (userMessage) => {
    const lowerMessage = userMessage.toLowerCase()
    
    messages.value.push({
      id: Date.now(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    })

    isTyping.value = true

    await new Promise(resolve => setTimeout(resolve, 1500))

    let response = null

    const needsStationData = lowerMessage.includes('quality') || 
                           lowerMessage.includes('air') || 
                           lowerMessage.includes('pm2.5') || 
                           lowerMessage.includes('pm25') || 
                           lowerMessage.includes('pm10') || 
                           lowerMessage.includes('o3') || 
                           lowerMessage.includes('no2') || 
                           lowerMessage.includes('so2') || 
                           lowerMessage.includes('co') || 
                           lowerMessage.includes('exercise') || 
                           lowerMessage.includes('activity')

    if (needsStationData && !selectedStation.value) {
      response = {
        text: `🌌 ATTENTION! No monitoring station selected.

🎯 To get atmospheric data, you need to:

1. **Click on a station** on the global map
2. **Wait for data to load** in the interface
3. **Ask your question** again

📍 Available stations: ${stations.value.length} stations online

💡 Tip: Use the "CENTER MAP" button to see all available stations!`,
        type: "no-station"
      }
    } else if (lowerMessage.includes('quality') || lowerMessage.includes('air')) {
      const airQuality = getCurrentAirQuality()
      response = generateAirQualityResponse(airQuality)
    } else if (lowerMessage.includes('pm2.5') || lowerMessage.includes('pm25')) {
      const airQuality = getCurrentAirQuality()
      if (airQuality && airQuality.measurements.pm25) {
        const pm25Value = airQuality.measurements.pm25
        const pm25Score = getAirQualityScore('pm25', pm25Value)
        const pm25Label = getQualityLabel(pm25Score)
        
        response = {
          text: `📊 Current PM2.5: ${pm25Value.toFixed(2)} μg/m³
          
Status: ${pm25Label} ${pm25Score === 0 ? '🚀✨' : pm25Score === 1 ? '⚠️' : pm25Score === 2 ? '🚨' : '🚨🚨'}

${pm25Score === 0 ? 'Excellent! Fine particles at safe levels.' : 
  pm25Score === 1 ? 'Attention: Sensitive people should be careful.' :
  pm25Score === 2 ? 'Dangerous: Avoid outdoor activities.' :
  'CRITICAL: STAY INDOORS!'}`,
          type: pm25Label.toLowerCase()
        }
      } else {
        response = {
          text: "🌌 PM2.5 data unavailable at the moment. Apollo 11 Hackers system trying to reconnect...",
          type: "no-data"
        }
      }
    } else if (lowerMessage.includes('exercise') || lowerMessage.includes('activity')) {
      const airQuality = getCurrentAirQuality()
      if (airQuality && airQuality.hasData) {
        const { overallQuality } = airQuality
        if (overallQuality === 'Good') {
          response = {
            text: "🚀✨ PERFECT! Ideal conditions for outdoor exercise! Air quality is excellent.",
            type: "good"
          }
        } else if (overallQuality === 'Moderate') {
          response = {
            text: "⚠️ ATTENTION! Moderate quality. Light exercise is acceptable, but avoid intense activities.",
            type: "moderate"
          }
        } else {
          response = {
            text: "🚨 NOT RECOMMENDED! Air quality inadequate for exercise. Opt for indoor activities.",
            type: "unhealthy"
          }
        }
      } else {
        response = {
          text: "🌌 Cannot evaluate conditions for exercise. Atmospheric data unavailable.",
          type: "no-data"
        }
      }
    } else if (lowerMessage.includes('how to select') || lowerMessage.includes('select station')) {
      response = {
        text: `🎯 **STATION SELECTION GUIDE**

To get specific atmospheric data:

1. **📍 Locate blue markers** on the global map
2. **🖱️ Click any marker** to select the station
3. **⏳ Wait for data to load** in the main interface
4. **💬 Ask your question** about air quality

📍 **Available stations**: ${stations.value.length} stations online

💡 **Tips**:
• Use the "CENTER MAP" button to see all stations
• Blue markers = active stations
• Data appears in the side panel after selection

🚀 Ready to monitor the atmosphere!`,
        type: "help"
      }
    } else if (lowerMessage.includes('help')) {
      response = {
        text: `🚀 AI Apollo 11 Hackers - Available Commands:

• "How to select station?" - Selection guide
• "How is the air quality?" - General status
• "What's the PM2.5 level?" - Specific PM2.5 data
• "Is the quality good for exercise?" - Activity recommendations
• "Help" - This command list

🌍 Real-time atmospheric monitoring system!`,
        type: "help"
      }
    } else {
      response = {
        text: `🌌 Command not recognized by Apollo 11 Hackers system. 

Try asking about:
• Current air quality
• PM2.5 levels
• Exercise conditions
• Type "help" to see all commands`,
        type: "unknown"
      }
    }

    messages.value.push({
      id: Date.now() + 1,
      text: response.text,
      sender: 'system',
      timestamp: new Date(),
      type: response.type,
      station: response.station,
      location: response.location
    })

    isTyping.value = false
  }

  const sendMessage = (message) => {
    if (message.trim()) {
      processUserMessage(message)
    }
  }

  const initializeChat = () => {
    messages.value = [{
      id: 1,
      text: `🚀 Welcome to Apollo 11 Hackers System!

I'm your atmospheric monitoring AI. I can help you with:

• Air quality status
• Specific pollutant data  
• Activity recommendations
• Safety alerts

🎯 **IMPORTANT**: To get specific data, first select a station on the map by clicking the blue markers.

📍 Available stations: ${stations.value.length} stations online

How can I assist your mission today?`,
      sender: 'system',
      timestamp: new Date(),
      type: 'welcome'
    }]
  }

  return {
    messages,
    isTyping,
    sendMessage,
    initializeChat,
    getCurrentAirQuality
  }
}
