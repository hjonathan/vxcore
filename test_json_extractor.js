const { extractJsonContent, extractAllJsonBlocks, extractAndParseJson } = require('./json_extractor.js');

// Ejemplo de texto con múltiples bloques JSON
const testText = `
# Documento de ejemplo

Este es un ejemplo de configuración:

\`\`\`json
{
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "myapp"
  },
  "api": {
    "version": "v1",
    "endpoint": "/api"
  }
}
\`\`\`

Y aquí hay otro bloque JSON:

\`\`\`json
{
  "users": [
    {
      "id": 1,
      "name": "Alice",
      "email": "alice@example.com"
    },
    {
      "id": 2,
      "name": "Bob",
      "email": "bob@example.com"
    }
  ]
}
\`\`\`

También hay texto normal aquí.
`;

console.log('=== PRUEBA DE EXTRACCIÓN DE JSON ===\n');

// Probar extracción del primer JSON
console.log('1. Extraer primer bloque JSON:');
const firstJson = extractJsonContent(testText);
if (firstJson) {
    console.log(firstJson);
} else {
    console.log('No se encontró JSON');
}

console.log('\n' + '='.repeat(50) + '\n');

// Probar extracción de todos los JSON
console.log('2. Extraer todos los bloques JSON:');
const allJsons = extractAllJsonBlocks(testText);
allJsons.forEach((json, index) => {
    console.log(`\n--- JSON ${index + 1} ---`);
    console.log(json);
});

console.log('\n' + '='.repeat(50) + '\n');

// Probar parseo del primer JSON
console.log('3. Parsear el primer JSON:');
const parsedJson = extractAndParseJson(testText);
if (parsedJson) {
    console.log('JSON parseado exitosamente:');
    console.log(JSON.stringify(parsedJson, null, 2));
} else {
    console.log('Error al parsear JSON');
}

console.log('\n' + '='.repeat(50) + '\n');

// Probar con texto que no contiene JSON
console.log('4. Probar con texto sin JSON:');
const textWithoutJson = 'Este es un texto normal sin bloques JSON.';
const result = extractJsonContent(textWithoutJson);
console.log('Resultado:', result);

console.log('\n' + '='.repeat(50) + '\n');

// Probar con JSON malformado
console.log('5. Probar con JSON malformado:');
const malformedJsonText = `
\`\`\`json
{
  "name": "John",
  "age": 30,
  "city": "New York"
\`\`\`
`;
const malformedResult = extractAndParseJson(malformedJsonText);
console.log('Resultado con JSON malformado:', malformedResult); 