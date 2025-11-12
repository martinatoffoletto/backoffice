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
import PopUp from "@/components/PopUp";
import { useState } from "react";
import { modifcarSede, sedePorId } from "@/api/sedesApi";

export default function ModifSede() {
  const [form, setForm] = useState({
    nombre: "",
    ubicacion: "",
    status: true,
  });
  const [id_sede, setIdSede] = useState("");
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [sedeData, setSedeData] = useState(null);

  const handleSearch = async () => {
    try {
      if (!id_sede.trim()) return;
      const response = await sedePorId(id_sede);
      setForm({
        nombre: response.nombre || "",
        ubicacion: response.ubicacion || "",
        status: response.status !== undefined ? response.status : true,
      });
      setSedeData(response);
      setShowForm(true);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Error al buscar la sede");
      setShowForm(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const sedeDataToSend = {
        nombre: form.nombre.trim(),
        ubicacion: form.ubicacion.trim(),
        status: form.status,
      };

      const response = await modifcarSede(id_sede, sedeDataToSend);
      setSedeData(response);
      setCompleted(true);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Error al modificar la sede");
    }
  };

  const cleanForm = () => {
    setForm({
      nombre: "",
      ubicacion: "",
      status: true,
    });
    setIdSede("");
    setError(null);
    setCompleted(false);
    setSedeData(null);
    setShowForm(false);
  };

  return (
    <div className="flex min-h-screen min-w-2xl flex-col items-start justify-start">
      <div className="w-full max-w-md p-6">
        <h1 className="font-bold text-xl mb-4">Modificación de Sede</h1>
        <span className="block w-full h-[2px] bg-sky-950"></span>

        <h3 className="text-sm mb-2 mt-8">
          Ingrese el ID de la sede a modificar
        </h3>

        <div className="flex flex-col items-start lg:flex-row gap-4 min-w-xl">
          <Input
            className="lg:mb-4"
            placeholder="ID de la sede"
            value={id_sede}
            onChange={(e) => setIdSede(e.target.value)}
          />

          <Button
            disabled={!id_sede.trim()}
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Buscar
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="w-full max-w-md px-6 my-4">
          <h1 className="font-bold text-xl mb-4">Modificación de Sede</h1>
          <span className="block w-full h-[2px] bg-sky-950"></span>

          <FieldSet className="my-8">
            <FieldGroup className="space-y-5">
              <Field>
                <FieldLabel>
                  Nombre <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="nombre"
                  placeholder="Nombre de la sede"
                  value={form.nombre}
                  onChange={(e) =>
                    setForm({ ...form, nombre: e.target.value })
                  }
                />
              </Field>

              <Field>
                <FieldLabel>
                  Ubicación <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="ubicacion"
                  placeholder="Dirección o ubicación"
                  value={form.ubicacion}
                  onChange={(e) =>
                    setForm({ ...form, ubicacion: e.target.value })
                  }
                />
              </Field>

              <Field>
                <FieldLabel>Estado</FieldLabel>
                <Select
                  value={form.status ? "activo" : "inactivo"}
                  onValueChange={(value) =>
                    setForm({ ...form, status: value === "activo" })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                <Button
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md w-full sm:w-auto"
                >
                  Guardar
                </Button>
                <Button
                  type="button"
                  onClick={cleanForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-2 rounded-md w-full sm:w-auto"
                >
                  Cancelar
                </Button>
              </div>
            </FieldGroup>
          </FieldSet>
        </div>
      )}

      {completed && (
        <div className="w-full max-w-md px-6 my-4 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="font-bold text-lg mb-2 text-green-800">
            Sede modificada exitosamente
          </h2>
        </div>
      )}

      {error && (
        <PopUp
          title="Error al modificar la sede"
          message={error}
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
}

