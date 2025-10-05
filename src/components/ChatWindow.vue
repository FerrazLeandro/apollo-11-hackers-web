<template>
  <div class="chat-window-container" v-if="isOpen">
    <div class="chat-window nasa-style">
      <!-- Header -->
      <div class="chat-header nasa-header">
        <div class="header-content">
          <div class="header-icon">
            <span class="icon-text">IA</span>
          </div>
          <div class="header-text">
            <h3>IA Apollo 11 Hackers</h3>
            <p>Sistema de Monitoramento Atmosférico</p>
          </div>
        </div>
        <button @click="closeChat" class="close-button nasa-btn">
          <span class="btn-icon">✕</span>
        </button>
      </div>

      <!-- Messages Area -->
      <div class="chat-messages" ref="messagesContainer">
        <div 
          v-for="message in messages" 
          :key="message.id"
          class="message"
          :class="[`message-${message.sender}`, `message-${message.type || 'default'}`]"
        >
          <div class="message-content">
            <div class="message-text" v-html="formatMessage(message.text)"></div>
            <div class="message-meta">
              <span class="message-time">{{ formatTime(message.timestamp) }}</span>
              <span v-if="message.station" class="message-station">{{ message.station }}</span>
            </div>
          </div>
        </div>
        
        <!-- Typing Indicator -->
        <div v-if="isTyping" class="message message-system message-typing">
          <div class="message-content">
            <div class="typing-indicator">
              <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span class="typing-text">IA Apollo 11 Hackers está processando...</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="chat-input-area">
        <div class="input-container">
          <input 
            v-model="inputMessage"
            @keypress.enter="handleSendMessage"
            placeholder="Digite sua pergunta sobre a qualidade do ar..."
            class="chat-input nasa-input"
            :disabled="isTyping"
          />
          <button 
            @click="handleSendMessage"
            :disabled="!inputMessage.trim() || isTyping"
            class="send-button nasa-btn primary"
          >
            <span class="btn-icon">🚀</span>
          </button>
        </div>
        <div class="quick-actions">
          <button 
            v-for="action in quickActions" 
            :key="action.text"
            @click="sendQuickMessage(action.text)"
            class="quick-action-btn nasa-btn secondary"
            :disabled="isTyping"
          >
            {{ action.text }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, nextTick, watch } from 'vue'

export default {
  name: 'ChatWindow',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    messages: {
      type: Array,
      default: () => []
    },
    isTyping: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'send-message'],
  setup(props, { emit }) {
    const inputMessage = ref('')
    const messagesContainer = ref(null)

    const quickActions = [
      { text: 'Qualidade do ar?' },
      { text: 'PM2.5 atual?' },
      { text: 'Bom para exercícios?' }
    ]

    const closeChat = () => {
      emit('close')
    }

    const handleSendMessage = () => {
      if (inputMessage.value.trim() && !props.isTyping) {
        emit('send-message', inputMessage.value.trim())
        inputMessage.value = ''
      }
    }

    const sendQuickMessage = (text) => {
      emit('send-message', text)
    }

    const formatMessage = (text) => {
      // Converter quebras de linha para <br>
      return text.replace(/\n/g, '<br>')
    }

    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // Auto scroll para baixo quando novas mensagens chegam
    const scrollToBottom = () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
      })
    }

    watch(() => props.messages.length, () => {
      scrollToBottom()
    })

    watch(() => props.isTyping, () => {
      scrollToBottom()
    })

    return {
      inputMessage,
      messagesContainer,
      quickActions,
      closeChat,
      handleSendMessage,
      sendQuickMessage,
      formatMessage,
      formatTime
    }
  }
}
</script>

<style scoped>
.chat-window-container {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 400px;
  height: 600px;
  z-index: 999;
}

.chat-window.nasa-style {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(26, 26, 46, 0.95) 100%);
  border: 2px solid #00d4ff;
  border-radius: 20px;
  backdrop-filter: blur(20px);
  box-shadow: 0 10px 40px rgba(0, 212, 255, 0.3);
  overflow: hidden;
}

/* Header */
.chat-header.nasa-header {
  background: linear-gradient(90deg, #1a1a2e 0%, #16213e 100%);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #00d4ff;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, #00d4ff, #0099cc);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #00d4ff;
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.5);
}

.header-icon .icon-text {
  font-family: 'Orbitron', monospace;
  font-weight: 900;
  font-size: 1rem;
  color: #000000;
}

.header-text h3 {
  font-family: 'Orbitron', monospace;
  color: #00d4ff;
  font-size: 1.1rem;
  margin: 0;
  text-shadow: 0 0 10px #00d4ff;
}

.header-text p {
  font-family: 'Exo 2', sans-serif;
  color: #ffffff;
  font-size: 0.8rem;
  margin: 0;
  opacity: 0.8;
}

.close-button.nasa-btn {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: rgba(255, 0, 0, 0.2);
  border: 2px solid #ff4444;
  color: #ff4444;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-button.nasa-btn:hover {
  background: #ff4444;
  color: #000000;
  box-shadow: 0 0 15px rgba(255, 68, 68, 0.5);
}

