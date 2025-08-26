# PROMPTS MEJORADOS Y EFECTIVOS

## 1. DASHBOARD FINANCIERO MODERNO

```
Genera un HTML moderno para una aplicación de dashboard financiero con las siguientes características:

### REQUISITOS TÉCNICOS:
- Usar Tailwind CSS para todos los estilos
- Implementar diseño responsive (mobile-first)
- Usar notación Vue 3 para variables: {{variable}} y v-model
- Estructura semántica con HTML5

### ESTRUCTURA PRINCIPAL:
- `<main>` contenedor principal con padding y max-width
- Header con navegación y botón de acción
- Sección de métricas financieras (4 cards en grid)
- Sección de transacciones recientes (tabla)
- Sección de clientes recientes (cards)

### HEADER:
- Título "Cashflow" con tipografía bold
- Navegación temporal: "Last 7 days", "Last 30 days", "All-time"
- Botón "New invoice" con icono SVG de plus
- Usar flexbox para alineación

### SECCIÓN DE MÉTRICAS:
- Grid de 4 columnas responsive
- Cada métrica debe mostrar:
  - Etiqueta descriptiva
  - Valor principal en formato moneda
  - Porcentaje de cambio con color (verde/rojo)
- Usar estructura `<dl>`, `<dt>`, `<dd>`

### SECCIÓN DE TRANSACCIONES:
- Tabla con columnas: Amount, Client, Actions
- Cada fila incluye:
  - Icono SVG del tipo de transacción
  - Monto y estado (Paid/Overdue/Withdraw)
  - Cliente y descripción
  - Enlace "View transaction"
- Estados con colores: verde (Paid), rojo (Overdue), gris (Withdraw)

### SECCIÓN DE CLIENTES:
- Grid de 3 columnas con cards
- Cada card incluye:
  - Logo/imagen del cliente
  - Nombre del cliente
  - Botón de opciones (3 puntos)
  - Última factura y monto

### ESTILOS ESPECÍFICOS:
- Colores: text-gray-900, text-gray-500, text-gray-700
- Fondos: bg-indigo-600, bg-green-50, bg-red-50
- Bordes: rounded-md, rounded-xl, border-gray-200
- Espaciado: px-4, py-5, gap-x-6
- Responsive: sm:, lg:, xl: breakpoints

### INTERACTIVIDAD:
- Hover states en botones y enlaces
- Estados visuales claros
- Transiciones suaves
- Iconos SVG integrados

El resultado debe ser un dashboard financiero moderno, profesional y completamente funcional.
```

## 2. TABLERO TRELLO DARK MODERN

```
Crea un tablero tipo Trello moderno con tema dark para gestión de flujo de desarrollo.

### REQUISITOS TÉCNICOS:
- Tema dark con colores modernos
- Usar Tailwind CSS para estilos
- Implementar notación Vue 3 para variables
- Diseño responsive y accesible

### ESTRUCTURA PRINCIPAL:
- Header con título del proyecto y botones de acción
- Contenedor principal con scroll horizontal
- Columnas (listas) organizadas horizontalmente
- Cards dentro de cada columna

### HEADER:
- Título del proyecto con tipografía bold
- Botón "Add List" para crear nuevas columnas
- Botón de configuración o filtros
- Usar colores dark: bg-gray-900, text-white

### COLUMNAS (LISTAS):
- Cada columna debe tener:
  - Header con título de la lista
  - Botón "Add Card" dentro de cada columna
  - Botón de opciones (3 puntos) en header
  - Contador de cards
- Usar bg-gray-800 para columnas
- Bordes redondeados y sombras sutiles

### CARDS:
- Cada card debe mostrar:
  - Título de la tarea
  - Descripción breve (opcional)
  - Etiquetas de prioridad/estado
  - Avatar del asignado (opcional)
  - Fecha de vencimiento (opcional)
- Usar bg-gray-700 para cards
- Hover effects y transiciones

### FUNCIONALIDADES:
- Agregar/quitar listas (columnas)
- Agregar/eliminar cards dentro de listas
- Drag and drop visual (indicadores)
- Estados de carga y transiciones

### COLORES DARK:
- Fondo principal: bg-gray-900
- Columnas: bg-gray-800
- Cards: bg-gray-700
- Texto: text-white, text-gray-300
- Acentos: bg-blue-600, bg-green-600, bg-red-600
- Bordes: border-gray-600

### INTERACTIVIDAD:
- Hover states en todos los elementos interactivos
- Estados de focus para accesibilidad
- Transiciones suaves (transition-all)
- Iconos SVG para botones y acciones

### RESPONSIVE:
- Scroll horizontal en móviles
- Grid adaptativo para diferentes tamaños
- Breakpoints: sm:, md:, lg:, xl:

El resultado debe ser un tablero Trello moderno, funcional y visualmente atractivo con tema dark.
```

## 3. PROMPT PARA CARGAR DATOS DESDE VARIABLES

```
Carga la información desde variables y agrega funcionalidad dinámica:

### REQUISITOS:
- Usar variables Vue 3: {{variable}} y v-model
- Implementar funcionalidad de agregar/quitar elementos
- Mantener el diseño existente
- Usar Tailwind CSS para estilos

### FUNCIONALIDADES A IMPLEMENTAR:
- Agregar y quitar listados/columnas
- Agregar y eliminar cards/tarjetas
- Persistencia de datos en variables
- Estados de carga y validación

### ESTRUCTURA DE VARIABLES:
- Array de listados/columnas
- Array de cards por cada listado
- Variables de control para modales/formularios
- Estados de carga y error

### INTERACTIVIDAD:
- Botones para agregar/quitar elementos
- Formularios para crear nuevos elementos
- Confirmación antes de eliminar
- Feedback visual para acciones

### MANTENIMIENTO DEL DISEÑO:
- Conservar todos los estilos existentes
- Mantener la estructura visual
- Preservar colores y tipografía
- Mantener responsive design

Implementa estas funcionalidades manteniendo la integridad visual del diseño original.
``` 