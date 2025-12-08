import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { carreraPorNombre, verMateriasPorCarrera, obtenerCarreras } from "@/api/carrerasApi";

export default function MateriaCarrera() {
  const [nombreCarrera, setNombreCarrera] = useState("");
  const [materias, setMaterias] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allCarreras, setAllCarreras] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    const loadCarreras = async () => {
      try {
        const data = await obtenerCarreras();
        const limpias = data.filter(
          c => c && typeof c === "object" && c.name
        );
        setAllCarreras(limpias);
      } catch (err) {
        console.error("Error al cargar carreras", err);
      }
    };

    loadCarreras();
  }, []);

  const handleInputChange = (texto) => {
    setNombreCarrera(texto);

    if (texto.trim() === "") {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const sugerencias = allCarreras.filter(c =>
      c?.name?.toLowerCase().includes(texto.toLowerCase())
    );

    setSuggestions(sugerencias);
    setShowDropdown(true);
  };

  const handleBuscar = async (carreraSeleccionada) => {
    setLoadingState(true);
    setError(null);
    setShowTable(false);

    try {
      // Si viene de dropdown, usar carrera seleccionada; si no, buscar por nombre
      const carrera = carreraSeleccionada || await carreraPorNombre(nombreCarrera.trim());

      if (!carrera || !carrera.uuid) {
        setError("Carrera no encontrada");
        setMaterias([]);
        setLoadingState(false);
        return;
      }

      // Luego obtener las materias de esa carrera usando su UUID
      const materiasData = await verMateriasPorCarrera(carrera.uuid);
      setMaterias(materiasData);
      setShowTable(true);
    } catch (err) {
      setError(err.message || "Error al buscar materias");
      setMaterias([]);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-6xl p-6">
        <h1 className="font-bold text-center text-2xl mb-4">
          Materias de Carrera
        </h1>
        <span className="block w-full h-[3px] bg-sky-950"></span>

        <div className="relative w-full max-w-6xl mt-8">
          <div className="flex gap-2 items-center mb-4">
            <Input
              className="flex-1"
              type="text"
              placeholder="Ingrese nombre de carrera"
              value={nombreCarrera}
              onChange={(e) => handleInputChange(e.target.value)}
            />
            <Button
              onClick={() => handleBuscar()}
              disabled={!nombreCarrera.trim() || loadingState}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-6"
            >
              {loadingState ? "Buscando..." : "Buscar"}
            </Button>
          </div>

          {loadingState && <span>Cargando...</span>}

          {showDropdown && suggestions.length > 0 && (
            <Command className="absolute left-0 right-0 bg-white border rounded-md shadow-md mt-1 z-50 min-h-fit max-h-60 overflow-y-auto">
              <CommandGroup>
                <span className="px-2 py-1 text-xs text-gray-500">Coincidencias</span>
                {suggestions.map(carrera => (
                  <CommandItem key={carrera.uuid}
                    onSelect={() => {
                      setNombreCarrera(carrera.name);
                      setShowDropdown(false);
                      handleBuscar(carrera);
                    }}
                  >
                    <span>{carrera.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          )}

          {error && <div className="mt-4 text-center text-red-500">{error}</div>}
        </div>

        {showTable && (
          <div className="mt-8">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Electiva</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materias.length > 0 ? (
                  materias.map((materia) => (
                    <TableRow key={materia.uuid || materia.id}>
                      <TableCell>{materia.name || materia.nombre}</TableCell>
                      <TableCell>
                        {materia.description || materia.descripcion}
                      </TableCell>
                      <TableCell>
                        {materia.is_curricular ? "Sí" : "No"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No se encontraron materias para esta carrera
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
