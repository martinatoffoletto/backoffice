import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PopUp from "./PopUp";
import {
  materiaPorNombre,
  obtenerMaterias,
  obtenerCorrelativas,
  agregarCorrelativa,
  eliminarCorrelativa,
} from "@/api/materiasApi";

export default function GestionCorrelativas() {
  const [value, setValue] = useState("");
  const [found, setFound] = useState(false);
  const [materiaOrigen, setMateriaOrigen] = useState(null);
  const [allMaterias, setAllMaterias] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [correlativas, setCorrelativas] = useState([]);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [selectedCorrelativa, setSelectedCorrelativa] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

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
        setMateriaOrigen(response);
        setFound(true);
        setShowDropdown(false);
        setSelectedCorrelativa("");

        try {
          const correlatividasData = await obtenerCorrelativas(response.uuid);
          setCorrelativas(correlatividasData);
        } catch (err) {
          console.error("Error al obtener correlativas:", err);
          setCorrelativas([]);
        }
      } else {
        setFound(false);
        setMateriaOrigen(null);
        setCorrelativas([]);
      }
    } catch (err) {
      setError(err.message || "Error al buscar la materia");
    }

    setLoadingState(false);
  };

  const handleAgregarCorrelativa = async () => {
    if (!selectedCorrelativa) {
      setError("Debes seleccionar una materia correlativa");
      return;
    }

    if (!materiaOrigen) {
      setError("No hay materia seleccionada");
      return;
    }

    setIsAdding(true);

    try {
      await agregarCorrelativa(materiaOrigen.uuid, {
        uuid_materia_correlativa: selectedCorrelativa,
      });

      const correlatividasData = await obtenerCorrelativas(materiaOrigen.uuid);
      setCorrelativas(correlatividasData);
      setSelectedCorrelativa("");
      setCompleted(true);
    } catch (err) {
      setError(err.message || "Error al agregar correlativa");
    } finally {
      setIsAdding(false);
    }
  };

  const handleEliminarCorrelativa = async (uuidCorrelativa) => {
    if (!materiaOrigen) {
      setError("No hay materia seleccionada");
      return;
    }

    setIsDeleting(uuidCorrelativa);

    try {
      await eliminarCorrelativa(materiaOrigen.uuid, uuidCorrelativa);

      const correlatividasData = await obtenerCorrelativas(materiaOrigen.uuid);
      setCorrelativas(correlatividasData);
    } catch (err) {
      setError(err.message || "Error al eliminar correlativa");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleReset = () => {
    setCompleted(false);
    setValue("");
    setFound(false);
    setMateriaOrigen(null);
    setCorrelativas([]);
    setSelectedCorrelativa("");
  };

  const materiaMap = Object.fromEntries(
    allMaterias.map((m) => [m.uuid, m.nombre])
  );

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-6xl p-6">
        <h1 className="font-bold text-center text-2xl mb-4">
          Gestión de Correlativas
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
                      setMateriaOrigen(materia);
                      setFound(true);
                      setShowDropdown(false);
                      setSelectedCorrelativa("");

                      obtenerCorrelativas(materia.uuid)
                        .then((data) => setCorrelativas(data))
                        .catch((err) => {
                          console.error("Error al obtener correlativas:", err);
                          setCorrelativas([]);
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

        {found && materiaOrigen && (
          <div className="w-full max-w-6xl p-6 mt-8">
            <div className="w-full bg-white border-2 border-blue-500 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-blue-600 mb-4">
                Correlativas de: {materiaOrigen.nombre}
              </h2>

              <span className="block w-full h-[2px] bg-blue-500 mb-6"></span>

              {correlativas.length > 0 ? (
                <div className="overflow-x-auto mb-6">
                  <Table className="min-w-full border border-gray-200">
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead>Materia Correlativa</TableHead>
                        <TableHead className="w-20 text-center">
                          Acción
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {correlativas.map((corr, idx) => (
                        <TableRow key={idx} className="hover:bg-gray-100">
                          <TableCell>
                            {materiaMap[corr.uuid_materia_correlativa] ||
                              corr.uuid_materia_correlativa}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              disabled={
                                isDeleting === corr.uuid_materia_correlativa
                              }
                              onClick={() =>
                                handleEliminarCorrelativa(
                                  corr.uuid_materia_correlativa
                                )
                              }
                              className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm"
                            >
                              {isDeleting === corr.uuid_materia_correlativa
                                ? "Eliminando..."
                                : "Eliminar"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-gray-500 mb-6">
                  No hay correlativas asignadas
                </p>
              )}

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4 text-gray-800">
                  Agregar Nueva Correlativa
                </h3>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Seleccionar Materia
                    </label>
                    <Select
                      value={selectedCorrelativa}
                      onValueChange={setSelectedCorrelativa}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una materia" />
                      </SelectTrigger>
                      <SelectContent>
                        {allMaterias
                          .filter((m) => m.uuid !== materiaOrigen.uuid)
                          .map((m) => (
                            <SelectItem key={m.uuid} value={m.uuid}>
                              {m.nombre}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    disabled={!selectedCorrelativa || isAdding}
                    onClick={handleAgregarCorrelativa}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded"
                  >
                    {isAdding ? "Agregando..." : "Agregar"}
                  </Button>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button
                  onClick={() => {
                    setFound(false);
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

        {completed && (
          <div className="w-full max-w-6xl p-6 mt-8">
            <div className="w-full bg-white border-2 border-green-500 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-green-600 mb-4">
                Correlativa Agregada Exitosamente
              </h2>
              <span className="block w-full h-[2px] bg-green-500 mb-4"></span>

              <p className="text-gray-700 mb-6">
                La correlativa ha sido asignada correctamente a{" "}
                <span className="font-semibold">{materiaOrigen?.nombre}</span>.
              </p>

              <Button
                onClick={handleReset}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded"
              >
                OK
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