/* Messages Area */
.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(0, 212, 255, 0.1);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #00d4ff;
  border-radius: 3px;
}

.message {
  display: flex;
  max-width: 85%;
}

.message-user {
  align-self: flex-end;
  margin-left: auto;
}

.message-system {
  align-self: flex-start;
}

.message-content {
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid #00d4ff;
  border-radius: 15px;
  padding: 15px;
  backdrop-filter: blur(10px);
  position: relative;
}

.message-user .message-content {
  background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
  color: #000000;
  border-color: #00d4ff;
}

.message-system .message-content {
  background: rgba(0, 212, 255, 0.1);
  color: #ffffff;
  border-color: #00d4ff;
}

.message-text {
  font-family: 'Exo 2', sans-serif;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 8px;
}

.message-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.7rem;
  opacity: 0.7;
}

.message-time {
  font-family: 'Orbitron', monospace;
}

.message-station {
  font-family: 'Exo 2', sans-serif;
  font-weight: 600;
}

/* Message Types */
.message-good .message-content {
  border-color: #00ff88;
  background: rgba(0, 255, 136, 0.1);
}

.message-moderate .message-content {
  border-color: #ffaa00;
  background: rgba(255, 170, 0, 0.1);
}

.message-ruim .message-content,
.message-unhealthy .message-content {
  border-color: #ff4444;
  background: rgba(255, 68, 68, 0.1);
}

.message-perigosa .message-content,
.message-hazardous .message-content {
  border-color: #ff0000;
  background: rgba(255, 0, 0, 0.1);
  animation: alert-pulse 2s ease-in-out infinite;
}

@keyframes alert-pulse {
  0%, 100% { box-shadow: 0 0 10px rgba(255, 0, 0, 0.3); }
  50% { box-shadow: 0 0 20px rgba(255, 0, 0, 0.6); }
}

.message-welcome .message-content {
  border-color: #00d4ff;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(26, 26, 46, 0.8) 100%);
}

.message-help .message-content {
  border-color: #9c27b0;
  background: rgba(156, 39, 176, 0.1);
}

.message-no-data .message-content {
  border-color: #888888;
  background: rgba(136, 136, 136, 0.1);
}

/* Typing Indicator */
.message-typing .message-content {
  background: rgba(0, 212, 255, 0.05);
  border-style: dashed;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  background: #00d4ff;
  border-radius: 50%;
  animation: typing-bounce 1.4s ease-in-out infinite both;
}

.typing-dots span:nth-child(1) { animation-delay: -0.32s; }
.typing-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing-bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.typing-text {
  font-family: 'Exo 2', sans-serif;
  font-size: 0.8rem;
  color: #00d4ff;
  font-style: italic;
}

/* Input Area */
.chat-input-area {
  padding: 20px;
  background: linear-gradient(90deg, #1a1a2e 0%, #16213e 100%);
  border-top: 2px solid #00d4ff;
}

.input-container {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.chat-input.nasa-input {
  flex: 1;
  padding: 12px 15px;
  background: rgba(0, 212, 255, 0.1);
  border: 2px solid #00d4ff;
  border-radius: 25px;
  color: #ffffff;
  font-family: 'Exo 2', sans-serif;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.3s ease;
}

.chat-input.nasa-input:focus {
  background: rgba(0, 212, 255, 0.2);
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
}

.chat-input.nasa-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.send-button.nasa-btn {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(45deg, #00d4ff, #0099cc);
  border: 2px solid #00d4ff;
  color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.send-button.nasa-btn:hover:not(:disabled) {
  background: linear-gradient(45deg, #00b8e6, #0088bb);
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
  transform: scale(1.1);
}

.send-button.nasa-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Quick Actions */
.quick-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.quick-action-btn.nasa-btn {
  padding: 8px 12px;
  font-size: 0.8rem;
  border-radius: 20px;
  background: transparent;
  border: 1px solid #00d4ff;
  color: #00d4ff;
  font-family: 'Exo 2', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-action-btn.nasa-btn:hover:not(:disabled) {
  background: rgba(0, 212, 255, 0.1);
  transform: translateY(-2px);
}

.quick-action-btn.nasa-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .chat-window-container {
    bottom: 80px;
    right: 10px;
    left: 10px;
    width: auto;
    height: 500px;
  }
  
  .chat-header.nasa-header {
    padding: 15px;
  }
  
  .header-text h3 {
    font-size: 1rem;
  }
  
  .header-text p {
    font-size: 0.7rem;
  }
  
  .chat-messages {
    padding: 15px;
  }
  
  .chat-input-area {
    padding: 15px;
  }
  
  .quick-actions {
    gap: 6px;
  }
  
  .quick-action-btn.nasa-btn {
    padding: 6px 10px;
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .chat-window-container {
    height: 450px;
    bottom: 70px;
  }
  
  .message {
    max-width: 90%;
  }
  
  .message-text {
    font-size: 0.8rem;
  }
}
</style>
