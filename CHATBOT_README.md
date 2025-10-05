# 🤖 Chatbot IA Apollo 11 Hackers

## Visão Geral

O chatbot flutuante **IA Apollo 11 Hackers** é um assistente inteligente integrado ao sistema de monitoramento de qualidade do ar. Ele utiliza os dados em tempo real da API OpenAQ para fornecer informações precisas sobre condições atmosféricas.

## 🚀 Funcionalidades

### Botão Flutuante
- **Posição**: Canto inferior direito da tela
- **Design**: Estilo NASA com cores #00d4ff e tipografia Orbitron/Exo 2
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Animações**: Efeitos de brilho e pulsação estilo espacial

### Janela de Chat
- **Interface Futurista**: Tema espacial com fundo estrelado
- **Mensagens Inteligentes**: Respostas baseadas em dados reais da qualidade do ar
- **Indicador de Digitação**: Animação de satélite orbitando
- **Ações Rápidas**: Botões para perguntas comuns

## 🧠 Inteligência do Chatbot

### Dados Utilizados
O chatbot acessa automaticamente:
- **Estações Ativas**: Lista de estações de monitoramento
- **Estação Selecionada**: Dados da estação atualmente selecionada
- **Medições**: PM2.5, PM10, O₃, NO₂, SO₂, CO
- **Classificação**: Boa, Moderada, Ruim, Perigosa

### Tipos de Resposta

#### 🌟 Qualidade Boa
```
🚀✨ Excelente! A qualidade do ar está BOA!
📊 Dados atmosféricos: [valores]
🌍 Condições ideais para atividades ao ar livre!
```

#### ⚠️ Qualidade Moderada
```
⚠️ Atenção! A qualidade do ar está MODERADA.
📊 Dados atmosféricos: [valores]
💡 Recomendação: Pessoas sensíveis devem evitar atividades prolongadas.
```

#### 🚨 Qualidade Ruim/Perigosa
```
🚨 ALERTA! Qualidade do ar RUIM/PERIGOSA!
📊 Dados críticos: [valores]
🛡️ PROTEÇÃO NECESSÁRIA: [recomendações]
```

#### 🌌 Sem Dados
```
🌌 Não consegui captar sinais do satélite agora.
Tente novamente em instantes para obter dados atmosféricos.
```

## 💬 Comandos Disponíveis

### Perguntas Principais
- **"Como selecionar estação?"** - Guia passo a passo para seleção
- **"Como está a qualidade do ar?"** - Status geral da estação selecionada
- **"E o nível de PM2.5?"** - Dados específicos de partículas finas
- **"A qualidade está boa para exercícios?"** - Recomendação para atividades físicas
- **"Ajuda"** - Lista de comandos disponíveis

### Exemplos de Interação

#### Usuário: "Como selecionar estação?"
**IA Apollo 11 Hackers**:
```
🎯 **GUIA DE SELEÇÃO DE ESTAÇÃO**

Para obter dados atmosféricos específicos:

1. **📍 Localize os marcadores azuis** no mapa global
2. **🖱️ Clique em qualquer marcador** para selecionar a estação
3. **⏳ Aguarde os dados carregarem** na interface principal
4. **💬 Faça sua pergunta** sobre qualidade do ar

📍 **Estações disponíveis**: 5 estações online

💡 **Dicas**:
• Use o botão "CENTER MAP" para ver todas as estações
• Marcadores azuis = estações ativas
• Dados aparecem no painel lateral após seleção

🚀 Pronto para monitorar a atmosfera!
```

#### Usuário: "Como está a qualidade do ar?" (sem estação selecionada)
**IA Apollo 11 Hackers**:
```
🌌 ATENÇÃO! Nenhuma estação de monitoramento selecionada.

🎯 Para obter dados atmosféricos, você precisa:

1. **Clique em uma estação** no mapa global
2. **Aguarde os dados carregarem** na interface
3. **Faça sua pergunta** novamente

📍 Estações disponíveis: 5 estações online

💡 Dica: Use o botão "CENTER MAP" para ver todas as estações disponíveis!
```

#### Usuário: "Como está a qualidade do ar?" (com estação selecionada)
**IA Apollo 11 Hackers**: 
```
🚀✨ Excelente! A qualidade do ar em São Paulo - Centro está BOA!

📊 Dados atmosféricos:
• PM2.5: 18.50 μg/m³
• PM10: 32.10 μg/m³
• O₃: 85.20 μg/m³

🌍 Condições ideais para atividades ao ar livre!
```

