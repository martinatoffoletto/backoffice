import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { obtenerCarreras } from "@/api/carrerasApi";
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

export default function BusquedaCarrera() {
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading_state, setLoadingState] = useState(false);
  const [todasLasCarreras, setTodasLasCarreras] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrar carreras localmente
  const carrerasFiltradas = todasLasCarreras.filter((carrera) =>
    carrera.name?.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const paginatedCarreras = carrerasFiltradas.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(carrerasFiltradas.length / itemsPerPage);

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    setLoadingState(true);
    const allCarreras = async () => {
      try {
        const carreras = await obtenerCarreras();
        setLoadingState(false);
        setTodasLasCarreras(Array.isArray(carreras) ? carreras : []);
      } catch (err) {
        setError(err.message || "Error al obtener carreras");
        setLoadingState(false);
        setTodasLasCarreras([]);
      }
    };
    allCarreras();
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-6xl p-6">
        <h1 className="font-bold text-center text-2xl mb-4">Buscar Carrera</h1>
        <span className="block w-full h-[3px] bg-sky-950"></span>

        <div className="flex flex-col items-center gap-4 my-4">
          <div className="flex gap-2 w-full max-w-6xl">
            <Input
              className="flex-1"
              type="text"
              placeholder="Buscar carrera por nombre"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                onClick={() => setSearchTerm("")}
                variant="outline"
                className="px-6"
              >
                Limpiar
              </Button>
            )}
          </div>
        </div>

        {error !== null && (
          <p className="text-red-500 text-sm my-4 text-center">{error}</p>
        )}

        {!loading_state && carrerasFiltradas.length > 0 && (
          <div className="overflow-x-auto mt-8">
            <Table className="min-w-full border border-gray-200">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Carrera</TableHead>
                  <TableHead>Facultad</TableHead>
                  <TableHead>Modalidad</TableHead>
                  <TableHead>Duración</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCarreras.map((carrera) => (
                  <TableRow
                    key={carrera.uuid}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    <TableCell>{carrera.name}</TableCell>
                    <TableCell>{carrera.faculty}</TableCell>
                    <TableCell>{carrera.modality}</TableCell>
                    <TableCell>
                      {carrera.duration_years} años / {carrera.duration_hours}{" "}
                      hs
                    </TableCell>
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
              {carrerasFiltradas.length} carrera(s) encontrada(s)
            </p>
          </div>
        )}

        {!loading_state && searchTerm && carrerasFiltradas.length === 0 && (
          <p className="text-center text-gray-500 text-sm mt-8">
            No se encontraron carreras con ese nombre
          </p>
        )}
      </div>
    </div>
  );
}
