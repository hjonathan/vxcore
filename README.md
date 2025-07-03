# VXCore - Gemini API Server

Un servidor Node.js Express para hacer consultas a la API de Google Gemini AI usando la nueva librería `@google/genai`.

## Características

- 🤖 Integración con Google's Generative AI (Gemini) usando `@google/genai`
- 💬 Endpoint de chat para generación de texto
- 🌊 Endpoint de streaming para respuestas en tiempo real
- 🗣️ Endpoint de conversación multi-turno
- 👁️ Endpoint de análisis de imágenes (visión)
- 📋 Endpoint para listar modelos disponibles
- 🏥 Endpoint de health check
- 🔒 Configuración con variables de entorno
- 🛡️ CORS habilitado para requests cross-origin
- ⚡ Manejo de errores y validación

## Setup

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configuración del Entorno

Copia la plantilla de entorno y agrega tu API key de Gemini:

```bash
cp env.example .env
```

Edita `.env` y agrega tu API key de Gemini:
```
GEMINI_API_KEY=tu_api_key_aqui
PORT=3000
```

### 3. Obtener API Key de Gemini

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API key
3. Copia la key a tu archivo `.env`

### 4. Ejecutar el Servidor

**Modo desarrollo (con auto-restart):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

**Ejecutar el ejemplo simple:**
```bash
npm run start:main
```

El servidor iniciará en `http://localhost:3000` (o el PORT especificado en tu .env).

## Endpoints de la API

### Health Check
```
GET /health
```
Retorna el estado del servidor y timestamp.

**Respuesta:**
```json
{
  "status": "OK",
  "message": "Gemini API Server is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Chat
```
POST /chat
```
Envía un mensaje a Gemini y obtén una respuesta.

**Request Body:**
```json
{
  "message": "Hola, ¿cómo estás?",
  "model": "gemini-2.5-flash"  // opcional, por defecto gemini-2.5-flash
}
```

**Respuesta:**
```json
{
  "success": true,
  "response": "¡Hola! Estoy bien, gracias por preguntar...",
  "model": "gemini-2.5-flash",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Streaming Chat
```
POST /chat/stream
```
Obtén una respuesta streaming de Gemini (generación de texto en tiempo real).

**Request Body:**
```json
{
  "message": "Cuéntame una historia",
  "model": "gemini-2.5-flash"  // opcional, por defecto gemini-2.5-flash
}
```

**Respuesta:** Transmite chunks de texto directamente al cliente.

### Conversación Multi-turno
```
POST /conversation
```
Mantén una conversación con historial de mensajes.

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "parts": [{ "text": "Hola, ¿cómo te llamas?" }]
    },
    {
      "role": "model",
      "parts": [{ "text": "Me llamo Gemini, ¿en qué puedo ayudarte?" }]
    },
    {
      "role": "user",
      "parts": [{ "text": "¿Puedes explicarme qué es la IA?" }]
    }
  ],
  "model": "gemini-2.5-flash"  // opcional
}
```

**Respuesta:**
```json
{
  "success": true,
  "response": "La inteligencia artificial (IA) es...",
  "model": "gemini-2.5-flash",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Análisis de Imágenes (Visión)
```
POST /vision
```
Analiza imágenes con texto descriptivo.

**Request Body:**
```json
{
  "message": "¿Qué hay en esta imagen?",
  "imageData": "base64_encoded_image_data",
  "model": "gemini-2.5-flash"  // opcional
}
```

**Respuesta:**
```json
{
  "success": true,
  "response": "En esta imagen veo...",
  "model": "gemini-2.5-flash",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Modelos Disponibles
```
GET /models
```
Obtén una lista de modelos disponibles de Gemini.

**Respuesta:**
```json
{
  "success": true,
  "models": [...]
}
```

## Ejemplos de Uso

### Usando curl

**Health check:**
```bash
curl http://localhost:3000/health
```

**Chat request:**
```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "¿Cuál es la capital de Francia?"}'
```

**Streaming chat:**
```bash
curl -X POST http://localhost:3000/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"message": "Escribe un poema corto sobre programación"}'
```

**Conversación:**
```bash
curl -X POST http://localhost:3000/conversation \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "parts": [{"text": "Hola"}]},
      {"role": "model", "parts": [{"text": "¡Hola! ¿En qué puedo ayudarte?"}]},
      {"role": "user", "parts": [{"text": "¿Qué es la programación?"}]}
    ]
  }'
```

### Usando JavaScript/Fetch

```javascript
// Chat regular
const response = await fetch('http://localhost:3000/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'Explica la computación cuántica en términos simples'
  })
});

const data = await response.json();
console.log(data.response);

// Streaming chat
const streamResponse = await fetch('http://localhost:3000/chat/stream', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'Escribe una historia sobre un robot'
  })
});

const reader = streamResponse.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  console.log(chunk);
}

// Conversación
const conversationResponse = await fetch('http://localhost:3000/conversation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [
      { role: 'user', parts: [{ text: 'Hola' }] },
      { role: 'model', parts: [{ text: '¡Hola! ¿Cómo estás?' }] },
      { role: 'user', parts: [{ text: 'Bien, ¿y tú?' }] }
    ]
  })
});

const conversationData = await conversationResponse.json();
console.log(conversationData.response);
```

## Manejo de Errores

El servidor incluye manejo comprehensivo de errores:

- **400 Bad Request**: Campos requeridos faltantes
- **500 Internal Server Error**: Errores de API o API key faltante
- **404 Not Found**: Endpoints inválidos

Todos los errores retornan respuestas JSON con detalles del error.

## Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Tu API key de Gemini | Requerido |
| `PORT` | Puerto del servidor | 3000 |

## Modelos Disponibles

- `gemini-2.5-flash`: Modelo de propósito general (más rápido)
- `gemini-2.5-pro`: Modelo más avanzado
- `gemini-2.0-flash-exp`: Modelo experimental

## Notas de Seguridad

- Nunca commits tu archivo `.env` al control de versiones
- El archivo `.env` ya está en `.gitignore`
- Usa variables de entorno para configuración sensible
- CORS está habilitado para desarrollo - configura apropiadamente para producción

## Desarrollo

Para ejecutar en modo desarrollo con auto-restart:
```bash
npm run dev
```

Esto usa nodemon para reiniciar automáticamente el servidor cuando los archivos cambien.

## Licencia

ISC 