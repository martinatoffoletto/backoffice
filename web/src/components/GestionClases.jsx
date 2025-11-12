import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import PopUp from "@/components/PopUp";
import { useState, useEffect, useMemo, useCallback } from "react";
import { altaClase, obtenerClasesPorCurso, modificarClase, bajaClase, cambiarEstadoClase } from "@/api/clasesApi";

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

export default function GestionClases({ id_curso, fecha_inicio, fecha_fin, dia, turno }) {
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
  const [pendingEstadoChange, setPendingEstadoChange] = useState({ id_clase: null, nuevo_estado: null });
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const cargarClases = useCallback(async () => {
    setLoading(true);
    try {
      const response = await obtenerClasesPorCurso(id_curso, true);
      // Asegurar que siempre sea un array
      setClases(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Error al cargar clases:", err);
      setError("Error al cargar las clases del curso.");
      // En caso de error, asegurar array vacío
      setClases([]);
    } finally {
      setLoading(false);
    }
  }, [id_curso]);

  useEffect(() => {
    if (id_curso) {
      cargarClases();
    }
  }, [id_curso, cargarClases]);


  // Calcular días del calendario según el día de cursada
  const diasCalendario = useMemo(() => {
    if (!fecha_inicio || !fecha_fin || !dia) return [];

    // Convertir a Date si es string o mantener si ya es Date
    const inicio = fecha_inicio instanceof Date ? fecha_inicio : new Date(fecha_inicio);
    const fin = fecha_fin instanceof Date ? fecha_fin : new Date(fecha_fin);
    
    // Validar que las fechas sean válidas
    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) return [];
    
    const diaSemana = diaSemanaMap[dia.toLowerCase()];
    const dias = [];

    // Iterar desde fecha_inicio hasta fecha_fin
    const fechaActual = new Date(inicio);
    while (fechaActual <= fin) {
      if (fechaActual.getDay() === diaSemana) {
        dias.push(new Date(fechaActual));
      }
      fechaActual.setDate(fechaActual.getDate() + 1);
    }

    // Si es turno Noche, agregar un sábado aleatorio del rango
    if (turno && turno.toLowerCase() === "noche") {
      const sabados = [];
      const fechaSabado = new Date(inicio);
      while (fechaSabado <= fin) {
        if (fechaSabado.getDay() === 6) {
          sabados.push(new Date(fechaSabado));
        }
        fechaSabado.setDate(fechaSabado.getDate() + 1);
      }
      if (sabados.length > 0) {
        const sabadoAleatorio = sabados[Math.floor(Math.random() * sabados.length)];
        // Solo agregar si no está ya en la lista
        const yaExiste = dias.some(
          (d) => d.toDateString() === sabadoAleatorio.toDateString()
        );
        if (!yaExiste) {
          dias.push(sabadoAleatorio);
        }
      }
    }

    // Ordenar por fecha
    return dias.sort((a, b) => a - b);
  }, [fecha_inicio, fecha_fin, dia, turno]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tituloTrimmed = form.titulo.trim();
    
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

    try {
      // Convertir fecha a formato ISO string (YYYY-MM-DD) usando fecha local
      const fechaClase = fechaToLocalISOString(form.fecha_clase);
      
      if (editingClase) {
        await modificarClase(editingClase.id_clase, {
          titulo: tituloTrimmed,
          descripcion: form.descripcion || null,
          fecha_clase: fechaClase,
          tipo: form.tipo,
          estado: form.estado,
          observaciones: form.observaciones || null,
        });
      } else {
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
      // Cargar las clases actualizadas antes de limpiar el formulario
      await cargarClases();
      cleanForm();
      setSelectedDateBox(null);
    } catch (err) {
      console.error("Error al guardar clase:", err);
      let errorMessage = "Error al guardar la clase";
      
      if (err.response?.status === 422) {
        // Error de validación
        const detail = err.response?.data?.detail;
        if (Array.isArray(detail)) {
          // Pydantic devuelve una lista de errores
          errorMessage = detail.map((error) => {
            const field = error.loc?.join('.') || 'campo';
            return `${field}: ${error.msg}`;
          }).join(', ');
        } else if (typeof detail === 'string') {
          errorMessage = detail;
        } else {
          errorMessage = "Error de validación. Verificá que todos los campos cumplan con los requisitos.";
        }
      } else {
        errorMessage = err.response?.data?.detail || err.message || errorMessage;
      }
      
      setError(errorMessage);
    }
  };

  const handleEdit = (clase) => {
    setEditingClase(clase);
    const fechaNormalizada = clase.fecha_clase ? normalizarFecha(clase.fecha_clase) : null;
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
      setError(err.response?.data?.detail || err.message || "Error al eliminar la clase");
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
      setError(err.response?.data?.detail || err.message || "Error al cambiar el estado");
    }
  };

  const confirmarCancelacion = async () => {
    if (!pendingEstadoChange.id_clase || !pendingEstadoChange.nuevo_estado) return;
    
    try {
      await cambiarEstadoClase(pendingEstadoChange.id_clase, pendingEstadoChange.nuevo_estado);
      await cargarClases();
      setShowConfirmCancel(false);
      setPendingEstadoChange({ id_clase: null, nuevo_estado: null });
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Error al cancelar la clase");
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

  // Función helper para normalizar fechas (solo año, mes, día)
  const normalizarFecha = (fecha) => {
    if (!fecha) return null;
    
    let date;
    if (fecha instanceof Date) {
      date = fecha;
    } else if (typeof fecha === 'string') {
      // Si es un string en formato ISO (YYYY-MM-DD), parsearlo directamente sin zona horaria
      if (/^\d{4}-\d{2}-\d{2}/.test(fecha)) {
        const [year, month, day] = fecha.split('T')[0].split('-').map(Number);
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
  };

  const obtenerClasePorFecha = (fecha) => {
    if (!fecha) return null;
    const fechaNormalizada = normalizarFecha(fecha);
    if (!fechaNormalizada) return null;
    
    // Asegurar que clases sea un array antes de usar .find()
    if (!Array.isArray(clases)) return null;
    
    const claseEncontrada = clases.find((c) => {
      if (!c || !c.fecha_clase) return false;
      const claseFechaNormalizada = normalizarFecha(c.fecha_clase);
      if (!claseFechaNormalizada) return false;
      const coincide = fechaNormalizada.getTime() === claseFechaNormalizada.getTime();
      return coincide;
    });
    
    return claseEncontrada;
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
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const day = String(fecha.getDate()).padStart(2, '0');
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
    <div className="flex flex-col w-full items-start justify-start mt-6 py-4">
      <div className="w-full max-w-4xl">
        <h1 className="font-bold text-start text-xl mb-4 text-black">
          Gestión de Clases del Curso
        </h1>
        <span className="block w-full h-[2px] bg-sky-950 mb-6"></span>

        {/* Cajas de días del calendario */}
        {diasCalendario.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-4 text-black">
              Días de Clase Programados
            </h2>
            <div className="flex flex-wrap gap-3">
              {diasCalendario.map((fecha) => {
                const claseExistente = obtenerClasePorFecha(fecha);
                const isSelected = selectedDateBox === fecha.toDateString();
                const diaNumero = format(fecha, "d");
                const mesCorto = format(fecha, "MMM", { locale: es }).toUpperCase();

                return (
                  <button
                    key={fecha.toDateString()}
                    type="button"
                    onClick={() => handleDateBoxClick(fecha)}
                    className={`
                      flex flex-col items-center justify-center
                      w-16 h-16 rounded-lg border-2 transition-all shadow-md
                      ${claseExistente
                        ? "border-green-500 bg-green-50 shadow-green-200"
                        : isSelected
                        ? "border-blue-600 bg-blue-50 shadow-blue-200"
                        : "border-orange-500 bg-orange-50 shadow-orange-200 hover:border-orange-600 hover:shadow-orange-300"
                      }
                    `}
                  >
                    <span className="text-lg font-bold text-gray-800">{diaNumero}</span>
                    <span className="text-xs font-medium text-gray-600">{mesCorto}</span>
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
                        onSelect={(date) => setForm({ ...form, fecha_clase: date })}
                        initialFocus
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
                      <SelectItem value="parcial">Parcial</SelectItem>
                      <SelectItem value="final">Final</SelectItem>
                      <SelectItem value="trabajo_practico">Trabajo Práctico</SelectItem>
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
                      <SelectItem value="reprogramada">Reprogramada</SelectItem>
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
                    <TableCell>{clase.tipo}</TableCell>
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
                          <SelectItem value="reprogramada">Reprogramada</SelectItem>
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
          <p className="mt-4 text-gray-500">No hay clases registradas para este curso.</p>
        )}
      </div>

      {error && (
        <PopUp
          title="Error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {/* Popup de confirmación para cancelar clase */}
      {showConfirmCancel && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl border-2 border-orange-500 w-96 max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4 text-orange-600">Confirmar Cancelación</h2>
            <p className="mb-6 text-gray-700">
              ¿Estás seguro de que deseas cancelar esta clase? Esta acción no se puede deshacer fácilmente.
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
            <h2 className="text-xl font-bold mb-4 text-red-600">Confirmar Eliminación</h2>
            <p className="mb-6 text-gray-700">
              ¿Estás seguro de que deseas eliminar esta clase? Esta acción es permanente y no se puede deshacer.
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

