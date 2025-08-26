# PROMPT MEJORADO: CONSTRUCCIÓN DE FUNCIONES

## ESTRUCTURA BÁSICA DE FUNCIONES

### REQUISITOS OBLIGATORIOS:
- **Todas las funciones deben crearse en el objeto de retorno `functions`**
- **Usar el objeto `this` para acceder a variables y funciones**
- **Seguir la estructura estándar definida**

### ESTRUCTURA DE UNA FUNCIÓN:

```javascript
{
  "nombreFuncion": {
    "args": "context", // Siempre usar "context" como argumento
    "handler": "// Cuerpo de la función aquí",
    "name": "nombreFuncion",
    "category": "Categoría del método",
    "description": "Descripción breve de la funcionalidad"
  }
}
```

## ACCESO A VARIABLES Y FUNCIONES

### ACCESO A VARIABLES:
```javascript
// Variables simples
const valor = this.miVariable.value;

// Variables anidadas
const valorAnidado = this.miVariable.value.propiedad;

// Variables de arrays
const elemento = this.miArray.value[0];
```

### ASIGNACIÓN DE VALORES:
```javascript
// Variables simples
this.miVariable.value = nuevoValor;

// Variables anidadas
this.miVariable.value.propiedad = nuevoValor;

// Propiedades de objetos
this.miObjeto.value.hasError = true;
this.miObjeto.value.isLoading = false;
```

### LLAMADA A FUNCIONES:
```javascript
// Llamar otras funciones
this.otraFuncion(context);

// Con parámetros
this.otraFuncion(context, parametro1, parametro2);
```

## EJEMPLOS PRÁCTICOS

### FUNCIÓN SIMPLE:
```javascript
{
  "actualizarDatos": {
    "args": "context",
    "handler": "this.datos.value = this.datos.value.map(item => ({...item, actualizado: true}));",
    "name": "actualizarDatos",
    "category": "Data Management",
    "description": "Actualiza el estado de todos los elementos en datos"
  }
}
```

### FUNCIÓN CON VALIDACIÓN:
```javascript
{
  "validarFormulario": {
    "args": "context",
    "handler": "this.formulario.value.hasError = !this.formulario.value.nombre; this.formulario.value.isValid = !this.formulario.value.hasError;",
    "name": "validarFormulario",
    "category": "Validation",
    "description": "Valida los campos del formulario y actualiza estados"
  }
}
```

### FUNCIÓN CON ARRAYS:
```javascript
{
  "agregarElemento": {
    "args": "context",
    "handler": "this.lista.value.push({id: Date.now(), nombre: 'Nuevo elemento'});",
    "name": "agregarElemento",
    "category": "Array Operations",
    "description": "Agrega un nuevo elemento al array de lista"
  }
}
```

## REGLAS IMPORTANTES

### ✅ HACER:
- Usar `this.variable.value` para acceder a variables
- Usar `this.variable.value = valor` para asignar
- Usar `this.funcion(context)` para llamar funciones
- Crear funciones en el objeto `functions`
- Incluir categoría y descripción descriptivas

### ❌ NO HACER:
- No usar `context.get()` o `context.set()`
- No usar `context.fx()` para llamar funciones
- No crear funciones fuera del objeto `functions`
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
```javascript
// Activar/desactivar estados
this.isLoading.value = true;
this.hasError.value = false;
this.isValid.value = true;
```

### OPERACIONES CON ARRAYS:
```javascript
// Agregar elemento
this.array.value.push(nuevoElemento);

// Eliminar elemento
this.array.value = this.array.value.filter(item => item.id !== id);

// Actualizar elemento
this.array.value = this.array.value.map(item => 
  item.id === id ? {...item, actualizado: true} : item
);
```

### VALIDACIONES:
```javascript
// Validación simple
this.form.value.isValid = this.form.value.nombre.length > 0;

// Validación múltiple
this.form.value.hasError = !this.form.value.email || !this.form.value.password;
```

Este prompt mejorado proporciona ejemplos claros, reglas específicas y patrones comunes para crear funciones efectivas y consistentes. 