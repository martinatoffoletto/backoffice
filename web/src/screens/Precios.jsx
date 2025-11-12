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
import PopUp from "@/components/PopUp";
import {
  altaParametro,
  bajaParametro,
  actualizarParametro,
  obtenerParametros,
} from "@/api/preciosApi";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function Precios() {
  const [prices, setPrices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingParametro, setEditingParametro] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [form, setForm] = useState({
    nombre: "",
    tipo: "",
    valor_numerico: "",
    valor_texto: "",
    status: true,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const initialFormState = {
    nombre: "",
    tipo: "",
    valor_numerico: "",
    valor_texto: "",
    status: true,
  };

  const fetchPrecios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Convertir el filtro del frontend al formato que espera el backend
      let filter = null; // null muestra todos
      if (statusFilter === "active") {
        filter = true; // true muestra solo activos
      } else if (statusFilter === "inactive") {
        filter = false; // false muestra solo inactivos
      }

      const response = await obtenerParametros(0, 100, filter);
      const normalized = Array.isArray(response)
        ? response
        : Array.isArray(response?.parametros)
        ? response.parametros
        : [];
      setPrices(normalized);
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        "Error al obtener los precios.";
      console.error("Error al obtener precios:", err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchPrecios();
  }, [fetchPrecios]);

  // Ya no necesitamos filtrar en el frontend porque el backend lo hace
  const filteredPrices = prices;

  const emptyMessage =
    prices.length === 0
      ? "No hay precios disponibles."
      : "No hay precios para el filtro seleccionado.";

  const handleAdd = () => {
    setEditingParametro(null);
    setForm(initialFormState);
    setShowForm(true);
    setError(null);
  };

  const handleEdit = (parametro) => {
    setEditingParametro(parametro);
    setForm({
      nombre: parametro.nombre ?? "",
      tipo: parametro.tipo ?? "",
      valor_numerico:
        parametro.valor_numerico !== null &&
        parametro.valor_numerico !== undefined
          ? String(parametro.valor_numerico)
          : "",
      valor_texto: parametro.valor_texto ?? "",
      status: parametro.status !== undefined ? parametro.status : true,
    });
    setShowForm(true);
    setError(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingParametro(null);
    setForm(initialFormState);
    setError(null);
  };

  const savePrice = async () => {
    if (!form.nombre.trim() || !form.tipo.trim()) {
      setError("Por favor, completá los campos Nombre y Tipo.");
      return;
    }

    if (!form.valor_numerico || isNaN(Number(form.valor_numerico))) {
      setError("Ingresá un valor numérico válido.");
      return;
    }

    const payload = {
      nombre: form.nombre.trim(),
      tipo: form.tipo.trim(),
      valor_numerico: Number(form.valor_numerico),
      valor_texto: form.valor_texto?.trim() || null,
    };

    if (editingParametro?.id_parametro) {
      payload.status = form.status;
    }

    const isEdit = Boolean(editingParametro?.id_parametro);
    setConfirmDialog({
      title: isEdit ? "Confirmar actualización" : "Confirmar creación",
      message: `¿Confirmás ${
        isEdit ? "actualizar" : "crear"
      } el precio "${form.nombre.trim()}"?`,
      confirmText: isEdit ? "Actualizar" : "Guardar",
      onConfirm: async () => {
        setIsSubmitting(true);
        setError(null);
        try {
          if (isEdit) {
            await actualizarParametro(editingParametro.id_parametro, payload);
          } else {
            await altaParametro(payload);
          }
          await fetchPrecios();

          // Mostrar éxito en el mismo modal
          setConfirmDialog({
            title: "Operación exitosa",
            message: isEdit
              ? "Precio actualizado correctamente."
              : "Precio creado correctamente.",
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

          setShowForm(false);
          setEditingParametro(null);
          setForm(initialFormState);
        } catch (err) {
          const message =
            err.response?.data?.detail ||
            err.message ||
            "Ocurrió un error al guardar el precio.";
          console.error("Error al guardar el precio:", err);
          setError(message);
          setConfirmDialog(null);
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };

  const requestDeletePrice = (parametro) => {
    if (!parametro) return;
    const id = parametro.id_parametro || parametro.id;
    if (!id) return;
    setConfirmDialog({
      title: "Confirmar eliminación",
      message: `¿Confirmás eliminar el precio "${parametro.nombre}"?`,
      confirmText: "Eliminar",
      onConfirm: async () => {
        try {
          await bajaParametro(id);
          await fetchPrecios();

          // Mostrar éxito en el mismo modal
          setConfirmDialog({
            title: "Operación exitosa",
            message: "Precio eliminado correctamente.",
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
            "Ocurrió un error al eliminar el precio.";
          console.error("Error al eliminar el precio:", err);
          setError(message);
          setConfirmDialog(null);
        }
      },
    });
  };

  const handleActivate = (parametro) => {
    if (!parametro) return;
    const id = parametro.id_parametro || parametro.id;
    if (!id) return;
    setConfirmDialog({
      title: "Confirmar activación",
      message: `¿Confirmás activar el precio "${parametro.nombre}"?`,
      confirmText: "Activar",
      onConfirm: async () => {
        try {
          const payload = {
            nombre: parametro.nombre,
            tipo: parametro.tipo,
            valor_numerico: parametro.valor_numerico,
            valor_texto: parametro.valor_texto,
            status: true,
          };
          await actualizarParametro(id, payload);
          await fetchPrecios();

          // Mostrar éxito en el mismo modal
          setConfirmDialog({
            title: "Operación exitosa",
            message: "Precio activado correctamente.",
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
            "Ocurrió un error al activar el precio.";
          console.error("Error al activar el precio:", err);
          setError(message);
          setConfirmDialog(null);
        }
      },
    });
  };

  return (
    <div className="min-h-screen w-full bg-white shadow-lg rounded-2xl flex flex-col items-center p-4 mt-4">
      <div className="w-full max-w-3xl">
        <h1 className="font-bold text-center text-2xl mb-4">
          Listado de Precios
        </h1>
        <span className="block w-full h-[3px] bg-sky-950"></span>

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
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto mt-8">
          <Table className="min-w-full border border-gray-200 my-2">
            <TableCaption className="text-gray-500 text-sm mt-4">
              Valores actualizados al mes vigente
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead>Concepto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading && filteredPrices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}

              {loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Cargando precios...
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                filteredPrices.map((parametro) => (
                  <TableRow
                    key={parametro.id_parametro || parametro.id}
                    className="hover:bg-gray-50"
                  >
                    <TableCell>{parametro.nombre}</TableCell>
                    <TableCell>{parametro.tipo || "-"}</TableCell>
                    <TableCell>
                      ${String(parametro.valor_numerico ?? 0)}
                    </TableCell>
                    <TableCell>
                      {parametro.status !== false ? (
                        <span className="text-green-600">Activo</span>
                      ) : (
                        <span className="text-red-600">Inactivo</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2 justify-center">
                        {parametro.status === false ? (
                          <div className="w-44">
                            <Button
                              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded w-full"
                              onClick={() => handleActivate(parametro)}
                            >
                              Activar
                            </Button>
                          </div>
                        ) : (
                          <div className="w-44 flex gap-2">
                            <Button
                              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded w-1/2"
                              onClick={() => handleEdit(parametro)}
                            >
                              Editar
                            </Button>

                            <Button
                              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-1 px-3 rounded border border-gray-300 w-1/2"
                              onClick={() => requestDeletePrice(parametro)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {!showForm && (
          <Button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-6"
            onClick={handleAdd}
          >
            Agregar Nuevo Precio
          </Button>
        )}

        {showForm && (
          <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
            <h2 className="text-lg font-semibold mb-4">
              {editingParametro ? "Editar Precio" : "Agregar Nuevo Precio"}
            </h2>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <InputField
                label="Concepto"
                value={form.nombre}
                onChange={(v) => setForm({ ...form, nombre: v })}
                required
              />
              <div className="flex-1 flex flex-col">
                <label className="text-sm font-medium mb-1">
                  Tipo <span className="text-red-500">*</span>
                </label>
                <Select
                  value={form.tipo}
                  onValueChange={(val) => setForm({ ...form, tipo: val })}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multa">Multa</SelectItem>
                    <SelectItem value="sancion">Sanción</SelectItem>
                    <SelectItem value="reserva">Reserva</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <InputField
                label="Precio"
                type="number"
                value={form.valor_numerico}
                onChange={(v) => setForm({ ...form, valor_numerico: v })}
                required
                min="0"
                step="0.01"
              />
            </div>
            <InputField
              label="Descripción"
              value={form.valor_texto}
              onChange={(v) => setForm({ ...form, valor_texto: v })}
              placeholder="Descripción opcional"
            />

            {editingParametro && (
              <div className="flex flex-col md:flex-row gap-4 mt-4">
                <StatusToggle
                  value={form.status}
                  onChange={(status) => setForm({ ...form, status })}
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 justify-center mt-6">
              <Button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-70"
                onClick={savePrice}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Guardando..."
                  : editingParametro
                  ? "Actualizar"
                  : "Guardar"}
              </Button>
              <Button
                variant="outline"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
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
              // No cerrar aquí, el onConfirm interno lo maneja
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
  placeholder = "",
  min,
  step,
}) {
  return (
    <div className="flex-1 flex flex-col">
      <label className="text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        min={min}
        step={step}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function StatusToggle({ value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium">Estado:</span>
      <div className="flex gap-2">
        <Button
          type="button"
          variant={value ? "default" : "outline"}
          className={`px-4 py-1 ${
            value ? "bg-green-600 hover:bg-green-700" : ""
          }`}
          onClick={() => onChange(true)}
        >
          Activo
        </Button>
        <Button
          type="button"
          variant={!value ? "default" : "outline"}
          className={`px-4 py-1 ${!value ? "bg-red-600 hover:bg-red-700" : ""}`}
          onClick={() => onChange(false)}
        >
          Inactivo
        </Button>
      </div>
    </div>
  );
}
