import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { obtenerMaterias } from "@/api/materiasApi";
import { obtenerCarreras } from "@/api/carrerasApi";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select.jsx";

import {
  TableCell,
  TableHead,
  Table,
  TableBody,
  TableHeader,
  TableRow,
} from "./ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

export default function BusquedaMateria() {
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("nombre");

  const [error, setError] = useState(null);
  const [loading_state, setLoadingState] = useState(false);
  const [todasLasMaterias, setTodasLasMaterias] = useState([]);
  const [todasLasCarreras, setTodasLasCarreras] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const carreraDict = Object.fromEntries(
    todasLasCarreras.map((c) => [c.uuid, c.name])
  );

  let materiasFiltradas = todasLasMaterias;

  if (searchValue.trim() !== "") {
    if (searchType === "nombre") {
      materiasFiltradas = materiasFiltradas.filter((m) =>
        m.name?.toLowerCase().includes(searchValue.toLowerCase().trim())
      );
    } else if (searchType === "carrera") {
      const nombreLower = searchValue.toLowerCase().trim();

      const carrerasCoincidentes = todasLasCarreras.filter((c) =>
        c.name.toLowerCase().includes(nombreLower)
      );

      const uuidsCarrerasCoincidentes = carrerasCoincidentes.map((c) => c.uuid);

      materiasFiltradas = materiasFiltradas.filter((m) =>
        uuidsCarrerasCoincidentes.includes(m.uuid_carrera)
      );
    }
  }

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const paginatedMaterias = materiasFiltradas.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(materiasFiltradas.length / itemsPerPage);

  useEffect(() => setCurrentPage(1), [searchValue, searchType]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingState(true);

        const materiasApi = await obtenerMaterias();
        const carrerasApi = await obtenerCarreras();

        console.log("Materias obtenidas desde API:", materiasApi);

        const materiasNormalizadas = materiasApi.map((m) => ({
          uuid: m.uuid,
          name: m.nombre || "", 
          description: m.description || m.descripcion || "",
          uuid_carrera: m.uuid_carrera || "",
        }));

        const carrerasNormalizadas = carrerasApi.map((c) => ({
          uuid: c.uuid,
          name: c.name || c.nombre_carrera,
        }));

        setTodasLasMaterias(materiasNormalizadas);
        setTodasLasCarreras(carrerasNormalizadas);

        setLoadingState(false);
      } catch (err) {
        setError(err.message || "Error al cargar datos");
        setLoadingState(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-6xl p-6">
        <h1 className="font-bold text-center text-2xl mb-4">Buscar Materia</h1>
        <span className="block w-full h-[3px] bg-sky-950"></span>

        <div className="flex gap-2 items-center my-6">
          <Select value={searchType} onValueChange={setSearchType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nombre">Nombre</SelectItem>
              <SelectItem value="carrera">Carrera</SelectItem>
            </SelectContent>
          </Select>

          <Input
            className="flex-1"
            type="text"
            placeholder={
              searchType === "nombre"
                ? "Ingrese nombre de materia"
                : "Ingrese nombre de carrera"
            }
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />

          {searchValue && (
            <Button onClick={() => setSearchValue("")} variant="outline">
              Limpiar
            </Button>
          )}
        </div>

        {!loading_state && materiasFiltradas.length > 0 && (
          <div className="overflow-x-auto mt-8">
            <Table className="min-w-full border border-gray-200">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Materia</TableHead>
                  <TableHead>Carrera</TableHead>
                  <TableHead>Descripción</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedMaterias.map((materia) => (
                  <TableRow key={materia.uuid} className="hover:bg-gray-100">
                    <TableCell>{materia.name}</TableCell>

                    <TableCell>
                      {carreraDict[materia.uuid_carrera] || "Sin carrera"}
                    </TableCell>

                    <TableCell>{materia.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="mt-4 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          currentPage > 1 && setCurrentPage(currentPage - 1)
                        }
                      />
                    </PaginationItem>

                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={currentPage === i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          currentPage < totalPages &&
                          setCurrentPage(currentPage + 1)
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}

            <p className="text-center text-gray-500 text-sm mt-4">
              {materiasFiltradas.length} materia(s) encontrada(s)
            </p>
          </div>
        )}

        {!loading_state &&
          searchValue &&
          materiasFiltradas.length === 0 && (
            <p className="text-center text-gray-500 text-sm mt-8">
              No se encontraron materias con esos filtros
            </p>
          )}
      </div>
    </div>
  );
}