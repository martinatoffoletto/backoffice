import PopUp from "../components/PopUp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useState, useEffect } from "react";
import { bajaMateria, materiaPorNombre, obtenerMaterias } from "@/api/materiasApi";

export default function BajaMateria() {
  const [value, setValue] = useState("");
  const [found, setFound] = useState(false);
  const [materiaData, setMateriaData] = useState(null);
  const [deleted, setDeleted] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allMaterias, setAllMaterias] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
  const [loadingState, setLoadingState] = useState(false);

  const [form, setForm] = useState({
    id: "",
    nombre: "",
    carrera: "",
    descripcion: "",
    metodo_aprobacion: "",
    curricular: "",
  });

  // ============================
  // 🔹 Cargar materias al inicio
  // ============================
  useEffect(() => {
    const loadMaterias = async () => {
      try {
        const data = await obtenerMaterias();

        // 🔥 Limpia materias inválidas proveniente de la API
        const limpias = data.filter(
          m => m && typeof m === "object" && m.nombre
        );

        setAllMaterias(limpias);
      } catch (err) {
        console.error("Error al cargar materias", err);
      }
    };

    loadMaterias();
  }, []);

  // =================================
  // 🔹 Buscar materia manualmente
  // =================================
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
          id: response.id_materia,
          nombre: response.nombre,
          carrera: response.carrera,
          descripcion: response.descripcion || "",
          metodo_aprobacion: response.metodo_aprobacion || "",
          curricular: response.curricular,
          status: response.status,
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

  // ==================================
  // 🔹 Dar de baja materia seleccionada
  // ==================================
  const handleBaja = async () => {
    if (!materiaData || !materiaData.uuid) {
      setError("No hay materia seleccionada para dar de baja");
      return;
    }

    setLoading(true);

    try {
      await bajaMateria(materiaData.uuid);
      setDeleted(true);
      setFound(false);
    } catch (err) {
      setError(err.message || "Error al eliminar materia");
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // 🔹 Autocomplete
  // ============================
  const handleInputChange = (texto) => {
    setValue(texto);

    if (texto.trim() === "") {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    // Filtrado seguro
    const sugerencias = allMaterias.filter(m =>
      m?.nombre?.toLowerCase().includes(texto.toLowerCase())
    );

    setSuggestions(sugerencias);
    setShowDropdown(true);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-6xl p-6">

        <h1 className="font-bold text-center text-2xl mb-4">Baja de Materia</h1>
        <span className="block w-full h-[3px] bg-sky-950"></span>

        <h3 className="text-sm mb-2 mt-8 text-center">
          Ingrese el nombre de la materia a dar de baja
        </h3>

        <div className="relative w-full max-w-6xl">

          {/* INPUT AUTOCOMPLETE */}
          <Input
            className="mb-4 flex-1 w-full"
            type="text"
            placeholder="Ingrese nombre"
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
          />

          {/* DROPDOWN */}
          {showDropdown && suggestions.length > 0 && (
            <Command className="absolute left-0 right-0 bg-white border rounded-md shadow-md mt-1 z-50 min-h-fit max-h-60 overflow-y-auto">
              
              <CommandGroup>
                <span className="px-2 py-1 text-xs text-gray-500">Coincidencias</span>

                {suggestions.map(materia => (
                  <CommandItem key={materia.id_materia}
                    onSelect={() => {
                      setValue(materia.nombre);
                      setMateriaSeleccionada(materia);
                      setMateriaData(materia);
                      setShowDropdown(false);
                      setShowForm(true);

                      setForm({
                        id: materia.id_materia,
                        nombre: materia.nombre,
                        carrera: materia.carrera.nombre,
                        descripcion: materia.descripcion || "",
                        metodo_aprobacion: materia.metodo_aprobacion || "",
                        curricular: materia.curricular,
                        status: materia.status
                      });
                    }}
                  >
                    <span>{materia.nombre}</span>
                  </CommandItem>
                ))}
              </CommandGroup>

            </Command>
          )}

          <Button
            disabled={!value.trim()}
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Buscar
          </Button>

          {searchError && <p className="text-red-500 mt-2 text-center">{searchError}</p>}
        </div>

        {/* =================================== */}
        {/* 🔹 Materia encontrada (confirmación) */}
        {/* =================================== */}
        {found && materiaData && (
          <div className="w-full max-w-6xl p-6">
            <div className="w-full bg-white border-2 border-red-500 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-red-600 mb-4">
                ⚠️ Confirmar Baja de Materia
              </h2>

              <span className="block w-full h-[2px] bg-red-500 mb-4"></span>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-3 text-gray-800">
                  Datos de la Materia:
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Nombre:</span>
                    <p className="text-gray-900">{materiaData.nombre}</p>
                  </div>

                  <div>
                    <span className="font-medium text-gray-700">Carrera:</span>
                    <p className="text-gray-900">{materiaData.carrera.nombre}</p>
                  </div>

                  <div>
                    <span className="font-medium text-gray-700">Descripción:</span>
                    <p className="text-gray-900">{materiaData.descripcion}</p>
                  </div>

                  <div>
                    <span className="font-medium text-gray-700">Tipo de Aprobación:</span>
                    <p className="text-gray-900">{materiaData.metodo_aprobacion}</p>
                  </div>

                  <div>
                    <span className="font-medium text-gray-700">¿Es curricular?:</span>
                    <p className="text-gray-900">{materiaData.curricular}</p>
                  </div>
                </div>
              </div>

              <p className="text-red-600 font-medium mb-6">
                ¿Estás seguro que deseas dar de baja esta materia? Esta acción
                no se puede deshacer.
              </p>

              <div className="flex gap-4">
                <Button
                  disabled={loading}
                  onClick={handleBaja}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded"
                >
                  {loading ? "Procesando..." : "Confirmar Baja"}
                </Button>

                <Button
                  onClick={() => {
                    setFound(false);
                    setMateriaData(null);  // 🔥 FIX: antes decía setCarreraData
                    setValue("");
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-2 rounded"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ============================= */}
        {/* 🔹 Materia dada de baja */}
        {/* ============================= */}
        {deleted && (
          <div className="w-full max-w-6xl p-6">
            <div className="w-full bg-white border-2 border-green-500 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-green-600 mb-4">
                ✓ Materia Dada de Baja Exitosamente
              </h2>
              <span className="block w-full h-[2px] bg-green-500 mb-4"></span>

              <p className="text-gray-700 mb-6">
                La materia{" "}
                <span className="font-semibold">{materiaData?.nombre}</span> ha
                sido dada de baja correctamente.
              </p>

              <Button
                onClick={() => {
                  setDeleted(false);
                  setMateriaData(null);
                  setValue("");
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded"
              >
                Nueva Baja
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}