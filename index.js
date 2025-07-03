import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { processGeminiResponse, processOperationResponse } from './json-processor.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Gemini AI with the new library
const apiKey = process.env.GEMINI_API_KEY || '';
if (!apiKey) {
  console.error('⚠️ GEMINI_API_KEY not found in .env file');
}
const ai = new GoogleGenAI({ apiKey });

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Gemini API Server is running',
    timestamp: new Date().toISOString()
  });
});

// Simple query endpoint - based on main.js pattern
app.post('/query', async (req, res) => {
  try {
    const { query, model = 'gemini-2.5-flash' } = req.body;

    if (!query) {
      return res.status(400).json({ 
        error: 'Query is required' 
      });
    }

    if (!apiKey) {
      return res.status(500).json({ 
        error: 'API key is not configured' 
      });
    }

    const contents = 'Devuelve el resultado de la siguiente operacion: ' + query + ' en este formato: {result: <resultado>, operacion: <operacion>} ; <resultado> es el html generado y <operacion> es la operacion realizada';

    // Generate content using the same pattern as main.js
    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
    });

    const rawResponse = response.text;
    
    // Procesar la respuesta JSON automáticamente
    const processedResponse = processOperationResponse(rawResponse);
    
    res.json({
      success: true,
      query: query,
      rawResponse: rawResponse,
      processedResponse: processedResponse,
      model: model,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in query endpoint:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      details: error.message
    });
  }
});

// Main chat endpoint using the new genai library
app.post('/chat', async (req, res) => {
  try {
    const { message, model = 'gemini-2.5-flash' } = req.body;

    if (!message) {
      return res.status(400).json({ 
        error: 'Message is required' 
      });
    }

    if (!apiKey) {
      return res.status(500).json({ 
        error: 'API key is not configured' 
      });
    }

    // Generate content using the new genai library
    const response = await ai.models.generateContent({
      model: model,
      contents: message,
    });

    res.json({
      success: true,
      response: response.text,
      model: model,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      details: error.message
    });
  }
});

// Streaming chat endpoint
app.post('/chat/stream', async (req, res) => {
  try {
    const { message, model = 'gemini-2.5-flash' } = req.body;

    if (!message) {
      return res.status(400).json({ 
        error: 'Message is required' 
      });
    }

    if (!apiKey) {
      return res.status(500).json({ 
        error: 'API key is not configured' 
      });
    }

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    // Generate content with streaming
    const response = await ai.models.generateContentStream({
      model: model,
      contents: message,
    });

    // Stream the response
    for await (const chunk of response.stream) {
      if (chunk.text) {
        res.write(chunk.text);
      }
    }

    res.end();

  } catch (error) {
    console.error('Error in streaming chat endpoint:', error);
    res.status(500).json({
      error: 'Failed to generate streaming response',
      details: error.message
    });
  }
});

// Get available models
app.get('/models', async (req, res) => {
  try {
    const models = await ai.models.list();
    res.json({
      success: true,
      models: models
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({
      error: 'Failed to fetch models',
      details: error.message
    });
  }
});

// Multi-turn conversation endpoint
app.post('/conversation', async (req, res) => {
  try {
    const { messages, model = 'gemini-2.5-flash' } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ 
        error: 'Messages array is required' 
      });
    }

    if (!apiKey) {
      return res.status(500).json({ 
        error: 'API key is not configured' 
      });
    }

    // Create conversation with history
    const response = await ai.models.generateContent({
      model: model,
      contents: messages,
    });

    res.json({
      success: true,
      response: response.text,
      model: model,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in conversation endpoint:', error);
    res.status(500).json({
      error: 'Failed to generate conversation response',
      details: error.message
    });
  }
});

// Vision endpoint for image analysis
app.post('/vision', async (req, res) => {
  try {
    const { message, imageData, model = 'gemini-2.5-flash' } = req.body;

    if (!message || !imageData) {
      return res.status(400).json({ 
        error: 'Message and imageData are required' 
      });
    }

    if (!apiKey) {
      return res.status(500).json({ 
        error: 'API key is not configured' 
      });
    }

    // Create content with text and image
    const contents = [
      {
        role: 'user',
        parts: [
          { text: message },
          { inlineData: { mimeType: 'image/jpeg', data: imageData } }
        ]
      }
    ];

    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
    });

    res.json({
      success: true,
      response: response.text,
      model: model,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in vision endpoint:', error);
    res.status(500).json({
      error: 'Failed to analyze image',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    details: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /health',
      'POST /query',
      'POST /chat',
      'POST /chat/stream',
      'POST /conversation',
      'POST /vision',
      'GET /models'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Gemini API Server running on port ${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
  console.log(`❓ Query endpoint: http://localhost:${PORT}/query`);
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/chat`);
  console.log(`🌊 Streaming chat: http://localhost:${PORT}/chat/stream`);
  console.log(`🗣️  Conversation: http://localhost:${PORT}/conversation`);
  console.log(`👁️  Vision analysis: http://localhost:${PORT}/vision`);
  console.log(`📋 Models endpoint: http://localhost:${PORT}/models`);
  
  if (!apiKey) {
    console.warn('⚠️  API key is not configured!');
  }
});
