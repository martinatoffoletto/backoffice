import { useState, useEffect, useRef } from 'react';
import { obtenerPropuestasPendientes } from '@/api/docentesApi';

/**
 * Hook personalizado para hacer polling al endpoint de propuestas
 * y detectar cuando llegan nuevas propuestas.
 * 
 * Características:
 * - Polling cada 30 segundos
 * - Detecta visibilidad de página (pausa cuando usuario sale)
 * - Compara cantidad de propuestas para detectar nuevas
 * 
 * @param {number} current_count - Cantidad actual de propuestas cargadas
 * @param {boolean} is_active - Si el polling debe estar activo (default: true)
 * @returns {Object} Estado del polling y funciones de control
 */
export const usePropuestasPolling = (current_count, is_active = true) => {
  const [has_new_proposals, setHasNewProposals] = useState(false);
  const [new_proposals_count, setNewProposalsCount] = useState(0);
  const [is_polling, setIsPolling] = useState(false);
  const [last_check, setLastCheck] = useState(null);
  
  const previous_count_ref = useRef(current_count);
  const polling_interval_ref = useRef(null);
  const is_visible_ref = useRef(!document.hidden);
  
  const POLLING_INTERVAL = 30000; // 30 segundos
  const INITIAL_DELAY = 5000; // 5 segundos para el primer check

  /**
   * Verifica si hay nuevas propuestas consultando el endpoint
   */
  const checkForNewProposals = async () => {
    if (!is_active || !is_visible_ref.current) {
      return;
    }
    
    try {
      setIsPolling(true);
      const data = await obtenerPropuestasPendientes();
      const new_count = data.length;
      
      setLastCheck(new Date());
      
      // Solo notificar si hay MÁS propuestas que antes
      if (new_count > previous_count_ref.current) {
        const diff = new_count - previous_count_ref.current;
        setNewProposalsCount(diff);
        setHasNewProposals(true);
        
        console.log(`🔔 Nuevas propuestas detectadas: ${diff}`);
      }
    } catch (error) {
      console.error('❌ Error en polling de propuestas:', error);
    } finally {
      setIsPolling(false);
    }
  };

  /**
   * Reinicia el contador de nuevas propuestas
   * Se debe llamar después de actualizar la lista de propuestas
   */
  const resetNewProposals = () => {
    setHasNewProposals(false);
    setNewProposalsCount(0);
    previous_count_ref.current = current_count;
  };

  /**
   * Fuerza un check inmediato (útil para refrescar manualmente)
   */
  const forceCheck = async () => {
    await checkForNewProposals();
  };

  // Actualizar referencia cuando cambia el count actual
  useEffect(() => {
    if (!has_new_proposals) {
      previous_count_ref.current = current_count;
    }
  }, [current_count, has_new_proposals]);

  // Iniciar/detener polling según estado activo
  useEffect(() => {
    if (!is_active) {
      if (polling_interval_ref.current) {
        clearInterval(polling_interval_ref.current);
        polling_interval_ref.current = null;
      }
      return;
    }

    // Check inicial después del delay
    const initial_timeout = setTimeout(() => {
      checkForNewProposals();
    }, INITIAL_DELAY);
    
    // Polling recurrente
    polling_interval_ref.current = setInterval(() => {
      checkForNewProposals();
    }, POLLING_INTERVAL);

    console.log('✅ Polling de propuestas iniciado');

    return () => {
      clearTimeout(initial_timeout);
      if (polling_interval_ref.current) {
        clearInterval(polling_interval_ref.current);
        polling_interval_ref.current = null;
      }
      console.log('🛑 Polling de propuestas detenido');
    };
  }, [is_active]);

  // Detectar visibilidad de página
  useEffect(() => {
    const handleVisibilityChange = () => {
      const is_now_visible = !document.hidden;
      is_visible_ref.current = is_now_visible;
      
      if (is_now_visible && is_active) {
        console.log('👀 Usuario volvió a la página - Verificando propuestas...');
        // Usuario volvió -> hacer check inmediato
        checkForNewProposals();
      } else {
        console.log('🙈 Usuario salió de la página - Pausando polling');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [is_active]);

  return {
    has_new_proposals,
    new_proposals_count,
    is_polling,
    last_check,
    resetNewProposals,
    forceCheck
  };
};
