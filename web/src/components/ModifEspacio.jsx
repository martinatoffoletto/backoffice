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
import { modificarEspacio, espacioPorId, obtenerTiposEspacios } from "@/api/espaciosApi";
import { obtenerSedes } from "@/api/sedesApi";

const DEFAULT_TIPOS = ["aula", "laboratorio", "espacio_comun", "oficina"];

export default function ModifEspacio() {
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
  const [id_espacio, setIdEspacio] = useState("");
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [espacioData, setEspacioData] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [sedesResponse, tiposData] = await Promise.all([
          obtenerSedes(0, 100, true),
          obtenerTiposEspacios(),
        ]);
        const normalizedSedes = Array.isArray(sedesResponse)
          ? sedesResponse
          : Array.isArray(sedesResponse?.sedes)
          ? sedesResponse.sedes
          : [];
        setSedes(normalizedSedes);
        const normalizedTipos = Array.isArray(tiposData)
          ? tiposData.map((tipo) => (typeof tipo === "string" ? tipo.toLowerCase() : tipo))
          : [];
        setTipos(normalizedTipos.length ? normalizedTipos : DEFAULT_TIPOS);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setTipos(DEFAULT_TIPOS);
      }
    };
    cargarDatos();
  }, []);

  const handleSearch = async () => {
    try {
      if (!id_espacio.trim()) return;
      const response = await espacioPorId(id_espacio);
      setForm({
        nombre: response.nombre || "",
        tipo: response.tipo || "",
        capacidad: response.capacidad?.toString() || "",
        ubicacion: response.ubicacion || "",
        estado: response.estado || "disponible",
        id_sede: response.id_sede || "",
      });
      setEspacioData(response);
      setShowForm(true);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Error al buscar el espacio");
      setShowForm(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const espacioDataToSend = {
        nombre: form.nombre.trim(),
        tipo: form.tipo,
        capacidad: parseInt(form.capacidad),
        ubicacion: form.ubicacion.trim(),
        estado: form.estado,
      };

      const response = await modificarEspacio(id_espacio, espacioDataToSend);
      setEspacioData(response);
      setCompleted(true);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Error al modificar el espacio");
    }
  };

  const cleanForm = () => {
    setForm({
      nombre: "",
      tipo: "",
      capacidad: "",
      ubicacion: "",
      estado: "disponible",
      id_sede: "",
    });
    setIdEspacio("");
    setError(null);
    setCompleted(false);
    setEspacioData(null);
    setShowForm(false);
  };

  return (
    <div className="flex min-h-screen min-w-2xl flex-col items-start justify-start">
      <div className="w-full max-w-md p-6">
        <h1 className="font-bold text-xl mb-4">Modificación de Espacio</h1>
        <span className="block w-full h-[2px] bg-sky-950"></span>

        <h3 className="text-sm mb-2 mt-8">
          Ingrese el ID del espacio a modificar
        </h3>

        <div className="flex flex-col items-start lg:flex-row gap-4 min-w-xl">
          <Input
            className="lg:mb-4"
            placeholder="ID del espacio"
            value={id_espacio}
            onChange={(e) => setIdEspacio(e.target.value)}
          />

          <Button
            disabled={!id_espacio.trim()}
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Buscar
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="w-full max-w-md px-6 my-4">
          <h1 className="font-bold text-xl mb-4">Modificación de Espacio</h1>
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
            Espacio modificado exitosamente
          </h2>
        </div>
      )}

      {error && (
        <PopUp
          title="Error al modificar el espacio"
          message={error}
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
}

