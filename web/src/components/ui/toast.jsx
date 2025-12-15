import { useEffect, useState } from 'react';
import { XIcon, CheckCircleIcon, InfoIcon, AlertCircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Componente Toast para notificaciones flotantes
 * Sin dependencias externas, totalmente custom
 */
export const Toast = ({ 
  show, 
  title, 
  description, 
  variant = 'info', 
  duration = 5000,
  onClose,
  action
}) => {
  const [is_visible, setIsVisible] = useState(show);
  const [is_exiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsExiting(false);
      
      // Auto-cerrar después de duration (si no es 0)
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    }
  }, [show, duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
      onClose?.();
    }, 300); // Duración de la animación
  };

  if (!is_visible) return null;

  const variantStyles = {
    success: {
      bg: 'bg-green-50 border-green-200',
      icon: 'text-green-500',
      text: 'text-green-800',
      IconComponent: CheckCircleIcon
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      icon: 'text-red-500',
      text: 'text-red-800',
      IconComponent: AlertCircleIcon
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-500',
      text: 'text-blue-800',
      IconComponent: InfoIcon
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      icon: 'text-yellow-500',
      text: 'text-yellow-800',
      IconComponent: AlertCircleIcon
    }
  };

  const style = variantStyles[variant] || variantStyles.info;
  const IconComponent = style.IconComponent;

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-[100] w-full max-w-sm pointer-events-auto',
        'transform transition-all duration-300 ease-in-out',
        is_exiting 
          ? 'translate-x-full opacity-0' 
          : 'translate-x-0 opacity-100'
      )}
    >
      <div
        className={cn(
          'rounded-lg border shadow-lg p-4',
          style.bg,
          'animate-in slide-in-from-right-full'
        )}
      >
        <div className="flex items-start gap-3">
          {/* Icono */}
          <IconComponent className={cn('w-5 h-5 flex-shrink-0 mt-0.5', style.icon)} />
          
          {/* Contenido */}
          <div className="flex-1 min-w-0">
            <p className={cn('font-semibold text-sm', style.text)}>
              {title}
            </p>
            {description && (
              <p className={cn('text-xs mt-1', style.text, 'opacity-80')}>
                {description}
              </p>
            )}
            {action && (
              <button
                onClick={action.onClick}
                className={cn(
                  'text-xs font-medium mt-2 underline hover:no-underline',
                  style.text
                )}
              >
                {action.label}
              </button>
            )}
          </div>

          {/* Botón cerrar */}
          <button
            onClick={handleClose}
            className={cn(
              'flex-shrink-0 rounded-sm opacity-70 hover:opacity-100 transition-opacity',
              style.icon
            )}
          >
            <XIcon className="w-4 h-4" />
            <span className="sr-only">Cerrar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Hook para gestionar múltiples toasts
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = ({ title, description, variant = 'info', duration = 5000, action }) => {
    const toast_id = Date.now();
    
    setToasts((prev) => [
      ...prev,
      { id: toast_id, title, description, variant, duration, action, show: true }
    ]);

    return toast_id;
  };

  const hideToast = (toast_id) => {
    setToasts((prev) => prev.filter((t) => t.id !== toast_id));
  };

  return {
    toasts,
    showToast,
    hideToast,
    success: (title, description, action) => 
      showToast({ title, description, variant: 'success', action }),
    error: (title, description, action) => 
      showToast({ title, description, variant: 'error', action }),
    info: (title, description, action) => 
      showToast({ title, description, variant: 'info', action }),
    warning: (title, description, action) => 
      showToast({ title, description, variant: 'warning', action })
  };
};

/**
 * Contenedor para renderizar todos los toasts
 */
export const ToastContainer = ({ toasts, onClose }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          show={toast.show}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          duration={toast.duration}
          action={toast.action}
          onClose={() => onClose(toast.id)}
        />
      ))}
    </div>
  );
};
