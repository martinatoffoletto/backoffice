import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import PopUp from "@/components/PopUp";
import { useState } from "react";
import { altaSede } from "@/api/sedesApi";

export default function AltaSede() {
  const [form, setForm] = useState({
    nombre: "",
    ubicacion: "",
  });
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [sedeData, setSedeData] = useState(null);

  const cleanForm = () => {
    setForm({
      nombre: "",
      ubicacion: "",
    });
    setError(null);
    setCompleted(false);
    setSedeData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.ubicacion) {
      setError("Por favor, completá todos los campos obligatorios.");
      return;
    }

    try {
      const sedeDataToSend = {
        nombre: form.nombre.trim(),
        ubicacion: form.ubicacion.trim(),
      };

      const response = await altaSede(sedeDataToSend);
      setSedeData(response);
      setCompleted(true);
    } catch (err) {
      console.error("Error al dar de alta la sede:", err);
      const errorMessage = err.response?.data?.detail || err.message || "Error al crear la sede";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen items-start justify-start mt-6 py-4 sm:px-8">
      {!completed && (
        <div className="w-full max-w-3xl">
          <h1 className="font-bold text-start text-xl mb-4 text-black">
            Alta de Sede
          </h1>
          <span className="block w-full h-[2px] bg-sky-950 mb-6"></span>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FieldSet>
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

                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                  <Button
                    type="submit"
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
          </form>
        </div>
      )}

      {completed && sedeData && (
        <div className="w-full max-w-3xl p-6 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="font-bold text-lg mb-2 text-green-800">
            Sede creada exitosamente
          </h2>
          <p className="text-sm text-green-700 mb-4">
            La sede "{sedeData.nombre}" ha sido creada correctamente.
          </p>
          <Button
            onClick={cleanForm}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-md"
          >
            Crear otra sede
          </Button>
        </div>
      )}

      {error && (
        <PopUp
          title="Error al crear la sede"
          message={error}
          onClose={cleanForm}
        />
      )}
    </div>
  );
}

