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
import { altaEspacio, obtenerTiposEspacios } from "@/api/espaciosApi";
import { obtenerSedes } from "@/api/sedesApi";

export default function AltaEspacio() {
  const [form, setForm] = useState({
    nombre: "",
    tipo: "",
    capacidad: "",
    ubicacion: "",
    estado: "disponible",
    id_sede: "",
  });
  const [sedes, setSedes] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [espacioData, setEspacioData] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [sedesData, tiposData] = await Promise.all([
          obtenerSedes(true),
          obtenerTiposEspacios()
        ]);
        setSedes(sedesData);
        setTipos(tiposData);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar los datos. Por favor, recargá la página.");
      }
    };
    cargarDatos();
  }, []);

  const cleanForm = () => {
    setForm({
      nombre: "",
      tipo: "",
      capacidad: "",
      ubicacion: "",
      estado: "disponible",
      id_sede: "",
    });
    setError(null);
    setCompleted(false);
    setEspacioData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.nombre ||
      !form.tipo ||
      !form.capacidad ||
      !form.ubicacion ||
      !form.id_sede
    ) {
      setError("Por favor, completá todos los campos obligatorios.");
      return;
    }

    if (parseInt(form.capacidad) <= 0) {
      setError("La capacidad debe ser mayor a 0.");
      return;
    }

    try {
      const espacioDataToSend = {
        nombre: form.nombre.trim(),
        tipo: form.tipo,
        capacidad: parseInt(form.capacidad),
        ubicacion: form.ubicacion.trim(),
        estado: form.estado,
        id_sede: form.id_sede,
      };

      const response = await altaEspacio(espacioDataToSend);
      setEspacioData(response);
      setCompleted(true);
    } catch (err) {
      console.error("Error al dar de alta el espacio:", err);
      const errorMessage = err.response?.data?.detail || err.message || "Error al crear el espacio";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen items-start justify-start mt-6 py-4 sm:px-8">
      {!completed && (
        <div className="w-full max-w-3xl">
          <h1 className="font-bold text-start text-xl mb-4 text-black">
            Alta de Espacio
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
                      placeholder="Nombre del espacio"
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
                            {tipo.charAt(0).toUpperCase() + tipo.slice(1).replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field>
                    <FieldLabel>
                      Capacidad <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id="capacidad"
                      type="number"
                      placeholder="Capacidad máxima"
                      value={form.capacidad}
                      onChange={(e) =>
                        setForm({ ...form, capacidad: e.target.value })
                      }
                    />
                  </Field>

                  <Field>
                    <FieldLabel>
                      Estado <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select
                      value={form.estado}
                      onValueChange={(value) =>
                        setForm({ ...form, estado: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccioná un estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="disponible">Disponible</SelectItem>
                        <SelectItem value="ocupado">Ocupado</SelectItem>
                        <SelectItem value="en_mantenimiento">En Mantenimiento</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <Field>
                  <FieldLabel>
                    Ubicación <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="ubicacion"
                    placeholder="Ubicación específica"
                    value={form.ubicacion}
                    onChange={(e) =>
                      setForm({ ...form, ubicacion: e.target.value })
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel>
                    Sede <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select
                    value={form.id_sede}
                    onValueChange={(value) =>
                      setForm({ ...form, id_sede: value })
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[80%] md:w-[70%]">
                      <SelectValue placeholder="Seleccioná una sede" />
                    </SelectTrigger>
                    <SelectContent>
                      {sedes.map((sede) => (
                        <SelectItem key={sede.id_sede} value={sede.id_sede}>
                          {sede.nombre} - {sede.ubicacion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

      {completed && espacioData && (
        <div className="w-full max-w-3xl p-6 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="font-bold text-lg mb-2 text-green-800">
            Espacio creado exitosamente
          </h2>
          <p className="text-sm text-green-700 mb-4">
            El espacio "{espacioData.nombre}" ha sido creado correctamente.
          </p>
          <Button
            onClick={cleanForm}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-md"
          >
            Crear otro espacio
          </Button>
        </div>
      )}

      {error && (
        <PopUp
          title="Error al crear el espacio"
          message={error}
          onClose={cleanForm}
        />
      )}
    </div>
  );
}

