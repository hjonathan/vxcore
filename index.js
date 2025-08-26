import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { processGeminiResponse, processOperationResponse } from './json-processor.js';
import { extractJsonContent } from './json_extractor.js';


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
    const { model = 'gemini-2.5-flash', form = '', query = ''} = req.body;

    const contents = `
    DATOS DE ENTRADA PARA PROCESAR:
    {
      form: ${form}, // html del formulario anterior
      query: ${query}, // operacion a realizar sobre el formulario o el nodo seleccionado
    }

    CONTRUCCION DE HTML:
    - Cualquier cambio que realices sobre el html, debes hacerlo en el objeto de retorno form a menos que se te pida crear una nuevo html
    - Usa tailwind css para cualquier cambio de estilo
    - No puedes inyectar estilos css con etiquetas style, debes usar tailwind css

    FORMATO JSON DE RETORNO:
    { 
      form: <formulario>, // devolvemos el formulario modificado si changes esta seteada en form
      query: <operacion>, // operacion realizada sobre el formulario o el nodo seleccionado
    }
    `;

    console.log("QUERY: ", contents);
    
    // Generate content using the same pattern as main.js
    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
    });

    console.log("RESPONSE: ", response.text);

    const rawResponse = response.text;
    
    // Procesar la respuesta JSON automáticamente
    const processedResponse = extractJsonContent(rawResponse);

    console.log("PROCESSED RESPONSE: ", processedResponse);
    
    res.json(JSON.parse(processedResponse));

  } catch (error) {
    console.error('Error in query endpoint:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      details: error.message
    });
  }
});

