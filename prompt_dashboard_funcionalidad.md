# PROMPT: FUNCIONALIDAD PARA DASHBOARD DARK CON GRÁFICO

## REQUISITOS TÉCNICOS:
- Usar Tailwind CSS para estilos
- Implementar notación Vue 3: {{variable}} y v-model
- Usar el objeto `this` para acceder a variables y funciones
- Mantener tema dark con colores modernos
- Diseño responsive y accesible

## ESTRUCTURA DE VARIABLES NECESARIAS:

### DATOS DE RESUMEN (Tarjetas Superiores):
```javascript
{
  "resumen": {
    "ingresos": { "valor": 125000, "cambio": 12.5, "tendencia": "up" },
    "gastos": { "valor": 85000, "cambio": -8.2, "tendencia": "down" },
    "beneficios": { "valor": 40000, "cambio": 15.3, "tendencia": "up" },
    "clientes": { "valor": 1250, "cambio": 5.7, "tendencia": "up" }
  }
}
```

### DATOS DE ACTIVIDAD RECIENTE:
```javascript
{
  "actividadReciente": {
    "registros": [
      {
        "id": 1,
        "cliente": "Empresa ABC",
        "monto": 15000,
        "estado": "Pagado",
        "fecha": "2024-01-15",
        "tipo": "Factura"
      }
    ],
    "isLoading": false,
    "hasError": false
  }
}
```

### DATOS DE CLIENTES:
```javascript
{
  "clientes": {
    "lista": [
      {
        "id": 1,
        "nombre": "Cliente A",
        "ultimaFactura": 25000,
        "estado": "Activo",
        "avatar": "url-imagen"
      }
    ]
  }
}
```

### DATOS DEL GRÁFICO:
```javascript
{
  "graficoIngresos": {
    "datos": [
      { "mes": "Ene", "ingreso": 45000 },
      { "mes": "Feb", "ingreso": 52000 },
      { "mes": "Mar", "ingreso": 48000 },
      { "mes": "Abr", "ingreso": 61000 },
      { "mes": "May", "ingreso": 55000 },
      { "mes": "Jun", "ingreso": 67000 },
      { "mes": "Jul", "ingreso": 59000 },
      { "mes": "Ago", "ingreso": 72000 },
      { "mes": "Sep", "ingreso": 65000 },
      { "mes": "Oct", "ingreso": 78000 },
      { "mes": "Nov", "ingreso": 71000 },
      { "mes": "Dic", "ingreso": 85000 }
    ],
    "isLoading": false
  }
}
```

## FUNCIONALIDADES A IMPLEMENTAR:

### 1. GESTIÓN DE ACTIVIDAD RECIENTE:
```javascript
{
  "agregarRegistro": {
    "args": "context",
    "handler": "this.actividadReciente.value.registros.push({id: Date.now(), cliente: 'Nuevo Cliente', monto: 0, estado: 'Pendiente', fecha: new Date().toISOString().split('T')[0], tipo: 'Factura'});",
    "name": "agregarRegistro",
    "category": "Data Management",
    "description": "Agrega un nuevo registro a la actividad reciente"
  },
  "eliminarRegistro": {
    "args": "context",
    "handler": "this.actividadReciente.value.registros = this.actividadReciente.value.registros.filter(registro => registro.id !== context.id);",
    "name": "eliminarRegistro",
    "category": "Data Management",
    "description": "Elimina un registro específico de la actividad reciente"
  },
  "actualizarRegistro": {
    "args": "context",
    "handler": "this.actividadReciente.value.registros = this.actividadReciente.value.registros.map(registro => registro.id === context.id ? {...registro, ...context.datos} : registro);",
    "name": "actualizarRegistro",
    "category": "Data Management",
    "description": "Actualiza los datos de un registro específico"
  }
}
```

### 2. CONTROL DE ESTADOS:
```javascript
{
  "cargarDatos": {
    "args": "context",
    "handler": "this.actividadReciente.value.isLoading = true; setTimeout(() => { this.actividadReciente.value.isLoading = false; }, 1000);",
    "name": "cargarDatos",
    "category": "UI Control",
    "description": "Simula la carga de datos con estado de loading"
  },
  "toggleError": {
    "args": "context",
    "handler": "this.actividadReciente.value.hasError = !this.actividadReciente.value.hasError;",
    "name": "toggleError",
    "category": "UI Control",
    "description": "Alterna el estado de error para mostrar mensajes"
  }
}
```

### 3. VALIDACIONES:
```javascript
{
  "validarRegistro": {
    "args": "context",
    "handler": "const registro = context.registro; const esValido = registro.cliente && registro.monto > 0 && registro.fecha; this.actividadReciente.value.hasError = !esValido; return esValido;",
    "name": "validarRegistro",
    "category": "Validation",
    "description": "Valida que un registro tenga todos los campos requeridos"
  }
}
```

### 4. OPERACIONES CON GRÁFICO:
```javascript
{
  "actualizarGrafico": {
    "args": "context",
    "handler": "this.graficoIngresos.value.datos = this.graficoIngresos.value.datos.map(item => ({...item, ingreso: item.ingreso + Math.random() * 10000}));",
    "name": "actualizarGrafico",
    "category": "Data Management",
    "description": "Actualiza los datos del gráfico con valores aleatorios"
  },
  "resetearGrafico": {
    "args": "context",
    "handler": "this.graficoIngresos.value.datos = this.graficoIngresos.value.datos.map(item => ({...item, ingreso: Math.floor(Math.random() * 100000) + 20000}));",
    "name": "resetearGrafico",
    "category": "Data Management",
    "description": "Resetea el gráfico con nuevos datos aleatorios"
  }
}
```

## INTERACTIVIDAD EN HTML:

### BOTONES PARA ACTIVIDAD RECIENTE:
```html
<!-- Botón agregar registro -->
<button @click="this.agregarRegistro(context)" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
  <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
  </svg>
  Agregar Registro
</button>

<!-- Botón eliminar registro -->
<button @click="this.eliminarRegistro({id: registro.id})" class="text-red-500 hover:text-red-700">
  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
  </svg>
</button>
```

### ESTADOS DE CARGA:
```html
<!-- Loading state -->
<div v-if="this.actividadReciente.value.isLoading" class="flex items-center justify-center p-4">
  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  <span class="ml-2 text-gray-400">Cargando...</span>
</div>

<!-- Error state -->
<div v-if="this.actividadReciente.value.hasError" class="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-md">
  Error al cargar los datos. Inténtalo de nuevo.
</div>
```

## COLORES DARK SUGERIDOS:
- Fondo principal: `bg-gray-900`
- Tarjetas: `bg-gray-800`
- Bordes: `border-gray-700`
- Texto: `text-white`, `text-gray-300`
- Acentos: `bg-blue-600`, `bg-green-600`, `bg-red-600`
- Hover: `hover:bg-gray-700`

## FUNCIONALIDADES ADICIONALES SUGERIDAS:
- Filtros por estado (Pagado/Vencido)
- Búsqueda en registros
- Ordenamiento por fecha/monto
- Exportar datos
- Configuración de gráfico
- Notificaciones en tiempo real

Implementa estas funcionalidades manteniendo el diseño dark moderno y la experiencia de usuario fluida. 