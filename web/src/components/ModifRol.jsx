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
import { modificarRol, rolPorId } from "@/api/rolesApi";

export default function ModifRol() {
  const [form, setForm] = useState({
    categoria: "",
    subcategoria: "",
    descripcion: "",
    sueldo_base: "",
    status: true,
  });
  const [id_rol, setIdRol] = useState("");
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [rolData, setRolData] = useState(null);

  const CATEGORIAS_DISPONIBLES = ["ADMINISTRADOR", "ALUMNO", "DOCENTE"];

  const handleSearch = async () => {
    try {
      if (!id_rol.trim()) return;
      const response = await rolPorId(id_rol);
      setForm({
        categoria: response.categoria || "",
        subcategoria: response.subcategoria || "",
        descripcion: response.descripcion || "",
        sueldo_base: response.sueldo_base?.toString() || "",
        status: response.status !== undefined ? response.status : true,
      });
      setRolData(response);
      setShowForm(true);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Error al buscar el rol");
      setShowForm(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (form.categoria === "ADMINISTRADOR" && !form.subcategoria) {
        setError("Si la categoría es ADMINISTRADOR, debes ingresar una subcategoría.");
        return;
      }

      const rolDataToSend = {
        categoria: form.categoria,
        subcategoria: form.subcategoria || null,
        descripcion: form.descripcion || null,
        sueldo_base: form.sueldo_base ? parseFloat(form.sueldo_base) : null,
        status: form.status,
      };

      const response = await modificarRol(id_rol, rolDataToSend);
      setRolData(response);
      setCompleted(true);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Error al modificar el rol");
    }
  };

  const cleanForm = () => {
    setForm({
      categoria: "",
      subcategoria: "",
      descripcion: "",
      sueldo_base: "",
      status: true,
    });
    setIdRol("");
    setError(null);
    setCompleted(false);
    setRolData(null);
    setShowForm(false);
  };

  return (
    <div className="flex min-h-screen min-w-2xl flex-col items-start justify-start">
      <div className="w-full max-w-md p-6">
        <h1 className="font-bold text-xl mb-4">Modificación de Rol</h1>
        <span className="block w-full h-[2px] bg-sky-950"></span>

        <h3 className="text-sm mb-2 mt-8">
          Ingrese el ID del rol a modificar
        </h3>

        <div className="flex flex-col items-start lg:flex-row gap-4 min-w-xl">
          <Input
            className="lg:mb-4"
            placeholder="ID del rol"
            value={id_rol}
            onChange={(e) => setIdRol(e.target.value)}
          />

          <Button
            disabled={!id_rol.trim()}
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Buscar
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="w-full max-w-md px-6 my-4">
          <h1 className="font-bold text-xl mb-4">Modificación de Rol</h1>
          <span className="block w-full h-[2px] bg-sky-950"></span>

          <FieldSet className="my-8">
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
                  <SelectTrigger className="w-full">
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
            Rol modificado exitosamente
          </h2>
        </div>
      )}

      {error && (
        <PopUp
          title="Error al modificar el rol"
          message={error}
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
}

