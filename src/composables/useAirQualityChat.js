import { ref, computed } from 'vue'

export function useAirQualityChat(stations, selectedStation) {
  const messages = ref([])
  const isTyping = ref(false)

  // Função para obter dados da estação atual
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

    // Calcular qualidade geral baseada no pior parâmetro
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

  // Função para calcular score de qualidade (0-3: boa, moderada, ruim, perigosa)
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
      0: 'Boa',
      1: 'Moderada', 
      2: 'Ruim',
      3: 'Perigosa'
    }
    return labels[score] || 'Desconhecida'
  }

  // Função para gerar resposta baseada na qualidade do ar
  const generateAirQualityResponse = (airQuality) => {
    if (!airQuality || !airQuality.hasData) {
      return {
        text: "🌌 Não consegui captar sinais do satélite agora. Tente novamente em instantes para obter dados atmosféricos.",
        type: "no-data"
      }
    }

    const { overallQuality, measurements, station } = airQuality
    const stationName = station.name || 'Estação Desconhecida'
    const location = `${station.city || 'N/A'}, ${station.country || 'N/A'}`

    let response = {
      text: "",
      type: overallQuality.toLowerCase(),
      station: stationName,
      location: location
    }

    switch (overallQuality) {
      case 'Boa':
        response.text = `🚀✨ Excelente! A qualidade do ar em ${stationName} está BOA! 
        
📊 Dados atmosféricos:
• PM2.5: ${measurements.pm25 ? measurements.pm25.toFixed(2) + ' μg/m³' : 'N/A'}
• PM10: ${measurements.pm10 ? measurements.pm10.toFixed(2) + ' μg/m³' : 'N/A'}
• O₃: ${measurements.o3 ? measurements.o3.toFixed(2) + ' μg/m³' : 'N/A'}

🌍 Condições ideais para atividades ao ar livre!`
        break

      case 'Moderada':
        response.text = `⚠️ Atenção! A qualidade do ar em ${stationName} está MODERADA.

📊 Dados atmosféricos:
• PM2.5: ${measurements.pm25 ? measurements.pm25.toFixed(2) + ' μg/m³' : 'N/A'}
• PM10: ${measurements.pm10 ? measurements.pm10.toFixed(2) + ' μg/m³' : 'N/A'}
• O₃: ${measurements.o3 ? measurements.o3.toFixed(2) + ' μg/m³' : 'N/A'}

💡 Recomendação: Pessoas sensíveis devem evitar atividades prolongadas ao ar livre.`
        break

      case 'Ruim':
        response.text = `🚨 ALERTA! A qualidade do ar em ${stationName} está RUIM!

📊 Dados atmosféricos:
• PM2.5: ${measurements.pm25 ? measurements.pm25.toFixed(2) + ' μg/m³' : 'N/A'}
• PM10: ${measurements.pm10 ? measurements.pm10.toFixed(2) + ' μg/m³' : 'N/A'}
• O₃: ${measurements.o3 ? measurements.o3.toFixed(2) + ' μg/m³' : 'N/A'}

🛡️ PROTEÇÃO NECESSÁRIA:
• Evite atividades ao ar livre
• Use máscara N95 se necessário
• Mantenha janelas fechadas`
        break

      case 'Perigosa':
        response.text = `🚨🚨 EMERGÊNCIA ATMOSFÉRICA! Qualidade do ar PERIGOSA em ${stationName}!

📊 Dados críticos:
• PM2.5: ${measurements.pm25 ? measurements.pm25.toFixed(2) + ' μg/m³' : 'N/A'}
• PM10: ${measurements.pm10 ? measurements.pm10.toFixed(2) + ' μg/m³' : 'N/A'}
• O₃: ${measurements.o3 ? measurements.o3.toFixed(2) + ' μg/m³' : 'N/A'}

🛡️ AÇÕES IMEDIATAS:
• PERMANEÇA EM CASA
• Use purificador de ar
• Máscara N95 obrigatória
• Evite exercícios físicos`
        break

      default:
        response.text = `🌌 Dados atmosféricos indisponíveis no momento. Sistema Apollo 11 Hackers tentando reconectar...`
    }

    return response
  }

  // Função para processar mensagem do usuário
  const processUserMessage = async (userMessage) => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Adicionar mensagem do usuário
    messages.value.push({
      id: Date.now(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    })

    isTyping.value = true

    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1500))

    let response = null

    // Verificar se há estação selecionada para perguntas sobre dados
    const needsStationData = lowerMessage.includes('qualidade') || 
                           lowerMessage.includes('ar') || 
                           lowerMessage.includes('pm2.5') || 
                           lowerMessage.includes('pm25') || 
                           lowerMessage.includes('pm10') || 
                           lowerMessage.includes('o3') || 
                           lowerMessage.includes('no2') || 
                           lowerMessage.includes('so2') || 
                           lowerMessage.includes('co') || 
                           lowerMessage.includes('exercício') || 
                           lowerMessage.includes('atividade')

    if (needsStationData && !selectedStation.value) {
      response = {
        text: `🌌 ATENÇÃO! Nenhuma estação de monitoramento selecionada.

🎯 Para obter dados atmosféricos, você precisa:

1. **Clique em uma estação** no mapa global
2. **Aguarde os dados carregarem** na interface
3. **Faça sua pergunta** novamente

📍 Estações disponíveis: ${stations.value.length} estações online

💡 Dica: Use o botão "CENTER MAP" para ver todas as estações disponíveis!`,
        type: "no-station"
      }
    } else if (lowerMessage.includes('qualidade') || lowerMessage.includes('ar')) {
      const airQuality = getCurrentAirQuality()
      response = generateAirQualityResponse(airQuality)
    } else if (lowerMessage.includes('pm2.5') || lowerMessage.includes('pm25')) {
      const airQuality = getCurrentAirQuality()
      if (airQuality && airQuality.measurements.pm25) {
        const pm25Value = airQuality.measurements.pm25
        const pm25Score = getAirQualityScore('pm25', pm25Value)
        const pm25Label = getQualityLabel(pm25Score)
        
        response = {
          text: `📊 PM2.5 atual: ${pm25Value.toFixed(2)} μg/m³
          
Status: ${pm25Label} ${pm25Score === 0 ? '🚀✨' : pm25Score === 1 ? '⚠️' : pm25Score === 2 ? '🚨' : '🚨🚨'}

${pm25Score === 0 ? 'Excelente! Partículas finas em níveis seguros.' : 
  pm25Score === 1 ? 'Atenção: Pessoas sensíveis devem ter cuidado.' :
  pm25Score === 2 ? 'Perigoso: Evite atividades ao ar livre.' :
  'CRÍTICO: PERMANEÇA EM CASA!'}`,
          type: pm25Label.toLowerCase()
        }
      } else {
        response = {
          text: "🌌 Dados de PM2.5 não disponíveis no momento. Sistema Apollo 11 Hackers tentando reconectar...",
          type: "no-data"
        }
      }
    } else if (lowerMessage.includes('exercício') || lowerMessage.includes('atividade')) {
      const airQuality = getCurrentAirQuality()
      if (airQuality && airQuality.hasData) {
        const { overallQuality } = airQuality
        if (overallQuality === 'Boa') {
          response = {
            text: "🚀✨ PERFEITO! Condições ideais para exercícios ao ar livre! A qualidade do ar está excelente.",
            type: "good"
          }
        } else if (overallQuality === 'Moderada') {
          response = {
            text: "⚠️ ATENÇÃO! Qualidade moderada. Exercícios leves são aceitáveis, mas evite atividades intensas.",
            type: "moderate"
          }
        } else {
          response = {
            text: "🚨 NÃO RECOMENDADO! Qualidade do ar inadequada para exercícios. Opte por atividades indoor.",
            type: "unhealthy"
          }
        }
      } else {
        response = {
          text: "🌌 Não consigo avaliar as condições para exercícios. Dados atmosféricos indisponíveis.",
          type: "no-data"
        }
      }
    } else if (lowerMessage.includes('como selecionar') || lowerMessage.includes('selecionar estação')) {
      response = {
        text: `🎯 **GUIA DE SELEÇÃO DE ESTAÇÃO**

Para obter dados atmosféricos específicos:

1. **📍 Localize os marcadores azuis** no mapa global
2. **🖱️ Clique em qualquer marcador** para selecionar a estação
3. **⏳ Aguarde os dados carregarem** na interface principal
4. **💬 Faça sua pergunta** sobre qualidade do ar

📍 **Estações disponíveis**: ${stations.value.length} estações online

💡 **Dicas**:
• Use o botão "CENTER MAP" para ver todas as estações
• Marcadores azuis = estações ativas
• Dados aparecem no painel lateral após seleção

🚀 Pronto para monitorar a atmosfera!`,
        type: "help"
      }
    } else if (lowerMessage.includes('ajuda') || lowerMessage.includes('help')) {
      response = {
        text: `🚀 IA Apollo 11 Hackers - Comandos Disponíveis:

• "Como selecionar estação?" - Guia de seleção
• "Como está a qualidade do ar?" - Status geral
• "E o nível de PM2.5?" - Dados específicos de PM2.5
• "A qualidade está boa para exercícios?" - Recomendação para atividades
• "Ajuda" - Esta lista de comandos

🌍 Sistema de monitoramento atmosférico em tempo real!`,
        type: "help"
      }
    } else {
      response = {
        text: `🌌 Comando não reconhecido pelo sistema Apollo 11 Hackers. 

Tente perguntar sobre:
• Qualidade do ar atual
• Níveis de PM2.5
• Condições para exercícios
• Digite "ajuda" para ver todos os comandos`,
        type: "unknown"
      }
    }

    // Adicionar resposta do sistema
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

  // Função para enviar mensagem
  const sendMessage = (message) => {
    if (message.trim()) {
      processUserMessage(message)
    }
  }

  // Mensagem inicial
  const initializeChat = () => {
    messages.value = [{
      id: 1,
      text: `🚀 Bem-vindo ao Sistema Apollo 11 Hackers!

Sou sua IA de monitoramento atmosférico. Posso te ajudar com:

• Status da qualidade do ar
• Dados específicos de poluentes  
• Recomendações para atividades
• Alertas de segurança

🎯 **IMPORTANTE**: Para obter dados específicos, primeiro selecione uma estação no mapa clicando nos marcadores azuis.

📍 Estações disponíveis: ${stations.value.length} estações online

Como posso assistir sua missão hoje?`,
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
