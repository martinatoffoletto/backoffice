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
import { altaParametro, obtenerTiposParametros } from "@/api/preciosApi";

export default function AltaParametro() {
  const [form, setForm] = useState({
    nombre: "",
    tipo: "",
    valor_numerico: "",
    valor_texto: "",
  });
  const [tipos, setTipos] = useState([]);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
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

  const cleanForm = () => {
    setForm({
      nombre: "",
      tipo: "",
      valor_numerico: "",
      valor_texto: "",
    });
    setError(null);
    setCompleted(false);
    setParametroData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.tipo) {
      setError("Por favor, completá todos los campos obligatorios.");
      return;
    }

    if (!form.valor_numerico && !form.valor_texto) {
      setError("Debés ingresar al menos un valor (numérico o texto).");
      return;
    }

    try {
      const parametroDataToSend = {
        nombre: form.nombre.trim(),
        tipo: form.tipo,
        valor_numerico: form.valor_numerico ? parseFloat(form.valor_numerico) : null,
        valor_texto: form.valor_texto || null,
      };

      const response = await altaParametro(parametroDataToSend);
      setParametroData(response);
      setCompleted(true);
    } catch (err) {
      console.error("Error al dar de alta el parámetro:", err);
      const errorMessage = err.response?.data?.detail || err.message || "Error al crear el parámetro";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen items-start justify-start mt-6 py-4 sm:px-8">
      {!completed && (
        <div className="w-full max-w-3xl">
          <h1 className="font-bold text-start text-xl mb-4 text-black">
            Alta de Parámetro
          </h1>
          <span className="block w-full h-[2px] bg-sky-950 mb-6"></span>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FieldSet>
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
                      placeholder="Valor numérico (opcional)"
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
                      placeholder="Valor texto (opcional)"
                      value={form.valor_texto}
                      onChange={(e) =>
                        setForm({ ...form, valor_texto: e.target.value })
                      }
                    />
                  </Field>
                </div>

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

      {completed && parametroData && (
        <div className="w-full max-w-3xl p-6 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="font-bold text-lg mb-2 text-green-800">
            Parámetro creado exitosamente
          </h2>
          <p className="text-sm text-green-700 mb-4">
            El parámetro "{parametroData.nombre}" ha sido creado correctamente.
          </p>
          <Button
            onClick={cleanForm}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-md"
          >
            Crear otro parámetro
          </Button>
        </div>
      )}

      {error && (
        <PopUp
          title="Error al crear el parámetro"
          message={error}
          onClose={cleanForm}
        />
      )}
    </div>
  );
}
