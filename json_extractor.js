/**
 * Extrae el contenido JSON que se encuentra entre las etiquetas ```json y ```
 * @param {string} text - El texto que contiene el JSON marcado
 * @returns {string|null} - El contenido JSON extraído o null si no se encuentra
 */
export function extractJsonContent(text) {
    // Patrón regex para encontrar contenido entre ```json y ```
    const jsonPattern = /```json\s*([\s\S]*?)\s*```/;
    
    // Buscar coincidencias
    const match = text.match(jsonPattern);
    
    // Si se encuentra una coincidencia, retornar el contenido del grupo 1
    if (match && match[1]) {
        return match[1].trim();
    }
    
    // Si no se encuentra, retornar null
    return null;
}

/**
 * Extrae múltiples bloques JSON del texto
 * @param {string} text - El texto que contiene múltiples bloques JSON
 * @returns {string[]} - Array con todos los contenidos JSON encontrados
 */
export function extractAllJsonBlocks(text) {
    // Patrón regex global para encontrar todos los bloques JSON
    const jsonPattern = /```json\s*([\s\S]*?)\s*```/g;
    
    const results = [];
    let match;
    
    // Buscar todas las coincidencias
    while ((match = jsonPattern.exec(text)) !== null) {
        if (match[1]) {
            results.push(match[1].trim());
        }
    }
    
    return results;
}

/**
 * Extrae y parsea el JSON contenido entre las etiquetas
 * @param {string} text - El texto que contiene el JSON marcado
 * @returns {object|null} - El objeto JSON parseado o null si hay error
 */
export function extractAndParseJson(text) {
    const jsonContent = extractJsonContent(text);
    
    if (!jsonContent) {
        return null;
    }
    
    try {
        return JSON.parse(jsonContent);
    } catch (error) {
        console.error('Error parsing JSON:', error.message);
        return null;
    }
}

// Ejemplo de uso
const exampleText = `
Aquí hay un ejemplo de JSON:

\`\`\`json
{
  "name": "John Doe",
  "age": 30,
  "city": "New York"
}
\`\`\`

Y aquí hay otro:

\`\`\`json
{
  "product": "Laptop",
  "price": 999.99,
  "inStock": true
}
\`\`\`
`;

// Probar las funciones
console.log('=== Extraer primer JSON ===');
const firstJson = extractJsonContent(exampleText);
console.log(firstJson);

console.log('\n=== Extraer todos los JSON ===');
const allJsons = extractAllJsonBlocks(exampleText);
console.log(allJsons);

console.log('\n=== Parsear JSON ===');
const parsedJson = extractAndParseJson(exampleText);
console.log(parsedJson);