// Simple query endpoint - based on main.js pattern
app.post('/queryAdvanced', async (req, res) => {
  try {
    const { model = 'gemini-2.5-flash', form = '', query = '', nodeSelected = null, changes = 'form', data= {}, functions= {}} = req.body;

    const contents = `
    DATOS DE ENTRADA PARA PROCESAR:
    {
      form: ${form}, // html del formulario anterior
      nodeSelected: ${nodeSelected}, // nodo seleccionado 
      changes: ${changes}, // si esta propiedad esta seteada en form, se realizara la operacion sobre el formulario, si esta seteada en nodeSelected, se realizara la operacion sobre el nodo seleccionado
      query: ${query}, // operacion a realizar sobre el formulario o el nodo seleccionado
      data: ${JSON.stringify(data)}, // objeto json con los datos del formulario
      functions: ${JSON.stringify(functions)} // objeto json con las funciones que se han creado
    }

    CONTRUCCION DE HTML:
    - Para acceder a datos a variables o funciones usar directamente el nombre de la variable o funcion
    - Cualquier cambio que realices sobre el html, debes hacerlo en el objeto de retorno form
    - Usa tailwind css para cualquier cambio de estilo
    - No puedes inyectar estilos css con etiquetas style, debes usar tailwind css
    - Para usar variables del objeto DATA  un html, usa notacion Vue 3.<tag>{{myVariable}}</tag> o <tag v-model="myVariable"></tag> similar a Vue 3 no es necesario usar data.myVariable, directamente myVariable
    - Para asignar un evento a un html, usa notacion Vue 3. @<evento>="myFunction" similar a Vue 3, myFunction es el nombre de la funcion que se creara en el objeto de retorno functions
    - Nunca debes usar @submit.prevent="myFunction">, para usar el submit de un formulario, usa en el boton de submit<button @click="myFunction">
    - Para usar una funcion en el html, usa notacion Vue 3. directamente nombre de la funcion, ejemplo <button @click="myFunction"> no es necesario usar functions.myFunction
    

    CONSTRUCCIÓN DE FUNCIONES
    ## ESTRUCTURA BÁSICA DE FUNCIONES

    ### REQUISITOS OBLIGATORIOS:
    - **Todas las funciones deben crearse en el objeto de retorno functions**
    - **Usar el objeto this para acceder a variables y funciones**
    - **Seguir la estructura estándar definida**

    ### ESTRUCTURA DE UNA FUNCIÓN:

  \`\`\`javascript
  {
    "nombreFuncion": {
      "args": "", //
      "handler": "// Cuerpo de la función aquí",
      "name": "nombreFuncion",
      "category": "Categoría del método",
      "description": "Descripción breve de la funcionalidad"
    }
  }
  \`\`\`

  ## ACCESO A VARIABLES Y FUNCIONES

  ### ACCESO A VARIABLES:
  \`\`\`javascript
  // Variables simples
  const valor = this.miVariable;

  // Variables anidadas
  const valorAnidado = this.miVariable.propiedad;

  // Variables de arrays
  const elemento = this.miArray[0];
  \`\`\`

  ### ASIGNACIÓN DE VALORES:
  \`\`\`javascript
  // Variables simples
  this.miVariable = nuevoValor;

  // Variables anidadas
  this.miVariable.propiedad = nuevoValor;

  // Propiedades de objetos
  this.miObjeto.hasError = true;
  this.miObjeto.isLoading = false;
  \`\`\`

  ### LLAMADA A FUNCIONES:
  \`\`\`javascript
  // Llamar otras funciones
  this.otraFuncion();

  // Con parámetros
  this.otraFuncion(parametro1, parametro2);
  \`\`\`

  ## EJEMPLOS PRÁCTICOS

  ### FUNCIÓN SIMPLE:
  \`\`\`javascript
  {
    "actualizarDatos": {
      "args": "",
      "handler": "this.datos = this.datos.map(item => ({...item, actualizado: true}));",
      "name": "actualizarDatos",
      "category": "Data Management",
      "description": "Actualiza el estado de todos los elementos en datos"
    }
  }
  \`\`\`

  ### FUNCIÓN CON VALIDACIÓN:
  \`\`\`javascript
  {
    "validarFormulario": {
      "args": "",
      "handler": "this.formulario.hasError = !this.formulario.nombre; this.formulario.isValid = !this.formulario.hasError;",
      "name": "validarFormulario",
      "category": "Validation",
      "description": "Valida los campos del formulario y actualiza estados"
    }
  }
  \`\`\`

  ### FUNCIÓN CON ARRAYS:
  \`\`\`javascript
  {
    "agregarElemento": {
      "args": "",
      "handler": "this.lista.push({id: Date.now(), nombre: 'Nuevo elemento'});",
      "name": "agregarElemento",
      "category": "Array Operations",
      "description": "Agrega un nuevo elemento al array de lista"
    }
  }
  \`\`\`

  ## REGLAS IMPORTANTES

  ### ✅ HACER:
  - Usar this.variable para acceder a variables
  - Usar this.variable = valor para asignar
  - Crear funciones en el objeto functions
  - Incluir categoría y descripción descriptivas

  ### ❌ NO HACER:
  - No crear funciones fuera del objeto functions
  - No omitir categoría o descripción

  ## CATEGORÍAS SUGERIDAS:
  - **Data Management**: Operaciones con datos
  - **Validation**: Validaciones y verificaciones
  - **UI Control**: Control de interfaz de usuario
  - **Array Operations**: Operaciones con arrays
  - **Object Operations**: Operaciones con objetos
  - **Event Handlers**: Manejadores de eventos
  - **Utility**: Funciones utilitarias

  ## PATRONES COMUNES
  ### MANEJO DE ESTADOS:
  \`\`\`javascript
  // Activar/desactivar estados
  this.isLoading = true;
  this.hasError = false;
  this.isValid = true;
  \`\`\`

    ### OPERACIONES CON ARRAYS:
    \`\`\`javascript
    // Agregar elemento
    this.array.push(nuevoElemento);

    // Eliminar elemento
    this.array = this.array.filter(item => item.id !== id);

    // Actualizar elemento
    this.array = this.array.map(item => 
      item.id === id ? {...item, actualizado: true} : item
    );
    \`\`\` 

    ### VALIDACIONES:
    \`\`\`javascript
    // Validación simple
    this.form.isValid = this.form.nombre.length > 0;

    // Validación múltiple
    this.form.hasError = !this.form.email || !this.form.password;
    \`\`\`


    FORMATO DE RETORNO:
    {
      form: <formulario>, // devolvemos el formulario modificado si changes esta seteada en form
      nodeSelected: <nodo seleccionado>, // devolvemos el nodo seleccionado si changes esta seteada en nodeSelected
      changes: <'form' | 'nodeSelected'>, // si esta propiedad esta seteada en form, se realizara la operacion sobre el formulario, si esta seteada en nodeSelected, se realizara la operacion sobre el nodo seleccionado
      query: <operacion>, // operacion realizada sobre el formulario o el nodo seleccionado
      data: <datos>, // objeto json con los datos del formulario(siempre que aumentes variables)
      functions: <funciones> // objeto json con las funciones que has creado en el proceso
    }
    `;

    console.log("QUERY: ", contents);
    
    // Generate content using the same pattern as main.js
    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
    });

    console.log("RESPONSE: ", response.text);

    const rawResponse = response.text;
    
    // Procesar la respuesta JSON automáticamente
    const processedResponse = extractJsonContent(rawResponse);

    console.log("PROCESSED RESPONSE: ", processedResponse);
    
    res.json(JSON.parse(processedResponse));

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