#### Usuário: "E o nível de PM2.5?"
**IA Apollo 11 Hackers**:
```
📊 PM2.5 atual: 18.50 μg/m³

Status: Boa 🚀✨

Excelente! Partículas finas em níveis seguros.
```

#### Usuário: "A qualidade está boa para exercícios?"
**IA Apollo 11 Hackers**:
```
🚀✨ PERFEITO! Condições ideais para exercícios ao ar livre! 
A qualidade do ar está excelente.
```

## 🛠️ Arquitetura Técnica

### Componentes
- **`ChatButton.vue`**: Botão flutuante com animações
- **`ChatWindow.vue`**: Janela de chat com interface completa
- **`useAirQualityChat.js`**: Composable com lógica de processamento

### Integração
- **Estado Compartilhado**: Acessa `stations` e `selectedStation` do App.vue
- **Tempo Real**: Respostas baseadas nos dados atuais do sistema
- **Reatividade**: Atualiza automaticamente quando dados mudam

### Processamento de Dados
1. **Análise da Estação**: Verifica estação selecionada
2. **Cálculo de Qualidade**: Usa padrões da OMS para classificar
3. **Geração de Resposta**: Cria mensagem personalizada
4. **Formatação**: Aplica estilo NASA e emojis apropriados

## 🎨 Design System

### Cores
- **Primária**: #00d4ff (Azul NASA)
- **Fundo**: Gradiente espacial preto/azul
- **Texto**: Branco com opacidade variável
- **Status**: Verde (boa), Amarelo (moderada), Vermelho (ruim/perigosa)

### Tipografia
- **Títulos**: Orbitron (futurista)
- **Corpo**: Exo 2 (legível)
- **Botões**: Orbitron (impacto visual)

### Animações
- **Botão**: Pulsação e brilho
- **Mensagens**: Fade-in suave
- **Digitação**: Satélite orbitando
- **Hover**: Efeitos de elevação

## 📱 Responsividade

### Desktop (>768px)
- Botão completo com texto
- Janela 400x600px
- Posição fixa canto inferior direito

### Tablet (768px)
- Botão adaptado
- Janela responsiva
- Margens ajustadas

### Mobile (<480px)
- Botão apenas ícone
- Janela full-width
- Otimizações touch

## ♿ Acessibilidade

### Recursos Implementados
- **Foco Visível**: Outline azul nos elementos focáveis
- **Contraste Alto**: Suporte para modo de alto contraste
- **Movimento Reduzido**: Respeita preferências de animação
- **Navegação por Teclado**: Tab e Enter funcionais

### Boas Práticas
- Textos descritivos em botões
- Estados de loading claros
- Mensagens de erro informativas
- Cores com significado semântico

## 🔧 Configuração

### Variáveis de Ambiente
Nenhuma configuração adicional necessária. O chatbot utiliza:
- Dados existentes do sistema OpenAQ
- Configurações de API já estabelecidas
- Estado reativo do Vue.js

### Personalização
Para modificar comportamento:
1. **Lógica**: Editar `useAirQualityChat.js`
2. **Interface**: Modificar componentes Vue
3. **Estilos**: Ajustar CSS no `style.css`

## 🚀 Uso

### Ativação
1. Clique no botão flutuante "IA Apollo 11 Hackers"
2. A janela de chat abre automaticamente
3. Digite sua pergunta ou use ações rápidas

### Interação
1. **Selecione uma estação** no mapa para dados específicos
2. **Faça perguntas** sobre qualidade do ar
3. **Use ações rápidas** para perguntas comuns
4. **Feche** clicando no X ou fora da janela

## 🎯 Casos de Uso

### Monitoramento Pessoal
- Verificar qualidade do ar antes de sair
- Avaliar condições para exercícios
- Receber alertas de poluição

### Pesquisa Ambiental
- Acessar dados específicos de poluentes
- Comparar condições entre estações
- Obter informações técnicas detalhadas

### Educação
- Aprender sobre qualidade do ar
- Entender impactos na saúde
- Conhecer padrões da OMS

---

**Desenvolvido com ❤️ pelos Apollo 11 Hackers**

*Sistema de monitoramento atmosférico em tempo real com IA integrada*
