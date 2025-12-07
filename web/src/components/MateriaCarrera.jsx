import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { carreraPorNombre, verMateriasPorCarrera } from "@/api/carrerasApi";

export default function MateriaCarrera() {
  const [nombreCarrera, setNombreCarrera] = useState("");
  const [materias, setMaterias] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBuscar = async () => {
    if (!nombreCarrera.trim()) return;

    setLoading(true);
    setError(null);
    setShowTable(false);

    try {
      // Primero buscar la carrera por nombre para obtener su UUID
      const carrera = await carreraPorNombre(nombreCarrera.trim());

      if (!carrera || !carrera.uuid) {
        setError("Carrera no encontrada");
        setMaterias([]);
        setLoading(false);
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
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-6xl p-6">
        <h1 className="font-bold text-center text-2xl mb-4">
          Materias de Carrera
        </h1>
        <span className="block w-full h-[3px] bg-sky-950"></span>

        <div className="flex gap-3 items-center w-full mt-8">
          <Input
            placeholder="Ingrese nombre de carrera"
            value={nombreCarrera}
            onChange={(e) => setNombreCarrera(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleBuscar}
            disabled={!nombreCarrera.trim() || loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-6"
          >
            {loading ? "Buscando..." : "Buscar"}
          </Button>
        </div>

        {error && <div className="mt-4 text-center text-red-500">{error}</div>}

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
