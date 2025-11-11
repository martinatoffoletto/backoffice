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
import { useState, useEffect } from "react";
import { modifcarParametro, ParametroPorId, obtenerTiposParametros } from "@/api/preciosApi";

export default function ModifParametro() {
  const [form, setForm] = useState({
    nombre: "",
    tipo: "",
    valor_numerico: "",
    valor_texto: "",
    status: true,
  });
  const [tipos, setTipos] = useState([]);
  const [id_parametro, setIdParametro] = useState("");
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [parametroData, setParametroData] = useState(null);

  useEffect(() => {
    const cargarTipos = async () => {
      try {
        const tiposData = await obtenerTiposParametros();
        setTipos(tiposData);
      } catch (err) {
        console.error("Error al cargar tipos:", err);
      }
    };
    cargarTipos();
  }, []);

  const handleSearch = async () => {
    try {
      if (!id_parametro.trim()) return;
      const response = await ParametroPorId(id_parametro);
      setForm({
        nombre: response.nombre || "",
        tipo: response.tipo || "",
        valor_numerico: response.valor_numerico?.toString() || "",
        valor_texto: response.valor_texto || "",
        status: response.status !== undefined ? response.status : true,
      });
      setParametroData(response);
      setShowForm(true);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Error al buscar el parámetro");
      setShowForm(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const parametroDataToSend = {
        nombre: form.nombre.trim(),
        tipo: form.tipo,
        valor_numerico: form.valor_numerico ? parseFloat(form.valor_numerico) : null,
        valor_texto: form.valor_texto || null,
        status: form.status,
      };

      const response = await modifcarParametro(id_parametro, parametroDataToSend);
      setParametroData(response);
      setCompleted(true);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Error al modificar el parámetro");
    }
  };

  const cleanForm = () => {
    setForm({
      nombre: "",
      tipo: "",
      valor_numerico: "",
      valor_texto: "",
      status: true,
    });
    setIdParametro("");
    setError(null);
    setCompleted(false);
    setParametroData(null);
    setShowForm(false);
  };

  return (
    <div className="flex min-h-screen min-w-2xl flex-col items-start justify-start">
      <div className="w-full max-w-md p-6">
        <h1 className="font-bold text-xl mb-4">Modificación de Parámetro</h1>
        <span className="block w-full h-[2px] bg-sky-950"></span>

        <h3 className="text-sm mb-2 mt-8">
          Ingrese el ID del parámetro a modificar
        </h3>

        <div className="flex flex-col items-start lg:flex-row gap-4 min-w-xl">
          <Input
            className="lg:mb-4"
            placeholder="ID del parámetro"
            value={id_parametro}
            onChange={(e) => setIdParametro(e.target.value)}
          />

          <Button
            disabled={!id_parametro.trim()}
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Buscar
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="w-full max-w-md px-6 my-4">
          <h1 className="font-bold text-xl mb-4">Modificación de Parámetro</h1>
          <span className="block w-full h-[2px] bg-sky-950"></span>

          <FieldSet className="my-8">
            <FieldGroup className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field>
                  <FieldLabel>
                    Nombre <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="nombre"
                    placeholder="Nombre del parámetro"
                    value={form.nombre}
                    onChange={(e) =>
                      setForm({ ...form, nombre: e.target.value })
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel>
                    Tipo <span className="text-red-500">*</span>
                  </FieldLabel>
                  {tipos.length > 0 ? (
                    <Select
                      value={form.tipo}
                      onValueChange={(value) =>
                        setForm({ ...form, tipo: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccioná un tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tipos.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="tipo"
                      placeholder="Tipo del parámetro"
                      value={form.tipo}
                      onChange={(e) =>
                        setForm({ ...form, tipo: e.target.value })
                      }
                    />
                  )}
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field>
                  <FieldLabel>Valor Numérico</FieldLabel>
                  <Input
                    id="valor_numerico"
                    type="number"
                    step="0.01"
                    placeholder="Valor numérico"
                    value={form.valor_numerico}
                    onChange={(e) =>
                      setForm({ ...form, valor_numerico: e.target.value })
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel>Valor Texto</FieldLabel>
                  <Input
                    id="valor_texto"
                    placeholder="Valor texto"
                    value={form.valor_texto}
                    onChange={(e) =>
                      setForm({ ...form, valor_texto: e.target.value })
                    }
                  />
                </Field>
              </div>

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
            Parámetro modificado exitosamente
          </h2>
        </div>
      )}

      {error && (
        <PopUp
          title="Error al modificar el parámetro"
          message={error}
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
}

