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

export default function BusquedaCarrera({ onCarreraSeleccionada }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState(null);
  const [showOpcionesCarrera, setShowOpcionesCarrera] = useState(false);
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

  const abrirOpcionesCarrera = (materia) => {
    setCarreraSeleccionada(materia);
    setShowOpcionesCarrera(true);
  };

  const cerrarOpcionesCarrera = () => {
    setCarreraSeleccionada(null);
    setShowOpcionesCarrera(false);
  };

  const handleEditarCarrera = () => {
    if (onCarreraSeleccionada) {
      onCarreraSeleccionada(carreraSeleccionada, "modif");
    }
    cerrarOpcionesCarrera();
  };

  const handleEliminarCarrera = () => {
    if (onCarreraSeleccionada) {
      onCarreraSeleccionada(carreraSeleccionada, "baja");
    }
    cerrarOpcionesCarrera();
  };

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
              <TableHeader className="bg-sky-950">
                <TableRow>
                  <TableHead className="text-white font-semibold px-4 py-3">
                    Carrera
                  </TableHead>
                  <TableHead className="text-white font-semibold px-4 py-3">
                    Facultad
                  </TableHead>
                  <TableHead className="text-white font-semibold px-4 py-3">
                    Modalidad
                  </TableHead>
                  <TableHead className="text-white font-semibold px-4 py-3">
                    Duración
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedCarreras.map((carrera, i) => (
                  <TableRow
                    key={carrera.uuid}
                    onClick={() => abrirOpcionesCarrera(carrera)}
                    className={`border-t cursor-pointer transition-colors hover:bg-blue-100 ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <TableCell className="px-4 py-3 text-sm">
                      {carrera.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm">
                      {carrera.faculty}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm">
                      {carrera.modality}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm">
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
      {showOpcionesCarrera && carreraSeleccionada && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl border border-sky-800/30 animate-fadeIn">
            <h2 className="text-2xl font-bold text-sky-900 mb-4 text-center">
              Opciones de Carrera
            </h2>

            <div className="rounded-xl border border-gray-200 p-4 mb-6 bg-gray-50">
              <div className="mb-3">
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="font-semibold text-gray-800">
                  {carreraSeleccionada.name}
                </p>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-500">Facultad</p>
                <p className="font-semibold text-gray-800">
                  {carreraSeleccionada.faculty || "Sin descripción"}
                </p>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-500">Modalidad</p>
                <p className="font-semibold text-gray-800 whitespace-pre-line">
                  {carreraSeleccionada.modality || "Sin descripción"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Duración</p>
                <p className="font-semibold text-gray-800 whitespace-pre-line">
                  {carreraSeleccionada.duration_hours || "Sin descripción"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleEditarCarrera}
              >
                Editar carrera
              </Button>

              <Button
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                onClick={handleEliminarCarrera}
              >
                Eliminar carrera
              </Button>

              <Button
                variant="secondary"
                className="w-full mt-1"
                onClick={cerrarOpcionesCarrera}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
