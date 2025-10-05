<template>
  <div class="chat-button-container">
    <button 
      @click="toggleChat"
      class="chat-button nasa-style"
      :class="{ 'chat-button-open': isOpen }"
    >
      <div class="button-content">
        <div class="button-icon">
          <span class="icon-text">IA</span>
        </div>
        <div class="button-text">
          <span class="main-text">Apollo 11</span>
          <span class="sub-text">Hackers</span>
        </div>
      </div>
      <div class="button-glow"></div>
    </button>
  </div>
</template>

<script>
export default {
  name: 'ChatButton',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle'],
  setup(props, { emit }) {
    const toggleChat = () => {
      emit('toggle')
    }

    return {
      toggleChat
    }
  }
}
</script>

<style scoped>
.chat-button-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.chat-button.nasa-style {
  position: relative;
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
  border: 2px solid #00d4ff;
  border-radius: 50px;
  color: #000000;
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4);
  overflow: hidden;
  min-width: 200px;
  height: 60px;
}

.chat-button.nasa-style:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 30px rgba(0, 212, 255, 0.6);
  background: linear-gradient(135deg, #00d4ff 0%, #00b8e6 100%);
}

.chat-button.nasa-style:active {
  transform: translateY(-1px) scale(1.02);
}

.chat-button-open.nasa-style {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
  border-color: #ff6b6b;
  box-shadow: 0 4px 20px rgba(255, 107, 107, 0.4);
}

.chat-button-open.nasa-style:hover {
  background: linear-gradient(135deg, #ff5252 0%, #ff4444 100%);
  box-shadow: 0 8px 30px rgba(255, 107, 107, 0.6);
}

.button-content {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 2;
}

.button-icon {
  width: 35px;
  height: 35px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(0, 0, 0, 0.3);
}

.icon-text {
  font-family: 'Orbitron', monospace;
  font-weight: 900;
  font-size: 0.8rem;
  color: #000000;
}

.button-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.1;
}

.main-text {
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  font-size: 0.9rem;
  color: #000000;
  letter-spacing: 1px;
}

.sub-text {
  font-family: 'Exo 2', sans-serif;
  font-weight: 600;
  font-size: 0.7rem;
  color: #000000;
  opacity: 0.8;
  letter-spacing: 0.5px;
}

.button-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  border-radius: 50px;
  opacity: 0;
  transition: opacity 0.3s ease;
  animation: button-shine 3s ease-in-out infinite;
}

.chat-button.nasa-style:hover .button-glow {
  opacity: 1;
}

@keyframes button-shine {
  0%, 100% { 
    transform: translateX(-100%); 
    opacity: 0;
  }
  50% { 
    transform: translateX(100%); 
    opacity: 0.3;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .chat-button-container {
    bottom: 15px;
    right: 15px;
  }
  
  .chat-button.nasa-style {
    min-width: 160px;
    height: 50px;
    padding: 12px 16px;
    font-size: 0.8rem;
  }
  
  .button-icon {
    width: 30px;
    height: 30px;
  }
  
  .icon-text {
    font-size: 0.7rem;
  }
  
  .main-text {
    font-size: 0.8rem;
  }
  
  .sub-text {
    font-size: 0.6rem;
  }
}

@media (max-width: 480px) {
  .chat-button-container {
    bottom: 10px;
    right: 10px;
  }
  
  .chat-button.nasa-style {
    min-width: 140px;
    height: 45px;
    padding: 10px 14px;
  }
  
  .button-text {
    display: none; /* Hide text on very small screens, show only icon */
  }
  
  .chat-button.nasa-style {
    min-width: 50px;
    width: 50px;
    justify-content: center;
  }
}
</style>
