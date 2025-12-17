import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import PopUp from "@/components/PopUp";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  altaClase,
  obtenerClasesPorCurso,
  modificarClase,
  bajaClase,
  cambiarEstadoClase,
} from "@/api/clasesApi";

// Mapeo de días de la semana (fuera del componente para evitar recreación)
const diaSemanaMap = {
  lunes: 1,
  martes: 2,
  miercoles: 3,
  jueves: 4,
  viernes: 5,
  sabado: 6,
  domingo: 0,
};

// Mapeo de tipos de clase para mostrar
const tipoClaseLabels = {
  regular: "Regular",
  parcial_1: "Parcial 1",
  parcial_2: "Parcial 2",
  recuperatorio: "Recuperatorio",
  final: "Final",
};

export default function GestionClases({
  id_curso,
  fecha_inicio,
  fecha_fin,
  dia,
  turno,
  materia,
  periodo,
  modalidad,
  titular,
  titular_uuid,
  auxiliar,
  auxiliar_uuid,
}) {
  // Debug: verificar que id_curso y UUIDs lleguen correctamente
  console.log("GestionClases - id_curso recibido:", id_curso);
  console.log("GestionClases - titular_uuid:", titular_uuid);
  console.log("GestionClases - auxiliar_uuid:", auxiliar_uuid);

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    fecha_clase: null,
    tipo: "regular",
    estado: "programada",
    observaciones: "",
  });
  const [clases, setClases] = useState([]);
  const [editingClase, setEditingClase] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDateBox, setSelectedDateBox] = useState(null);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [pendingEstadoChange, setPendingEstadoChange] = useState({
    id_clase: null,
    nuevo_estado: null,
  });
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Para forzar re-render de las cajas
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [sabadoIntegrador, setSabadoIntegrador] = useState(null); // Sábado aleatorio fijo para turno noche
  const [clasesLoaded, setClasesLoaded] = useState(false); // Bandera para saber si las clases ya se cargaron
  const [sabadoCalculado, setSabadoCalculado] = useState(false); // Bandera para saber si ya se calculó el sábado

  const cargarClases = useCallback(async () => {
    setLoading(true);
    try {
      const response = await obtenerClasesPorCurso(id_curso, true);
      // Asegurar que siempre sea un array
      const clasesActualizadas = Array.isArray(response) ? response : [];
      setClases(clasesActualizadas);
      setClasesLoaded(true); // Marcar que las clases ya se cargaron
    } catch (err) {
      console.error("Error al cargar clases:", err);
      setError("Error al cargar las clases del curso.");
      // En caso de error, asegurar array vacío
      setClases([]);
      setClasesLoaded(true); // Marcar como cargado incluso en error
    } finally {
      setLoading(false);
    }
  }, [id_curso]);

  useEffect(() => {
    if (id_curso) {
      cargarClases();
    }
  }, [id_curso, cargarClases]);

  // Función helper para normalizar fechas (solo año, mes, día)
  const normalizarFecha = useCallback((fecha) => {
    if (!fecha) return null;

    let date;
    if (fecha instanceof Date) {
      date = fecha;
    } else if (typeof fecha === "string") {
      // Si es un string en formato ISO (YYYY-MM-DD), parsearlo directamente sin zona horaria
      if (/^\d{4}-\d{2}-\d{2}/.test(fecha)) {
        const [year, month, day] = fecha.split("T")[0].split("-").map(Number);
        date = new Date(year, month - 1, day);
      } else {
        date = new Date(fecha);
      }
    } else {
      date = new Date(fecha);
    }

    if (isNaN(date.getTime())) return null;
    // Usar solo año, mes y día, ignorando hora
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }, []);

  // Calcular sábado aleatorio SOLO UNA VEZ para cursos de noche
  // Si ya existe una clase en un sábado, usar ese sábado en lugar de generar uno nuevo
  useEffect(() => {
    // ⚠️ IMPORTANTE: Solo ejecutar DESPUÉS de cargar las clases (cuando clasesLoaded = true)
    // Y solo una vez (cuando sabadoCalculado = false)
    if (turno && turno.toLowerCase() === "noche" && fecha_inicio && fecha_fin && clasesLoaded && !sabadoCalculado) {
      const inicio = fecha_inicio instanceof Date ? fecha_inicio : new Date(fecha_inicio);
      const fin = fecha_fin instanceof Date ? fecha_fin : new Date(fecha_fin);

      if (!isNaN(inicio.getTime()) && !isNaN(fin.getTime())) {
        // Primero, verificar si ya existe una clase en un sábado
        console.log("🔍 Buscando clases en sábado. Total clases:", clases.length);
        
        const claseEnSabado = clases.find((clase) => {
          if (!clase || !clase.fecha_clase) return false;
          const fechaClase = normalizarFecha(clase.fecha_clase);
          const esSabado = fechaClase && fechaClase.getDay() === 6;
          
          // Log para debugging
          if (fechaClase) {
            console.log(`  📅 Clase: ${clase.fecha_clase} → ${fechaClase.toDateString()} → Día: ${fechaClase.getDay()} → Es sábado: ${esSabado}`);
          }
          
          return esSabado;
        });

        if (claseEnSabado) {
          // Si ya hay una clase en un sábado, NO generamos uno nuevo
          // El sábado existente se mostrará automáticamente en la sección 2 (clases existentes)
          // Marcamos sabadoIntegrador como null para indicar que no hay que agregar sábado extra
          setSabadoIntegrador(null);
          console.log("♻️ Ya existe clase en sábado (", claseEnSabado.fecha_clase, "). No se genera sábado adicional.");
        } else {
          console.log("⚠️ No se encontró ninguna clase en sábado. Generando uno nuevo...");
          // Si no hay clase en sábado, generar uno aleatorio
          const sabados = [];
          const fechaSabado = new Date(inicio);
          
          while (fechaSabado <= fin) {
            if (fechaSabado.getDay() === 6) {
              sabados.push(new Date(fechaSabado));
            }
            fechaSabado.setDate(fechaSabado.getDate() + 1);
          }
          
          if (sabados.length > 0) {
            // Generar sábado aleatorio SOLO si no existe uno
            const aleatorio = sabados[Math.floor(Math.random() * sabados.length)];
            setSabadoIntegrador(aleatorio);
            console.log("🎲 Sábado integrador generado:", aleatorio.toDateString());
          }
        }
        
        // Marcar como calculado para que no se ejecute de nuevo
        setSabadoCalculado(true);
      }
    }
  }, [fecha_inicio, fecha_fin, turno, clases, clasesLoaded, sabadoCalculado, normalizarFecha]); // ✅ Se ejecuta SOLO después de que las clases se cargaron, UNA SOLA VEZ

  // Calcular días del calendario según el día de cursada Y las fechas de las clases existentes
  const diasCalendario = useMemo(() => {
    const dias = [];

    // 1. Calcular días basados en el curso (fecha_inicio, fecha_fin, dia, turno)
    if (fecha_inicio && fecha_fin && dia) {
      // Convertir a Date si es string o mantener si ya es Date
      const inicio =
        fecha_inicio instanceof Date ? fecha_inicio : new Date(fecha_inicio);
      const fin = fecha_fin instanceof Date ? fecha_fin : new Date(fecha_fin);

      // Validar que las fechas sean válidas
      if (!isNaN(inicio.getTime()) && !isNaN(fin.getTime())) {
        const diaSemana = diaSemanaMap[dia.toLowerCase()];

        // Iterar desde fecha_inicio hasta fecha_fin
        const fechaActual = new Date(inicio);
        while (fechaActual <= fin) {
          if (fechaActual.getDay() === diaSemana) {
            dias.push(new Date(fechaActual));
          }
          fechaActual.setDate(fechaActual.getDate() + 1);
        }

        // Si es turno Noche, agregar el sábado integrador (ya calculado en useEffect)
        if (sabadoIntegrador) {
          const sabadoNormalizado = normalizarFecha(sabadoIntegrador);
          const yaExiste = dias.some((d) => {
            const fechaD = normalizarFecha(d);
            return (
              fechaD &&
              sabadoNormalizado &&
              fechaD.getFullYear() === sabadoNormalizado.getFullYear() &&
              fechaD.getMonth() === sabadoNormalizado.getMonth() &&
              fechaD.getDate() === sabadoNormalizado.getDate()
            );
          });
          if (!yaExiste) {
            dias.push(sabadoIntegrador);
          }
        }
      }
    }

    // 2. Agregar fechas de las clases existentes (para incluir clases con fechas modificadas)
    if (Array.isArray(clases) && clases.length > 0) {
      clases.forEach((clase) => {
        if (clase && clase.fecha_clase) {
          const fechaClase = normalizarFecha(clase.fecha_clase);
          if (fechaClase) {
            // Verificar si la fecha ya está en la lista (misma lógica que el sábado)
            const yaExiste = dias.some((d) => {
              const fechaD = normalizarFecha(d);
              return (
                fechaD &&
                fechaD.getFullYear() === fechaClase.getFullYear() &&
                fechaD.getMonth() === fechaClase.getMonth() &&
                fechaD.getDate() === fechaClase.getDate()
              );
            });

            if (!yaExiste) {
              dias.push(fechaClase);
            }
          }
        }
      });
    }

    // Ordenar por fecha
    return dias.sort((a, b) => {
      const fechaA = normalizarFecha(a);
      const fechaB = normalizarFecha(b);
      if (!fechaA || !fechaB) return 0;
      return fechaA.getTime() - fechaB.getTime();
    });
  }, [fecha_inicio, fecha_fin, dia, clases, sabadoIntegrador]);

  // Función para realizar el guardado real de la clase
  const guardarClaseReal = async () => {
    const tituloTrimmed = form.titulo.trim();
    // Convertir fecha a formato ISO string (YYYY-MM-DD) usando fecha local
    const fechaClase = fechaToLocalISOString(form.fecha_clase);

    // Verificar si ya existe una clase para esta fecha
    const claseExistenteEnNuevaFecha = obtenerClasePorFecha(form.fecha_clase);

    if (editingClase) {
      // Si estamos editando una clase
      const fechaOriginalNormalizada = normalizarFecha(
        editingClase.fecha_clase
      );
      const fechaNuevaNormalizada = normalizarFecha(form.fecha_clase);
      const fechaCambio =
        fechaOriginalNormalizada &&
        fechaNuevaNormalizada &&
        fechaOriginalNormalizada.getTime() !==
          fechaNuevaNormalizada.getTime();

      if (
        fechaCambio &&
        claseExistenteEnNuevaFecha &&
        claseExistenteEnNuevaFecha.id_clase !== editingClase.id_clase
      ) {
        // La nueva fecha ya tiene una clase diferente, actualizar esa clase y eliminar la original
        await modificarClase(claseExistenteEnNuevaFecha.id_clase, {
          titulo: tituloTrimmed,
          descripcion: form.descripcion || null,
          fecha_clase: fechaClase,
          tipo: form.tipo,
          estado: form.estado,
          observaciones: form.observaciones || null,
        });
        // Eliminar la clase original ya que cambió de fecha
        await bajaClase(editingClase.id_clase);
      } else {
        // Actualizar la clase editada normalmente (misma fecha o fecha sin clase existente)
        await modificarClase(editingClase.id_clase, {
          titulo: tituloTrimmed,
          descripcion: form.descripcion || null,
          fecha_clase: fechaClase,
          tipo: form.tipo,
          estado: form.estado,
          observaciones: form.observaciones || null,
        });
      }
    } else {
      // Si estamos creando una nueva clase
      if (claseExistenteEnNuevaFecha) {
        // Ya existe una clase para esta fecha, actualizarla en lugar de crear una nueva
        await modificarClase(claseExistenteEnNuevaFecha.id_clase, {
          titulo: tituloTrimmed,
          descripcion: form.descripcion || null,
          fecha_clase: fechaClase,
          tipo: form.tipo,
          estado: form.estado,
          observaciones: form.observaciones || null,
        });
      } else {
        // No existe clase para esta fecha, crear una nueva
        await altaClase({
          id_curso: id_curso,
          titulo: tituloTrimmed,
          descripcion: form.descripcion || null,
          fecha_clase: fechaClase,
          tipo: form.tipo,
          estado: form.estado,
          observaciones: form.observaciones || null,
        });
      }
    }

    // Guardar información antes de limpiar para actualizar selectedDateBox
    const estabaEditando = editingClase !== null;
    const fechaOriginal = estabaEditando ? editingClase.fecha_clase : null;
    const fechaNueva = form.fecha_clase;

    // Determinar si cambió la fecha antes de limpiar
    let fechaCambio = false;
    let fechaNuevaParaSeleccionar = null;

    if (estabaEditando && fechaOriginal && fechaNueva) {
      const fechaOriginalNormalizada = normalizarFecha(fechaOriginal);
      const fechaNuevaNormalizada = normalizarFecha(fechaNueva);
      fechaCambio =
        fechaOriginalNormalizada &&
        fechaNuevaNormalizada &&
        fechaOriginalNormalizada.getTime() !==
          fechaNuevaNormalizada.getTime();

      if (fechaCambio) {
        // Preparar la fecha para seleccionar después de cargar
        const fechaParaSeleccionar =
          fechaNueva instanceof Date ? fechaNueva : new Date(fechaNueva);
        fechaNuevaParaSeleccionar = normalizarFecha(fechaParaSeleccionar);
      }
    }

    // Cargar las clases actualizadas antes de limpiar el formulario
    await cargarClases();

    // Limpiar el formulario
    cleanForm();

    // Si se cambió la fecha, actualizar selectedDateBox a la nueva fecha
    if (fechaCambio && fechaNuevaParaSeleccionar) {
      // Usar setTimeout para asegurar que el estado se actualice después del render
      setTimeout(() => {
        setSelectedDateBox(fechaNuevaParaSeleccionar.toDateString());
        // Forzar re-render después de actualizar selectedDateBox
        setRefreshKey((prev) => prev + 1);
      }, 100);
    } else {
      // Si no cambió la fecha o no estaba editando, limpiar la selección
      setSelectedDateBox(null);
      // Forzar re-render de las cajas
      setTimeout(() => {
        setRefreshKey((prev) => prev + 1);
      }, 100);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tituloTrimmed = form.titulo.trim();

    // Validaciones
    if (!tituloTrimmed || !form.fecha_clase) {
      setError("Por favor, completá todos los campos obligatorios.");
      return;
    }

    if (tituloTrimmed.length < 3) {
      setError("El título debe tener al menos 3 caracteres.");
      return;
    }

    if (tituloTrimmed.length > 200) {
      setError("El título no puede tener más de 200 caracteres.");
      return;
    }

    // Validar que la fecha sea válida
    const fechaNormalizada = normalizarFecha(form.fecha_clase);
    if (!fechaNormalizada) {
      setError("La fecha seleccionada no es válida.");
      return;
    }

    // Validar que solo haya una clase de cada tipo específico (parcial_1, parcial_2, recuperatorio, final)
    const idClaseAExcluir = editingClase ? editingClase.id_clase : null;
    if (existeClaseDeTipo(form.tipo, idClaseAExcluir)) {
      const nombreTipo = tipoClaseLabels[form.tipo] || form.tipo;
      setError(`Ya existe una clase de tipo "${nombreTipo}". Solo puede haber una clase de este tipo.`);
      return;
    }

    // Solo validar que la fecha esté en diasCalendario si estamos CREANDO una nueva clase
    // Si estamos EDITANDO una clase existente, permitir cambiar la fecha a cualquier fecha
    if (!editingClase) {
      // Validar que la fecha esté en los días del calendario permitidos para nuevas clases
      const fechaEstaEnCalendario = diasCalendario.some((fechaCal) => {
        const fechaCalNormalizada = normalizarFecha(fechaCal);
        if (!fechaCalNormalizada || !fechaNormalizada) return false;
        // Comparar año, mes y día directamente
        return (
          fechaCalNormalizada.getFullYear() ===
            fechaNormalizada.getFullYear() &&
          fechaCalNormalizada.getMonth() === fechaNormalizada.getMonth() &&
          fechaCalNormalizada.getDate() === fechaNormalizada.getDate()
        );
      });

      if (!fechaEstaEnCalendario) {
        setError(
          "Solo se pueden crear clases para los días programados en el calendario del curso."
        );
        return;
      }
    }

    // Si todas las validaciones pasan, mostrar el popup de confirmación
    const isEdit = Boolean(editingClase);
    const fechaFormateada = format(form.fecha_clase, "dd/MM/yyyy");
    const nombreTipo = tipoClaseLabels[form.tipo] || form.tipo;

    setConfirmDialog({
      title: isEdit ? "Confirmar actualización" : "Confirmar creación",
      message: `¿Confirmás ${isEdit ? "actualizar" : "crear"} la clase "${tituloTrimmed}" (${nombreTipo}) del ${fechaFormateada}?`,
      confirmText: isEdit ? "Actualizar" : "Guardar",
      onConfirm: async () => {
        try {
          await guardarClaseReal();

          // Mostrar éxito en el mismo modal
          setConfirmDialog({
            title: "Operación exitosa",
            message: isEdit
              ? "Clase actualizada correctamente."
              : "Clase creada correctamente.",
            confirmText: "Aceptar",
            hideCancel: true,
            onConfirm: () => {
              setConfirmDialog(null);
            },
          });

          // Cerrar el modal automáticamente después de 1.5 segundos
          setTimeout(() => {
            setConfirmDialog(null);
          }, 1500);
        } catch (err) {
          console.error("Error al guardar clase:", err);
          let errorMessage = "Error al guardar la clase";

          if (err.response?.status === 422) {
            // Error de validación
            const detail = err.response?.data?.detail;
            if (Array.isArray(detail)) {
              // Pydantic devuelve una lista de errores
              errorMessage = detail
                .map((error) => {
                  const field = error.loc?.join(".") || "campo";
                  return `${field}: ${error.msg}`;
                })
                .join(", ");
            } else if (typeof detail === "string") {
              errorMessage = detail;
            } else {
              errorMessage =
                "Error de validación. Verificá que todos los campos cumplan con los requisitos.";
            }
          } else {
            errorMessage =
              err.response?.data?.detail || err.message || errorMessage;
          }

          setError(errorMessage);
          setConfirmDialog(null);
        }
      },
    });
  };

  const handleEdit = (clase) => {
    setEditingClase(clase);
    const fechaNormalizada = clase.fecha_clase
      ? normalizarFecha(clase.fecha_clase)
      : null;
    setForm({
      titulo: clase.titulo || "",
      descripcion: clase.descripcion || "",
      fecha_clase: fechaNormalizada,
      tipo: clase.tipo || "regular",
      estado: clase.estado || "programada",
      observaciones: clase.observaciones || "",
    });
  };

  const handleDelete = (id_clase) => {
    setPendingDeleteId(id_clase);
    setShowConfirmDelete(true);
  };

  const confirmarEliminacion = async () => {
    if (!pendingDeleteId) return;

    try {
      await bajaClase(pendingDeleteId);
      await cargarClases();
      setShowConfirmDelete(false);
      setPendingDeleteId(null);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Error al eliminar la clase"
      );
      setShowConfirmDelete(false);
      setPendingDeleteId(null);
    }
  };

  const cancelarEliminacion = () => {
    setShowConfirmDelete(false);
    setPendingDeleteId(null);
  };

  const handleCambiarEstado = async (id_clase, nuevo_estado) => {
    // Si el nuevo estado es "cancelada", mostrar popup de confirmación
    if (nuevo_estado === "cancelada") {
      setPendingEstadoChange({ id_clase, nuevo_estado });
      setShowConfirmCancel(true);
      return;
    }

    // Para otros estados, cambiar directamente
    try {
      await cambiarEstadoClase(id_clase, nuevo_estado);
      await cargarClases();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Error al cambiar el estado"
      );
    }
  };

  const confirmarCancelacion = async () => {
    if (!pendingEstadoChange.id_clase || !pendingEstadoChange.nuevo_estado)
      return;

    try {
      await cambiarEstadoClase(
        pendingEstadoChange.id_clase,
        pendingEstadoChange.nuevo_estado
      );
      await cargarClases();
      setShowConfirmCancel(false);
      setPendingEstadoChange({ id_clase: null, nuevo_estado: null });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Error al cancelar la clase"
      );
      setShowConfirmCancel(false);
      setPendingEstadoChange({ id_clase: null, nuevo_estado: null });
    }
  };

  const cancelarConfirmacion = () => {
    setShowConfirmCancel(false);
    setPendingEstadoChange({ id_clase: null, nuevo_estado: null });
    // Recargar clases para restaurar el estado anterior en el select
    cargarClases();
  };

  const cleanForm = () => {
    setForm({
      titulo: "",
      descripcion: "",
      fecha_clase: null,
      tipo: "regular",
      estado: "programada",
      observaciones: "",
    });
    setEditingClase(null);
    setSelectedDateBox(null);
  };

  const obtenerClasePorFecha = (fecha) => {
    if (!fecha) return null;
    const fechaNormalizada = normalizarFecha(fecha);
    if (!fechaNormalizada) return null;

    // Asegurar que clases sea un array antes de usar .find()
    if (!Array.isArray(clases) || clases.length === 0) return null;

    const claseEncontrada = clases.find((c) => {
      if (!c || !c.fecha_clase) return false;
      const claseFechaNormalizada = normalizarFecha(c.fecha_clase);
      if (!claseFechaNormalizada) return false;
      // Comparar año, mes y día directamente para evitar problemas de tiempo
      return (
        fechaNormalizada.getFullYear() ===
          claseFechaNormalizada.getFullYear() &&
        fechaNormalizada.getMonth() === claseFechaNormalizada.getMonth() &&
        fechaNormalizada.getDate() === claseFechaNormalizada.getDate()
      );
    });

    return claseEncontrada;
  };

  // Función para verificar si ya existe una clase de un tipo específico
  // Excluye la clase que se está editando (si existe) y las clases canceladas
  const existeClaseDeTipo = (tipo, excluirIdClase = null) => {
    // Solo validar estos tipos específicos
    const tiposUnicos = ["parcial_1", "parcial_2", "recuperatorio", "final"];
    
    // Si el tipo no está en la lista de tipos únicos, no validar
    if (!tiposUnicos.includes(tipo)) {
      return false;
    }

    // Asegurar que clases sea un array antes de usar .find()
    if (!Array.isArray(clases) || clases.length === 0) return false;

    // Buscar si existe una clase del mismo tipo, excluyendo la que se está editando y las canceladas
    const claseExistente = clases.find((c) => {
      if (!c) return false;
      // Si estamos editando, excluir la clase actual
      if (excluirIdClase && c.id_clase === excluirIdClase) return false;
      // Excluir clases canceladas (se puede tener otra clase del mismo tipo si la anterior está cancelada)
      if (c.estado === "cancelada") return false;
      // Verificar que el tipo coincida
      return c.tipo === tipo;
    });

    return claseExistente !== undefined;
  };

  // Función helper para formatear fecha para mostrar
  const formatearFechaParaMostrar = (fecha) => {
    if (!fecha) return "-";
    const fechaNormalizada = normalizarFecha(fecha);
    return fechaNormalizada ? format(fechaNormalizada, "dd/MM/yyyy") : "-";
  };

  // Función helper para convertir Date a string YYYY-MM-DD (fecha local, sin zona horaria)
  const fechaToLocalISOString = (fecha) => {
    if (!fecha) return null;
    if (fecha instanceof Date) {
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, "0");
      const day = String(fecha.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    return fecha;
  };

  const handleDateBoxClick = (fecha) => {
    // Verificar si ya existe una clase para esta fecha
    const claseExistente = obtenerClasePorFecha(fecha);

    if (claseExistente) {
      handleEdit(claseExistente);
    } else {
      setForm({
        titulo: "",
        descripcion: "",
        fecha_clase: fecha,
        tipo: "regular",
        estado: "programada",
        observaciones: "",
      });
      setEditingClase(null);
    }
    setSelectedDateBox(fecha.toDateString());
  };

  return (
    <div className="flex flex-col w-full items-center justify-start mt-6 py-4">
      <div className="w-full max-w-4xl">
        <h1 className="font-bold text-center text-xl mb-4 text-black">
          Gestión de Clases del Curso
        </h1>
        <span className="block w-full h-[2px] bg-sky-950 mb-4"></span>

        {/* Información del Curso */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Materia</p>
              <p className="font-semibold text-gray-800">{materia || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Turno</p>
              <p className="font-semibold text-gray-800">
                {turno
                  ? turno.charAt(0).toUpperCase() + turno.slice(1).toLowerCase()
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Período</p>
              <p className="font-semibold text-gray-800">{periodo || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Modalidad</p>
              <p className="font-semibold text-gray-800">
                {modalidad
                  ? modalidad.charAt(0).toUpperCase() +
                    modalidad.slice(1).toLowerCase()
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Docente Titular</p>
              <p className="font-semibold text-gray-800">
                {titular || "Sin asignar"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Docente Auxiliar</p>
              <p className="font-semibold text-gray-800">
                {auxiliar || "Sin asignar"}
              </p>
            </div>
          </div>
        </div>

        {/* Cajas de días del calendario */}
        {diasCalendario.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-4 text-black">
              Días de Clase Programados
            </h2>
            <div className="flex flex-wrap gap-3" key={refreshKey}>
              {diasCalendario.map((fecha) => {
                const claseExistente = obtenerClasePorFecha(fecha);
                const estaCancelada =
                  claseExistente && claseExistente.estado === "cancelada";
                // Normalizar ambas fechas para comparar correctamente
                const fechaNormalizada = normalizarFecha(fecha);
                const selectedDateNormalizada = selectedDateBox
                  ? normalizarFecha(new Date(selectedDateBox))
                  : null;
                const isSelected =
                  selectedDateNormalizada &&
                  fechaNormalizada &&
                  selectedDateNormalizada.getTime() ===
                    fechaNormalizada.getTime();
                const diaNumero = format(fecha, "d");
                const mesCorto = format(fecha, "MMM", {
                  locale: es,
                }).toUpperCase();

                return (
                  <button
                    key={`${fecha.toDateString()}-${refreshKey}`}
                    type="button"
                    onClick={() => handleDateBoxClick(fecha)}
                    className={`
                      flex flex-col items-center justify-center
                      w-16 h-16 rounded-lg border-2 transition-all shadow-md
                      ${
                        estaCancelada
                          ? "border-red-500 bg-red-50 shadow-red-200"
                          : claseExistente
                          ? "border-green-500 bg-green-50 shadow-green-200"
                          : isSelected
                          ? "border-blue-600 bg-blue-50 shadow-blue-200"
                          : "border-orange-500 bg-orange-50 shadow-orange-200 hover:border-orange-600 hover:shadow-orange-300"
                      }
                    `}
                  >
                    <span className="text-lg font-bold text-gray-800">
                      {diaNumero}
                    </span>
                    <span className="text-xs font-medium text-gray-600">
                      {mesCorto}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Formulario de clase - Solo se muestra si hay una fecha seleccionada o se está editando */}
        {(selectedDateBox || editingClase) && (
          <form onSubmit={handleSubmit} className="mb-6">
            <FieldSet>
              <FieldGroup className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field>
                    <FieldLabel>
                      Título <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id="titulo"
                      placeholder="Título de la clase (mínimo 3 caracteres)"
                      value={form.titulo}
                      minLength={3}
                      maxLength={200}
                      onChange={(e) =>
                        setForm({ ...form, titulo: e.target.value })
                      }
                    />
                  </Field>

                  <Field>
                    <FieldLabel>
                      Fecha <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {form.fecha_clase ? (
                            format(form.fecha_clase, "PPP")
                          ) : (
                            <span>Seleccioná una fecha</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={form.fecha_clase}
                          onSelect={(date) =>
                            setForm({ ...form, fecha_clase: date })
                          }
                          initialFocus
                          disabled={(date) => {
                            // Si estamos editando una clase, permitir cualquier fecha
                            // Si estamos creando una nueva clase, solo permitir fechas en diasCalendario
                            if (editingClase) {
                              return false; // Permitir todas las fechas al editar
                            }

                            // Para nuevas clases, solo permitir fechas en diasCalendario
                            if (!date) return true;
                            const fechaNormalizada = normalizarFecha(date);
                            if (!fechaNormalizada) return true;

                            return !diasCalendario.some((fechaCal) => {
                              const fechaCalNormalizada =
                                normalizarFecha(fechaCal);
                              return (
                                fechaCalNormalizada &&
                                fechaCalNormalizada.getTime() ===
                                  fechaNormalizada.getTime()
                              );
                            });
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field>
                    <FieldLabel>Tipo</FieldLabel>
                    <Select
                      value={form.tipo}
                      onValueChange={(value) =>
                        setForm({ ...form, tipo: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem 
                          value="parcial_1" 
                          disabled={existeClaseDeTipo("parcial_1", editingClase?.id_clase)}
                        >
                          Parcial 1
                        </SelectItem>
                        <SelectItem 
                          value="parcial_2" 
                          disabled={existeClaseDeTipo("parcial_2", editingClase?.id_clase)}
                        >
                          Parcial 2
                        </SelectItem>
                        <SelectItem 
                          value="recuperatorio"
                          disabled={existeClaseDeTipo("recuperatorio", editingClase?.id_clase)}
                        >
                          Recuperatorio
                        </SelectItem>
                        <SelectItem 
                          value="final"
                          disabled={existeClaseDeTipo("final", editingClase?.id_clase)}
                        >
                          Final
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel>Estado</FieldLabel>
                    <Select
                      value={form.estado}
                      onValueChange={(value) =>
                        setForm({ ...form, estado: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="programada">Programada</SelectItem>
                        <SelectItem value="dictada">Dictada</SelectItem>
                        <SelectItem value="reprogramada">
                          Reprogramada
                        </SelectItem>
                        <SelectItem value="cancelada">Cancelada</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <Field>
                  <FieldLabel>Descripción</FieldLabel>
                  <Input
                    id="descripcion"
                    placeholder="Descripción de la clase (opcional)"
                    value={form.descripcion}
                    onChange={(e) =>
                      setForm({ ...form, descripcion: e.target.value })
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel>Observaciones</FieldLabel>
                  <Input
                    id="observaciones"
                    placeholder="Observaciones (opcional)"
                    value={form.observaciones}
                    onChange={(e) =>
                      setForm({ ...form, observaciones: e.target.value })
                    }
                  />
                </Field>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md"
                  >
                    {editingClase ? "Actualizar Clase" : "Guardar Clase"}
                  </Button>
                  <Button
                    type="button"
                    onClick={cleanForm}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-2 rounded-md"
                  >
                    Cancelar
                  </Button>
                </div>
              </FieldGroup>
            </FieldSet>
          </form>
        )}

        {/* Lista de clases */}
        {loading ? (
          <p className="text-gray-500">Cargando clases...</p>
        ) : Array.isArray(clases) && clases.length > 0 ? (
          <div className="mt-6 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clases.map((clase) => (
                  <TableRow key={clase.id_clase}>
                    <TableCell>{clase.titulo}</TableCell>
                    <TableCell>
                      {formatearFechaParaMostrar(clase.fecha_clase)}
                    </TableCell>
                    <TableCell>
                      {tipoClaseLabels[clase.tipo] || clase.tipo}
                    </TableCell>
                    <TableCell>
                      <Select
                        key={`${clase.id_clase}-${clase.estado}`}
                        value={clase.estado}
                        onValueChange={(nuevo_estado) =>
                          handleCambiarEstado(clase.id_clase, nuevo_estado)
                        }
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="programada">Programada</SelectItem>
                          <SelectItem value="dictada">Dictada</SelectItem>
                          <SelectItem value="reprogramada">
                            Reprogramada
                          </SelectItem>
                          <SelectItem value="cancelada">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(clase)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                        >
                          Editar
                        </Button>
                        <Button
                          onClick={() => handleDelete(clase.id_clase)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                        >
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="mt-4 text-gray-500">
            No hay clases registradas para este curso.
          </p>
        )}
      </div>

      {error && (
        <PopUp title="Error" message={error} onClose={() => setError(null)} />
      )}

      {/* Popup de confirmación para guardar/actualizar clase */}
      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={confirmDialog.confirmText}
          hideCancel={confirmDialog.hideCancel}
          onConfirm={async () => {
            const currentDialog = confirmDialog;
            if (currentDialog.hideCancel) {
              // Si es el modal de éxito, solo ejecutar el callback
              currentDialog.onConfirm?.();
              return;
            }
            setConfirmDialog((prev) =>
              prev ? { ...prev, loading: true } : prev
            );
            try {
              await currentDialog.onConfirm?.();
            } finally {
              // No cerrar aquí, el onConfirm interno lo maneja
            }
          }}
          onCancel={() => setConfirmDialog(null)}
          loading={Boolean(confirmDialog.loading)}
        />
      )}

      {/* Popup de confirmación para cancelar clase */}
      {showConfirmCancel && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl border-2 border-orange-500 w-96 max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4 text-orange-600">
              Confirmar Cancelación
            </h2>
            <p className="mb-6 text-gray-700">
              ¿Estás seguro de que deseas cancelar esta clase? Esta acción no se
              puede deshacer fácilmente.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                onClick={cancelarConfirmacion}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmarCancelacion}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Confirmar Cancelación
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Popup de confirmación para eliminar clase */}
      {showConfirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl border-2 border-red-500 w-96 max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4 text-red-600">
              Confirmar Eliminación
            </h2>
            <p className="mb-6 text-gray-700">
              ¿Estás seguro de que deseas eliminar esta clase? Esta acción es
              permanente y no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                onClick={cancelarEliminacion}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmarEliminacion}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
