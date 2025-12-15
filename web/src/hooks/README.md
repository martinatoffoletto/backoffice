# 🪝 Hooks Personalizados

## `usePropuestasPolling`

Hook personalizado para detectar nuevas propuestas mediante polling **ligero** al endpoint externo.

### 📋 Descripción

Este hook realiza consultas periódicas (polling) **sin enriquecer datos** al endpoint de propuestas pendientes y detecta automáticamente cuando llegan nuevas propuestas, comparando solo la cantidad actual con la anterior.

**⚡ Optimización:** El polling usa `obtenerPropuestasPendientesLigero()` que NO hace requests adicionales de usuarios/materias, solo verifica si hay nuevas propuestas.

### 🎯 Características

- ✅ **Polling automático** cada 30 segundos
- ✅ **Detección de visibilidad** - Se pausa cuando el usuario sale de la página
- ✅ **Check inmediato** cuando el usuario regresa a la página
- ✅ **Comparación inteligente** - Solo notifica si hay MÁS propuestas
- ✅ **Control manual** - Función para forzar un check inmediato

### 🚀 Uso

```javascript
import { usePropuestasPolling } from '@/hooks/usePropuestasPolling';

const MiComponente = () => {
  const [propuestas, setPropuestas] = useState([]);
  
  const { 
    has_new_proposals,      // Boolean: indica si hay nuevas propuestas
    new_proposals_count,    // Número: cantidad de nuevas propuestas
    is_polling,             // Boolean: indica si está haciendo polling
    last_check,             // Date: timestamp del último check
    resetNewProposals,      // Función: resetea el contador
    forceCheck              // Función: fuerza un check inmediato
  } = usePropuestasPolling(propuestas.length, true);

  // Cuando el usuario actualice manualmente
  const handleRefresh = async () => {
    const datos = await obtenerPropuestasPendientes();
    setPropuestas(datos);
    resetNewProposals(); // ⚠️ Importante: resetear después de actualizar
  };

  return (
    <div>
      {has_new_proposals && (
        <p>Hay {new_proposals_count} nuevas propuestas</p>
      )}
      <button onClick={handleRefresh}>Actualizar</button>
    </div>
  );
};
```

### ⚙️ Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `current_count` | `number` | Cantidad actual de propuestas cargadas |
| `is_active` | `boolean` | Si el polling debe estar activo (default: `true`) |

### 📤 Retorno

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `has_new_proposals` | `boolean` | Indica si hay nuevas propuestas detectadas |
| `new_proposals_count` | `number` | Cantidad de nuevas propuestas |
| `is_polling` | `boolean` | Indica si está realizando un check actualmente |
| `last_check` | `Date \| null` | Timestamp del último check realizado |
| `resetNewProposals` | `() => void` | Resetea el indicador de nuevas propuestas |
| `forceCheck` | `() => Promise<void>` | Fuerza un check inmediato |

### 🔧 Configuración

```javascript
const POLLING_INTERVAL = 30000;  // 30 segundos
const INITIAL_DELAY = 5000;      // 5 segundos para el primer check
```

### 🎯 Flujo de Trabajo

1. El componente se monta con N propuestas (enriquecidas)
2. Después de 5 segundos → Primer check **ligero** (solo cantidad)
3. Cada 30 segundos → Check **ligero** recurrente (solo cantidad)
4. Si detecta más propuestas → `has_new_proposals = true` + Notificación
5. Usuario hace clic en "Actualizar"
6. Componente llama a `obtenerPropuestasPendientes()` (CON enriquecimiento)
7. Componente llama a `resetNewProposals()` → `has_new_proposals = false`

**Importante:** El enriquecimiento (fetch de usuarios + materias) solo ocurre al actualizar manualmente, NO en el polling.

### ⚠️ Importante

- **Siempre** llama a `resetNewProposals()` después de actualizar la lista de propuestas
- El polling se pausa automáticamente cuando el usuario sale de la página
- Se reanuda automáticamente cuando el usuario regresa

### 📝 Ejemplo Completo

Ver implementación en: `src/components/TablaAsignaciones.jsx`
