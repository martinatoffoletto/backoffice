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
import { altaRol } from "@/api/rolesApi";

export default function AltaRol() {
  const [form, setForm] = useState({
    categoria: "",
    subcategoria: "",
    descripcion: "",
    sueldo_base: "",
  });
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [rolData, setRolData] = useState(null);

  const CATEGORIAS_DISPONIBLES = ["ADMINISTRADOR", "ALUMNO", "DOCENTE"];

  const cleanForm = () => {
    setForm({
      categoria: "",
      subcategoria: "",
      descripcion: "",
      sueldo_base: "",
    });
    setError(null);
    setCompleted(false);
    setRolData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.categoria) {
      setError("Por favor, seleccioná una categoría.");
      return;
    }

    if (form.categoria === "ADMINISTRADOR" && !form.subcategoria) {
      setError("Si seleccionaste ADMINISTRADOR, debes ingresar una subcategoría.");
      return;
    }

    if (form.sueldo_base && parseFloat(form.sueldo_base) < 0) {
      setError("El sueldo base no puede ser negativo.");
      return;
    }

    try {
      const rolDataToSend = {
        categoria: form.categoria,
        subcategoria: form.subcategoria || null,
        descripcion: form.descripcion || null,
        sueldo_base: form.sueldo_base ? parseFloat(form.sueldo_base) : 0,
      };

      const response = await altaRol(rolDataToSend);
      setRolData(response);
      setCompleted(true);
    } catch (err) {
      console.error("Error al dar de alta el rol:", err);
      const errorMessage = err.response?.data?.detail || err.message || "Error al crear el rol";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen items-start justify-start mt-6 py-4 sm:px-8">
      {!completed && (
        <div className="w-full max-w-3xl">
          <h1 className="font-bold text-start text-xl mb-4 text-black">
            Alta de Rol
          </h1>
          <span className="block w-full h-[2px] bg-sky-950 mb-6"></span>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FieldSet>
              <FieldGroup className="space-y-5">
                <Field>
                  <FieldLabel>
                    Categoría <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select
                    value={form.categoria}
                    onValueChange={(value) =>
                      setForm({ ...form, categoria: value, subcategoria: "" })
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[80%] md:w-[70%]">
                      <SelectValue placeholder="Seleccioná una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIAS_DISPONIBLES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                {form.categoria === "ADMINISTRADOR" && (
                  <Field>
                    <FieldLabel>
                      Subcategoría <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id="subcategoria"
                      placeholder="Subcategoría"
                      value={form.subcategoria}
                      onChange={(e) =>
                        setForm({ ...form, subcategoria: e.target.value })
                      }
                    />
                  </Field>
                )}

                <Field>
                  <FieldLabel>Descripción</FieldLabel>
                  <Input
                    id="descripcion"
                    placeholder="Descripción del rol (opcional)"
                    value={form.descripcion}
                    onChange={(e) =>
                      setForm({ ...form, descripcion: e.target.value })
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel>Sueldo Base</FieldLabel>
                  <Input
                    id="sueldo_base"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.sueldo_base}
                    onChange={(e) =>
                      setForm({ ...form, sueldo_base: e.target.value })
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

      {completed && rolData && (
        <div className="w-full max-w-3xl p-6 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="font-bold text-lg mb-2 text-green-800">
            Rol creado exitosamente
          </h2>
          <p className="text-sm text-green-700 mb-4">
            El rol "{rolData.categoria}" {rolData.subcategoria ? `- ${rolData.subcategoria}` : ""} ha sido creado correctamente.
          </p>
          <Button
            onClick={cleanForm}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-md"
          >
            Crear otro rol
          </Button>
        </div>
      )}

      {error && (
        <PopUp
          title="Error al crear el rol"
          message={error}
          onClose={cleanForm}
        />
      )}
    </div>
  );
}

