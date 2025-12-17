import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import PopUp from "@/components/PopUp";
import {
  materiaPorNombre,
  modificarMateria,
  obtenerMaterias,
} from "@/api/materiasApi";
import FormMateria from "./FormMateria";
import CardMateria from "./CardMateria";

export default function ModifMateria({ materia_inicial = null }) {
  const [value, setValue] = useState("");
  const [found, setFound] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [allMaterias, setAllMaterias] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingState, setLoadingState] = useState(false);

  const [materiaData, setMateriaData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    uuid: "",
    nombre: "",
    description: "",
    approval_method: "",
    is_elective: false,
    uuid_carrera: "",
  });

  useEffect(() => {
    const loadMaterias = async () => {
      try {
        const data = await obtenerMaterias();
        const limpias = data.filter(
          (m) => m && typeof m === "object" && m.nombre
        );
        setAllMaterias(limpias);
      } catch (err) {
        console.error("Error al cargar materias", err);
      }
    };
    loadMaterias();
  }, []);

  useEffect(() => {
    if (materia_inicial) {
      setValue(materia_inicial.nombre);
      setMateriaData(materia_inicial);
      setForm({
        uuid: materia_inicial.uuid,
        nombre: materia_inicial.nombre,
        description: materia_inicial.description,
        approval_method: materia_inicial.approval_method,
        is_elective: materia_inicial.is_elective,
        uuid_carrera: materia_inicial.uuid_carrera,
      });
      setShowForm(true);
    }
  }, [materia_inicial]);

  const handleInputChange = (texto) => {
    setValue(texto);

    if (texto.trim() === "") {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const sugerencias = allMaterias.filter((m) =>
      m?.nombre?.toLowerCase().includes(texto.toLowerCase())
    );

    setSuggestions(sugerencias);
    setShowDropdown(true);
  };

  const handleSearch = async () => {
    setLoadingState(true);
    const nombre = value.trim();

    try {
      const response = await materiaPorNombre(nombre);

      if (response) {
        setMateriaData(response);
        setFound(true);
        setShowForm(true);

        setForm({
          uuid: response.uuid,
          nombre: response.nombre,
          description: response.description || "",
          approval_method: response.approval_method || "",
          is_elective: response.is_elective || false,
          uuid_carrera: response.uuid_carrera || "",
        });
      } else {
        setFound(false);
        setMateriaData(null);
      }
    } catch (err) {
      setError(err.message || "Error al buscar la materia");
    }

    setLoadingState(false);
  };

  const handleSubmit = async () => {
    if (!form.uuid) {
      setError("No hay materia seleccionada");
      return;
    }

    try {
      setIsSubmitting(true);
      await modificarMateria(form.uuid, form);
      setCompleted(true);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFound(false);
    setMateriaData(null);
    setValue("");
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-6xl p-6">
        <h1 className="font-bold text-center text-2xl mb-4">
          Modificación de Materia
        </h1>
        <span className="block w-full h-[3px] bg-sky-950"></span>

        <div className="relative w-full max-w-6xl mt-8">
          <div className="flex gap-2 items-center mb-4">
            <Input
              className="flex-1"
              type="text"
              placeholder="Ingrese nombre"
              value={value}
              onChange={(e) => handleInputChange(e.target.value)}
            />
            <Button
              disabled={!value.trim()}
              onClick={handleSearch}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Buscar
            </Button>
          </div>

          {loadingState && <span>Cargando...</span>}

          {showDropdown && suggestions.length > 0 && (
            <Command className="absolute left-0 right-0 bg-white border rounded-md shadow-md mt-1 z-50 min-h-fit max-h-60 overflow-y-auto">
              <CommandGroup>
                <span className="px-2 py-1 text-xs text-gray-500">
                  Coincidencias
                </span>
                {suggestions.map((materia) => (
                  <CommandItem
                    key={materia.uuid}
                    onSelect={() => {
                      setValue(materia.nombre);
                      setMateriaData(materia);
                      setFound(true);
                      setShowDropdown(false);
                      setShowForm(true);

                      setForm({
                        uuid: materia.uuid,
                        nombre: materia.nombre,
                        description: materia.description || "",
                        approval_method: materia.approval_method || "",
                        is_elective: materia.is_elective || false,
                        uuid_carrera: materia.uuid_carrera || "",
                      });
                    }}
                  >
                    <span>{materia.nombre}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          )}
        </div>

        {showForm && materiaData && (
          <div>
            <h1 className="font-bold text-center text-2xl mb-4">
              Modificar Materia - {materiaData.nombre}
            </h1>
            <span className="block w-full h-[3px] bg-sky-950 mb-6" />

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Materia actual:</span>{" "}
                {materiaData.nombre} (ID: {materiaData.uuid})
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Modificá los campos que desees actualizar y presioná "Guardar"
              </p>
            </div>

            <FormMateria
              form={form}
              setForm={setForm}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              submitButtonText="Guardar Cambios"
              isLoading={isSubmitting}
            />
          </div>
        )}

        {completed && (
          <div className="w-full bg-green-50 border-2 border-green-500 p-8 rounded-xl shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-3xl font-bold">OK</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-green-700 text-center mb-2">
              Materia Modificada Exitosamente
            </h2>
            <p className="text-center text-gray-600 text-sm mb-6">
              Los cambios se han guardado correctamente.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  setCompleted(false);
                  setMateriaData(null);
                  setValue("");
                  setForm({
                    uuid: "",
                    nombre: "",
                    description: "",
                    approval_method: "",
                    is_elective: false,
                    uuid_carrera: "",
                  });
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded"
              >
                Nueva Modificación
              </Button>
            </div>
          </div>
        )}

        {error && (
          <PopUp title="Error" message={error} onClose={() => setError(null)} />
        )}
      </div>
    </div>
  );
}
