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
  altaEspacio,
  actualizarEspacio,
  bajaEspacio,
  obtenerEspacios,
  obtenerTiposEspacios,
} from "@/api/espaciosApi";
import { obtenerSedes } from "@/api/sedesApi";

const ESTADOS = [
  { label: "Disponible", value: "disponible" },
  { label: "Ocupado", value: "ocupado" },
  { label: "En mantenimiento", value: "en_mantenimiento" },
];

const DEFAULT_TIPOS = ["aula", "laboratorio", "espacio_comun", "oficina"];

export default function Espacios() {
  const [espacios, setEspacios] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEspacio, setEditingEspacio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    tipo: "",
    capacidad: "",
    ubicacion: "",
    estado: "disponible",
    id_sede: "",
    status: true,
  });

  const initialFormState = useMemo(
    () => ({
      nombre: "",
      tipo: "",
      capacidad: "",
      ubicacion: "",
      estado: "disponible",
      id_sede: "",
      status: true,
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

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [espaciosResponse, sedesResponse, tiposResponse] = await Promise.all([
        obtenerEspacios(),
        obtenerSedes(0, 100, true),
        obtenerTiposEspacios(),
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
      const normalizedTipos = Array.isArray(tiposResponse)
        ? tiposResponse.map((tipo) => (typeof tipo === "string" ? tipo.toLowerCase() : tipo))
        : [];
      setTipos(normalizedTipos.length ? normalizedTipos : DEFAULT_TIPOS);
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        "Ocurrió un error al cargar los espacios.";
      console.error("Error al cargar espacios:", err);
      setError(message);
      setTipos(DEFAULT_TIPOS);
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
    setSuccessMessage(null);
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
      estado: espacio.estado ?? "disponible",
      id_sede: espacio.id_sede ?? "",
      status: espacio.status !== undefined ? espacio.status : true,
    });
    setShowForm(true);
    setError(null);
    setSuccessMessage(null);
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

    if (editingEspacio?.id_espacio) {
      payload.status = form.status;
    } else {
      payload.id_sede = form.id_sede;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      if (editingEspacio?.id_espacio) {
        await actualizarEspacio(editingEspacio.id_espacio, payload);
        setSuccessMessage("Espacio actualizado correctamente.");
      } else {
        await altaEspacio(payload);
        setSuccessMessage("Espacio creado correctamente.");
      }
      await fetchInitialData();
      setShowForm(false);
      setEditingEspacio(null);
      setForm(initialFormState);
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        "Ocurrió un error al guardar el espacio.";
      console.error("Error al guardar el espacio:", err);
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (espacioId) => {
    if (!espacioId) return;
    try {
      await bajaEspacio(espacioId);
      setEspacios((prev) =>
        prev.filter((espacio) => espacio.id_espacio !== espacioId)
      );
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        "Ocurrió un error al eliminar el espacio.";
      console.error("Error al eliminar el espacio:", err);
      setError(message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white shadow-lg rounded-2xl flex flex-col items-center p-4 mt-4">
      <div className="w-full max-w-5xl">
        <h1 className="font-bold text-center text-2xl mb-4">Espacios</h1>
        <span className="block w-full h-[3px] bg-sky-950"></span>

        <div className="overflow-x-auto mt-8">
          <Table className="min-w-full border border-gray-200 my-2">
            <TableCaption className="text-gray-500 text-sm mt-4">
              Gestión de espacios institucionales
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Sede</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading && espacios.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    No hay espacios disponibles.
                  </TableCell>
                </TableRow>
              )}

              {loading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Cargando espacios...
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                espacios.map((espacio) => {
                  const sedeInfo = sedesMap[espacio.id_sede];
                  return (
                    <TableRow key={espacio.id_espacio} className="hover:bg-gray-50">
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
                      <TableCell className="text-center space-x-2">
                        <Button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded"
                          onClick={() => handleEdit(espacio)}
                        >
                          Ver / Editar
                        </Button>
                        <Button
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-1 px-3 rounded border border-gray-300"
                          onClick={() => handleDelete(espacio.id_espacio)}
                        >
                          Eliminar
                        </Button>
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
                  onChange={(value) => setForm((prev) => ({ ...prev, nombre: value }))}
                  required
                />
                <SelectField
                  label="Tipo"
                  value={form.tipo}
                  onChange={(value) => setForm((prev) => ({ ...prev, tipo: value }))}
                  options={tipos.map((tipo) => ({
                    label: tipo.charAt(0).toUpperCase() + tipo.slice(1).replace("_", " "),
                    value: tipo,
                  }))}
                  placeholder="Seleccioná el tipo"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Capacidad"
                  type="number"
                  min="1"
                  value={form.capacidad}
                  onChange={(value) => setForm((prev) => ({ ...prev, capacidad: value }))}
                  required
                />
                <SelectField
                  label="Estado"
                  value={form.estado}
                  onChange={(value) => setForm((prev) => ({ ...prev, estado: value }))}
                  options={ESTADOS}
                  placeholder="Seleccioná el estado"
                  required
                />
              </div>

              <InputField
                label="Ubicación"
                value={form.ubicacion}
                onChange={(value) => setForm((prev) => ({ ...prev, ubicacion: value }))}
                required
              />

              <SelectField
                label="Sede"
                value={form.id_sede}
                onChange={(value) => setForm((prev) => ({ ...prev, id_sede: value }))}
                options={sedes.map((sede) => ({
                  label: `${sede.nombre} (${sede.ubicacion})`,
                  value: sede.id_sede,
                }))}
                placeholder="Seleccioná una sede"
                required={!editingEspacio}
                disabled={Boolean(editingEspacio)}
              />

              {editingEspacio && (
                <StatusToggle
                  value={form.status}
                  onChange={(value) => setForm((prev) => ({ ...prev, status: value }))}
                />
              )}

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

      {error && (
        <PopUp title="Error" message={error} onClose={() => setError(null)} />
      )}
      {successMessage && (
        <PopUp
          title="Operación exitosa"
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
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

function StatusToggle({ value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium">Estado general:</span>
      <div className="flex gap-2">
        <Button
          type="button"
          variant={value ? "default" : "outline"}
          className={`px-4 py-1 ${value ? "bg-green-600 hover:bg-green-700" : ""}`}
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
