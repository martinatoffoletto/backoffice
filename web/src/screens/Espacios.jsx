import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useMemo, useState } from "react";
import Spinner from "@/components/ui/spinner";
import PopUp from "@/components/PopUp";
import {
  altaEspacio,
  actualizarEspacio,
  bajaEspacio,
  obtenerEspacios,
} from "@/api/espaciosApi";
import { obtenerSedes } from "@/api/sedesApi";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConfirmDialog from "@/components/ConfirmDialog";

const ESTADOS = [
  { label: "Disponible", value: "DISPONIBLE" },
  { label: "Ocupado", value: "OCUPADO" },
  { label: "En mantenimiento", value: "EN_MANTENIMIENTO" },
];

const TIPOS = [
  { label: "Aula", value: "AULA" },
  { label: "Laboratorio", value: "LABORATORIO" },
  { label: "Espacio común", value: "ESPACIO_COMUN" },
  { label: "Oficina", value: "OFICINA" },
  { label: "Otros", value: "OTROS" },
];

export default function Espacios() {
  const [espacios, setEspacios] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEspacio, setEditingEspacio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("active");
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    tipo: "",
    capacidad: "",
    ubicacion: "",
    estado: "DISPONIBLE",
    id_sede: "",
  });

  const initialFormState = useMemo(
    () => ({
      nombre: "",
      tipo: "",
      capacidad: "",
      ubicacion: "",
      estado: "DISPONIBLE",
      id_sede: "",
    }),
    []
  );

  const sedesMap = useMemo(() => {
    return sedes.reduce((acc, sede) => {
      if (sede?.id_sede) {
        acc[sede.id_sede] = sede;
      }
      return acc;
    }, {});
  }, [sedes]);

  const filteredEspacios = useMemo(() => {
    return espacios.filter((espacio) => {
      if (statusFilter === "all") return true;
      const isActive = espacio.status !== false;
      return statusFilter === "active" ? isActive : !isActive;
    });
  }, [espacios, statusFilter]);

  const emptyMessage =
    espacios.length === 0
      ? "No hay espacios disponibles."
      : "No hay espacios para el filtro seleccionado.";

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [espaciosResponse, sedesResponse] = await Promise.all([
        obtenerEspacios(0, 100, null), // null para obtener todos (activos e inactivos)
        obtenerSedes(0, 100, true),
      ]);

      const normalizedEspacios = Array.isArray(espaciosResponse)
        ? espaciosResponse
        : Array.isArray(espaciosResponse?.espacios)
        ? espaciosResponse.espacios
        : [];

      const normalizedSedes = Array.isArray(sedesResponse)
        ? sedesResponse
        : Array.isArray(sedesResponse?.sedes)
        ? sedesResponse.sedes
        : [];

      setEspacios(normalizedEspacios);
      setSedes(normalizedSedes);
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        "Ocurrió un error al cargar los espacios.";
      console.error("Error al cargar espacios:", err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleAdd = () => {
    setEditingEspacio(null);
    setForm(initialFormState);
    setShowForm(true);
    setError(null);
  };

  const handleEdit = (espacio) => {
    setEditingEspacio(espacio);
    setForm({
      nombre: espacio.nombre ?? "",
      tipo: espacio.tipo ?? "",
      capacidad:
        espacio.capacidad !== null && espacio.capacidad !== undefined
          ? String(espacio.capacidad)
          : "",
      ubicacion: espacio.ubicacion ?? "",
      estado: espacio.estado ?? "DISPONIBLE",
      id_sede: espacio.id_sede ?? "",
    });
    setShowForm(true);
    setError(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEspacio(null);
    setForm(initialFormState);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.nombre.trim() ||
      !form.tipo ||
      !form.capacidad ||
      Number.isNaN(Number(form.capacidad)) ||
      Number(form.capacidad) <= 0 ||
      !form.ubicacion.trim()
    ) {
      setError("Completá todos los campos obligatorios con valores válidos.");
      return;
    }

    if (!editingEspacio && !form.id_sede) {
      setError("Seleccioná una sede.");
      return;
    }

    const payload = {
      nombre: form.nombre.trim(),
      tipo: form.tipo,
      capacidad: Number(form.capacidad),
      ubicacion: form.ubicacion.trim(),
      estado: form.estado,
    };

    if (!editingEspacio?.id_espacio) {
      payload.id_sede = form.id_sede;
    }

    const isEdit = Boolean(editingEspacio?.id_espacio);
    setConfirmDialog({
      title: isEdit ? "Confirmar actualización" : "Confirmar creación",
      message: `¿Confirmás ${
        isEdit ? "actualizar" : "crear"
      } el espacio "${form.nombre.trim()}"?`,
      confirmText: isEdit ? "Actualizar" : "Guardar",
      onConfirm: async () => {
        setIsSubmitting(true);
        setError(null);
        try {
          if (isEdit) {
            await actualizarEspacio(editingEspacio.id_espacio, payload);
          } else {
            await altaEspacio(payload);
          }
          await fetchInitialData();

          // Mostrar éxito en el mismo modal
          setConfirmDialog({
            title: "Operación exitosa",
            message: isEdit
              ? "Espacio actualizado correctamente."
              : "Espacio creado correctamente.",
            confirmText: "Aceptar",
            hideCancel: true,
            onConfirm: () => {
              setConfirmDialog(null);
            },
          });

          setShowForm(false);
          setEditingEspacio(null);
          setForm(initialFormState);

          // Cerrar el modal automáticamente después de 1.5 segundos
          setTimeout(() => {
            setConfirmDialog(null);
          }, 1500);
        } catch (err) {
          const message =
            err.response?.data?.detail ||
            err.message ||
            "Ocurrió un error al guardar el espacio.";
          console.error("Error al guardar el espacio:", err);
          setError(message);
          setConfirmDialog(null);
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };

  const handleDelete = (espacio) => {
    if (!espacio?.id_espacio) return;
    setConfirmDialog({
      title: "Confirmar desactivación",
      message: `¿Confirmás desactivar el espacio "${espacio.nombre}"?`,
      confirmText: "Desactivar",
      onConfirm: async () => {
        try {
          await actualizarEspacio(espacio.id_espacio, {
            ...espacio,
            status: false,
          });
          await fetchInitialData();

          // Cambiar el filtro a "all" para mostrar el espacio desactivado
          setStatusFilter("all");

          // Mostrar éxito en el mismo modal
          setConfirmDialog({
            title: "Operación exitosa",
            message: "Espacio desactivado correctamente.",
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
          const message =
            err.response?.data?.detail ||
            err.message ||
            "Ocurrió un error al desactivar el espacio.";
          console.error("Error al desactivar el espacio:", err);
          setError(message);
          setConfirmDialog(null);
        }
      },
    });
  };

  const handleActivate = (espacio) => {
    if (!espacio?.id_espacio) return;
    setConfirmDialog({
      title: "Confirmar activación",
      message: `¿Confirmás activar el espacio "${espacio.nombre}"?`,
      confirmText: "Activar",
      onConfirm: async () => {
        try {
          await actualizarEspacio(espacio.id_espacio, {
            ...espacio,
            status: true,
          });
          await fetchInitialData();

          // Mostrar éxito en el mismo modal
          setConfirmDialog({
            title: "Operación exitosa",
            message: "Espacio activado correctamente.",
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
          const message =
            err.response?.data?.detail ||
            err.message ||
            "Ocurrió un error al activar el espacio.";
          console.error("Error al activar el espacio:", err);
          setError(message);
          setConfirmDialog(null);
        }
      },
    });
  };

  return (
    <div className="min-h-screen w-full bg-white shadow-lg rounded-2xl flex flex-col items-center p-4 mt-4">
      <div className="w-full max-w-6xl">
        {/* Title centered at the top */}
        <div className="w-full text-center mb-6">
          <h1 className="font-bold text-2xl mb-2">Gestión de Espacios</h1>
          <span className="block w-full h-[3px] bg-sky-950"></span>
        </div>

        <div className="relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
              <Spinner />
            </div>
          )}

          {/* Status Filter Dropdown aligned to the right */}
          <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="statusFilter" className="text-sm font-semibold">
                Estado
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="statusFilter" className="min-w-[150px]">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                  <SelectItem value="all">Todos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <Table className="min-w-full border rounded-lg shadow-sm">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Capacidad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Sede</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!loading && filteredEspacios.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-gray-500"
                    >
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                )}

                {!loading &&
                  filteredEspacios.map((espacio) => {
                    const sedeInfo = sedesMap[espacio.id_sede];
                    return (
                      <TableRow
                        key={espacio.id_espacio}
                        className="hover:bg-gray-50"
                      >
                        <TableCell>{espacio.nombre}</TableCell>
                        <TableCell>
                          {espacio.tipo
                            ? espacio.tipo.charAt(0).toUpperCase() +
                              espacio.tipo.slice(1).replace("_", " ")
                            : "-"}
                        </TableCell>
                        <TableCell>{espacio.capacidad ?? "-"}</TableCell>
                        <TableCell>
                          {espacio.estado
                            ? espacio.estado.charAt(0).toUpperCase() +
                              espacio.estado.slice(1).replace("_", " ")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {sedeInfo
                            ? `${sedeInfo.nombre} (${sedeInfo.ubicacion})`
                            : espacio.id_sede || "-"}
                        </TableCell>
                        <TableCell>
                          {espacio.status !== false ? (
                            <span className="text-green-600">Activo</span>
                          ) : (
                            <span className="text-red-600">Inactivo</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex gap-2 justify-center">
                            {espacio.status === false ? (
                              <div className="w-44">
                                <Button
                                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded w-full"
                                  onClick={() => handleActivate(espacio)}
                                >
                                  Activar
                                </Button>
                              </div>
                            ) : (
                              <div className="w-44 flex gap-2">
                                <Button
                                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded w-1/2"
                                  onClick={() => handleEdit(espacio)}
                                >
                                  Editar
                                </Button>

                                <Button
                                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-1 px-3 rounded border border-gray-300 w-1/2"
                                  onClick={() => handleDelete(espacio)}
                                >
                                  Desactivar
                                </Button>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>

          {!showForm && (
            <Button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-6"
              onClick={handleAdd}
            >
              Agregar Espacio
            </Button>
          )}

          {showForm && (
            <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
              <h2 className="text-lg font-semibold mb-4">
                {editingEspacio ? "Editar Espacio" : "Agregar Espacio"}
              </h2>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Nombre"
                    value={form.nombre}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, nombre: value }))
                    }
                    required
                  />
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">
                      Tipo <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={form.tipo}
                      onValueChange={(value) =>
                        setForm((prev) => ({ ...prev, tipo: value }))
                      }
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccioná el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIPOS.map((tipo) => (
                          <SelectItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Capacidad"
                    type="number"
                    min="1"
                    value={form.capacidad}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, capacidad: value }))
                    }
                    required
                  />
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">
                      Estado <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={form.estado}
                      onValueChange={(value) =>
                        setForm((prev) => ({ ...prev, estado: value }))
                      }
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccioná el estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {ESTADOS.map((estado) => (
                          <SelectItem key={estado.value} value={estado.value}>
                            {estado.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <InputField
                  label="Ubicación"
                  value={form.ubicacion}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, ubicacion: value }))
                  }
                  required
                />

                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">
                    Sede
                    {!editingEspacio && <span className="text-red-500">*</span>}
                  </label>
                  <Select
                    value={form.id_sede}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, id_sede: value }))
                    }
                    required={!editingEspacio}
                    disabled={Boolean(editingEspacio)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccioná una sede" />
                    </SelectTrigger>
                    <SelectContent>
                      {sedes.map((sede) => (
                        <SelectItem key={sede.id_sede} value={sede.id_sede}>
                          {`${sede.nombre} (${sede.ubicacion})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
                  <Button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-70"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Guardando..."
                      : editingEspacio
                      ? "Actualizar"
                      : "Guardar"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {error && (
        <PopUp title="Error" message={error} onClose={() => setError(null)} />
      )}
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
            }
          }}
          onCancel={() => setConfirmDialog(null)}
          loading={Boolean(confirmDialog.loading)}
        />
      )}
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  min,
  step,
}) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        min={min}
        step={step}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  disabled = false,
}) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
