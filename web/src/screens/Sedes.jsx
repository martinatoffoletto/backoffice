import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import PopUp from "@/components/PopUp";
import { altaSede, obtenerSedes, actualizarSede } from "@/api/sedesApi";

export default function Sedes() {
  const [sedes, setSedes] = useState([]);
  const [editingSede, setEditingSede] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    ubicacion: "",
    status: true,
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const initialFormState = {
    nombre: "",
    ubicacion: "",
    status: true,
  };

  const handleAdd = () => {
    setEditingSede(null);
    setForm(initialFormState);
    setShowForm(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleEdit = (sede) => {
    setEditingSede(sede);
    setForm({
      nombre: sede.nombre ?? "",
      ubicacion: sede.ubicacion ?? "",
      status: sede.status !== undefined ? sede.status : true,
    });
    setShowForm(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSede(null);
    setForm(initialFormState);
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.ubicacion.trim()) {
      setError("Los campos Nombre y Ubicación son obligatorios.");
      return;
    }

    const payload = {
      nombre: form.nombre.trim(),
      ubicacion: form.ubicacion.trim(),
    };
    if (editingSede?.id_sede) {
      payload.status = form.status;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      if (editingSede?.id_sede) {
        await actualizarSede(editingSede.id_sede, payload);
        setSuccessMessage("Sede actualizada correctamente.");
      } else {
        await altaSede(payload);
        setSuccessMessage("Sede creada correctamente.");
      }
      await fetchSedes();
      setShowForm(false);
      setEditingSede(null);
      setForm(initialFormState);
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        "Ocurrió un error al guardar la sede.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchSedes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerSedes();
      const normalizedSedes = Array.isArray(data)
        ? data
        : Array.isArray(data?.sedes)
        ? data.sedes
        : [];
      setSedes(normalizedSedes);
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        "Ocurrió un error al cargar las sedes.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSedes();
  }, [fetchSedes]);

  return (
    <div className="min-h-screen w-full bg-white shadow-lg rounded-2xl flex flex-col items-center p-4 mt-4">
      <div className="w-full max-w-4xl">
        <h1 className="font-bold text-center text-2xl mb-4">Sedes</h1>
        <span className="block w-full h-[3px] bg-sky-950"></span>

        <div className="overflow-x-auto mt-8">
          <Table className="min-w-full border rounded-lg shadow-sm ">
            <TableHeader>
              <TableRow>
                <TableHead>Sede</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading && sedes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No hay sedes disponibles.
                  </TableCell>
                </TableRow>
              )}

              {loading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Cargando sedes...
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                sedes.map((sede) => (
                  <TableRow
                    key={sede.id_sede || sede.id}
                    className="hover:bg-gray-50"
                  >
                  <TableCell>{sede.nombre}</TableCell>
                  <TableCell>{sede.ubicacion}</TableCell>
                    <TableCell>
                      {sede.status !== false ? (
                        <span className="text-green-600">Activo</span>
                      ) : (
                        <span className="text-red-600">Inactivo</span>
                      )}
                    </TableCell>
                  <TableCell className="text-center">
                    <Button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                      onClick={() => handleEdit(sede)}
                    >
                      Ver / Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Botón Agregar Sede */}
        {!showForm && (
          <Button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-6"
            onClick={handleAdd}
          >
            Agregar Sede
          </Button>
        )}
        {showForm && (
          <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
            <h2 className="font-bold text-xl mb-4">
              {editingSede ? "Editar Sede" : "Agregar Sede"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <InputField
                  label="Nombre"
                  value={form.nombre}
                  onChange={(v) => setForm({ ...form, nombre: v })}
                  required
                />
                <InputField
                  label="Ubicación"
                  value={form.ubicacion}
                  onChange={(v) => setForm({ ...form, ubicacion: v })}
                  required
                />
              </div>

              {editingSede && (
                <div className="flex flex-col md:flex-row gap-4">
                  <RadioGroupField
                    label="Estado"
                    value={form.status}
                    options={[
                      { label: "Activo", value: true },
                      { label: "Inactivo", value: false },
                    ]}
                    onChange={(v) => setForm({ ...form, status: v })}
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-70"
                >
                  {isSubmitting
                    ? "Guardando..."
                    : editingSede
                    ? "Actualizar"
                    : "Agregar"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}
        {error !== null && (
          <PopUp
            title={"Error"}
            message={error.toString()}
            onClose={() => setError(null)}
          />
        )}
        {successMessage && (
          <PopUp
            title={"Operación exitosa"}
            message={successMessage}
            onClose={() => setSuccessMessage(null)}
          />
        )}
      </div>
    </div>
  );
}

// Componentes auxiliares
function InputField({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  required = false,
}) {
  return (
    <div className="flex-1 flex flex-col">
      <label className="text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 
          ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""}`}
      />
    </div>
  );
}

function RadioGroupField({ label, value, options, onChange }) {
  return (
    <div className="flex-1 flex flex-col">
      <label className="text-sm font-medium mb-1">{label}</label>
      <RadioGroup
        value={value?.toString()}
        onValueChange={(v) => onChange(v === "true")}
      >
        <div className="flex gap-4">
          {options.map((opt) => (
            <div
              key={opt.value.toString()}
              className="flex items-center space-x-2"
            >
              <RadioGroupItem
                value={opt.value.toString()}
                id={`${label}-${opt.value}`}
              />
              <Label htmlFor={`${label}-${opt.value}`}>{opt.label}</Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
