// Procesador de respuestas JSON de Gemini
export function processGeminiResponse(responseText) {
  try {
    console.log('🔍 Procesando respuesta:', responseText.substring(0, 200) + '...');
    
    // Limpiar la respuesta de caracteres de escape extra
    let cleanedResponse = responseText;
    
    // Remover marcadores de código si existen
    if (cleanedResponse.includes('```json')) {
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedResponse.includes('```')) {
      cleanedResponse = cleanedResponse.replace(/```\n?/g, '');
    }
    
    // Remover espacios en blanco extra al inicio y final
    cleanedResponse = cleanedResponse.trim();
    
    console.log('🧹 Respuesta limpia:', cleanedResponse.substring(0, 200) + '...');
    
    // Intentar parsear directamente primero
    try {
      const parsedJson = JSON.parse(cleanedResponse);
      console.log('✅ Parseo directo exitoso');
      return {
        success: true,
        data: parsedJson,
        originalResponse: responseText,
        method: 'direct'
      };
    } catch (directError) {
      console.log('⚠️ Parseo directo falló, intentando con escape de caracteres...');
    }
    
    // Procesar caracteres de escape comunes
    let processedResponse = cleanedResponse
      .replace(/\\n/g, '\n')           // Convertir \n a saltos de línea reales
      .replace(/\\t/g, '\t')           // Convertir \t a tabulaciones reales
      .replace(/\\"/g, '"')            // Convertir \" a comillas reales
      .replace(/\\\\/g, '\\')          // Convertir \\ a backslash real
      .replace(/\\r/g, '\r')           // Convertir \r a retorno de carro real
    
    console.log('🔧 Respuesta procesada:', processedResponse.substring(0, 200) + '...');
    
    // Intentar parsear después del procesamiento
    try {
      const parsedJson = JSON.parse(processedResponse);
      console.log('✅ Parseo con escape exitoso');
      return {
        success: true,
        data: parsedJson,
        originalResponse: responseText,
        method: 'escaped'
      };
    } catch (escapeError) {
      console.log('⚠️ Parseo con escape falló, intentando con regex...');
    }
    
    // Intentar extraer JSON usando regex como fallback
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        console.log('🔍 JSON encontrado con regex:', jsonMatch[0].substring(0, 200) + '...');
        const extractedJson = JSON.parse(jsonMatch[0]);
        console.log('✅ Parseo con regex exitoso');
        return {
          success: true,
          data: extractedJson,
          originalResponse: responseText,
          method: 'regex',
          warning: 'JSON extraído usando regex'
        };
      }
    } catch (regexError) {
      console.error('❌ Error en extracción con regex:', regexError.message);
    }
    
    // Si todo falla, intentar limpiar más agresivamente
    try {
      // Remover líneas que no parezcan JSON
      const lines = cleanedResponse.split('\n').filter(line => {
        const trimmed = line.trim();
        return trimmed.startsWith('{') || 
               trimmed.startsWith('}') || 
               trimmed.includes(':') ||
               trimmed.startsWith('"') ||
               trimmed.startsWith('}');
      });
      
      const aggressiveClean = lines.join('\n');
      console.log('🧽 Limpieza agresiva:', aggressiveClean.substring(0, 200) + '...');
      
      const parsedJson = JSON.parse(aggressiveClean);
      console.log('✅ Parseo con limpieza agresiva exitoso');
      return {
        success: true,
        data: parsedJson,
        originalResponse: responseText,
        method: 'aggressive',
        warning: 'JSON procesado con limpieza agresiva'
      };
    } catch (aggressiveError) {
      console.error('❌ Error en limpieza agresiva:', aggressiveError.message);
    }
    
    console.error('❌ Todos los métodos de parsing fallaron');
    return {
      success: false,
      error: 'No se pudo parsear JSON con ningún método',
      originalResponse: responseText,
      debug: {
        cleanedLength: cleanedResponse.length,
        firstChars: cleanedResponse.substring(0, 100),
        lastChars: cleanedResponse.substring(cleanedResponse.length - 100)
      }
    };
    
  } catch (error) {
    console.error('❌ Error general en procesamiento:', error.message);
    return {
      success: false,
      error: error.message,
      originalResponse: responseText
    };
  }
}

// Función para procesar específicamente respuestas de operaciones
export function processOperationResponse(responseText) {
  console.log('🎯 Procesando respuesta de operación...');
  const result = processGeminiResponse(responseText);
  
  if (result.success) {
    console.log('✅ Operación procesada exitosamente');
    return {
      success: true,
      result: result.data.result,
      operation: result.data.operacion,
      html: result.data.result, // Para facilitar el acceso al HTML
      originalResponse: responseText,
      method: result.method
    };
  }
  
  console.log('❌ Error procesando operación:', result.error);
  return result;
}

// Función para validar si una respuesta contiene JSON válido
export function isValidJsonResponse(responseText) {
  try {
    const processed = processGeminiResponse(responseText);
    return processed.success;
  } catch {
    return false;
  }
}

// Función para extraer solo el HTML de una respuesta
export function extractHtmlFromResponse(responseText) {
  const processed = processOperationResponse(responseText);
  
  if (processed.success) {
    return processed.html;
  }
  
  return null;
}

// Función para crear un archivo HTML desde la respuesta
export function createHtmlFile(responseText, filename = 'output.html') {
  const html = extractHtmlFromResponse(responseText);
  
  if (html) {
    // Aquí podrías usar fs.writeFileSync si estás en Node.js
    console.log(`HTML extraído y listo para guardar en ${filename}:`);
    console.log(html);
    return html;
  }
  
  return null;
}

// Función para debuggear una respuesta problemática
export function debugResponse(responseText) {
  console.log('🔍 Debugging respuesta...');
  console.log('Longitud total:', responseText.length);
  console.log('Primeros 500 caracteres:');
  console.log(responseText.substring(0, 500));
  console.log('\nÚltimos 500 caracteres:');
  console.log(responseText.substring(responseText.length - 500));
  
  // Buscar patrones problemáticos
  const problematicPatterns = [
    /\\n/g,
    /\\"/g,
    /\\\\/g,
    /```/g
  ];
  
  problematicPatterns.forEach(pattern => {
    const matches = responseText.match(pattern);
    if (matches) {
      console.log(`Patrón ${pattern}: ${matches.length} ocurrencias`);
    }
  });
}

// Ejemplo de uso
export function exampleUsage() {
  const sampleResponse = `\`\`\`json
{
  "result": "<!DOCTYPE html>\\n<html lang=\\"es\\">\\n<head>\\n    <meta charset=\\"UTF-8\\">\\n    <meta name=\\"viewport\\" content=\\"width=device-width, initial-scale=1.0\\">\\n    <title>Formulario Simple con Tailwind CSS</title>\\n    <script src=\\"https://cdn.tailwindcss.com\\"></script>\\n</head>\\n<body class=\\"bg-gray-100 flex items-center justify-center min-h-screen\\">\\n\\n    <form class=\\"bg-white p-8 rounded-lg shadow-lg w-full max-w-md\\">\\n        <h2 class=\\"text-2xl font-bold text-center text-gray-800 mb-6\\">Contáctanos</h2>\\n        \\n        <div class=\\"mb-4\\">\\n            <label for=\\"name\\" class=\\"block text-gray-700 text-sm font-semibold mb-2\\">\\n                Nombre:\\n            </label>\\n            <input\\n                type=\\"text\\"\\n                id=\\"name\\"\\n                name=\\"name\\"\\n                placeholder=\\"Tu nombre completo\\"\\n                class=\\"shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent\\"\\n                required\\n            >\\n        </div>\\n\\n        <div class=\\"mb-4\\">\\n            <label for=\\"email\\" class=\\"block text-gray-700 text-sm font-semibold mb-2\\">\\n                Correo Electrónico:\\n            </label>\\n            <input\\n                type=\\"email\\"\\n                id=\\"email\\"\\n                name=\\"email\\"\\n                placeholder=\\"ejemplo@dominio.com\\"\\n                class=\\"shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent\\"\\n                required\\n            >\\n        </div>\\n\\n        <div class=\\"mb-6\\">\\n            <label for=\\"message\\" class=\\"block text-gray-700 text-sm font-semibold mb-2\\">\\n                Mensaje:\\n            </label>\\n            <textarea\\n                id=\\"message\\"\\n                name=\\"message\\"\\n                placeholder=\\"Escribe tu mensaje aquí...\\"\\n                rows=\\"5\\"\\n                class=\\"shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y\\"\\n                required\\n            ></textarea>\\n        </div>\\n\\n        <div class=\\"flex items-center justify-center\\">\\n            <button\\n                type=\\"submit\\"\\n                class=\\"bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out\\"\\n            >\\n                Enviar Mensaje\\n            </button>\\n        </div>\\n    </form>\\n\\n</body>\\n</html>\\n",
  "operacion": "Generación de un formulario HTML con estilos Tailwind CSS."
}
\`\`\``;

  console.log('🔧 Procesando respuesta de ejemplo...\n');
  
  // Procesar la respuesta completa
  const processed = processGeminiResponse(sampleResponse);
  console.log('✅ Respuesta procesada:', processed);
  
  // Procesar específicamente para operaciones
  const operationResult = processOperationResponse(sampleResponse);
  console.log('\n🎯 Resultado de operación:', operationResult);
  
  // Extraer solo el HTML
  const html = extractHtmlFromResponse(sampleResponse);
  console.log('\n📄 HTML extraído:', html ? 'HTML válido encontrado' : 'No se pudo extraer HTML');
  
  return {
    processed,
    operationResult,
    html
  };
}

// Ejecutar ejemplo si el archivo se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  exampleUsage();
} 