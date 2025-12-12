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

export default function BusquedaMateria({ onMateriaSeleccionada }) {
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("nombre");
  const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
  const [showOpcionesMateria, setShowOpcionesMateria] = useState(false);
  const [error, setError] = useState(null);
  const [loading_state, setLoadingState] = useState(false);
  const [todasLasMaterias, setTodasLasMaterias] = useState([]);
  const [todasLasCarreras, setTodasLasCarreras] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const abrirOpcionesMateria = (materia) => {
    setMateriaSeleccionada(materia);
    setShowOpcionesMateria(true);
  };

  const cerrarOpcionesMateria = () => {
    setMateriaSeleccionada(null);
    setShowOpcionesMateria(false);
  };

  const handleEditarMateria = () => {
    if (onMateriaSeleccionada) {
      onMateriaSeleccionada(
        {
          uuid: materiaSeleccionada.uuid,
          nombre: materiaSeleccionada.name,
          description: materiaSeleccionada.description,
          uuid_carrera: materiaSeleccionada.uuid_carrera,
        },
        "modif"
      );
    }
    cerrarOpcionesMateria();
  };

  const handleEliminarMateria = () => {
    if (onMateriaSeleccionada) {
      onMateriaSeleccionada(
        {
          uuid: materiaSeleccionada.uuid,
          nombre: materiaSeleccionada.name,
          description: materiaSeleccionada.description,
          uuid_carrera: materiaSeleccionada.uuid_carrera,
        },
        "baja"
      );
    }
    cerrarOpcionesMateria();
  };

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
              <TableHeader className="bg-sky-950">
                <TableRow>
                  <TableHead className="text-white font-semibold px-4 py-3">
                    Materia
                  </TableHead>
                  <TableHead className="text-white font-semibold px-4 py-3">
                    Carrera
                  </TableHead>
                  <TableHead className="text-white font-semibold px-4 py-3">
                    Descripción
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedMaterias.map((materia, i) => (
                  <TableRow
                    key={materia.uuid}
                    onClick={() => abrirOpcionesMateria(materia)}
                    className={`border-t cursor-pointer transition-colors hover:bg-blue-100 ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <TableCell className="px-4 py-3 text-sm">
                      {materia.name}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-sm">
                      {carreraDict[materia.uuid_carrera] || "Sin carrera"}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-sm">
                      {materia.description}
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
              {materiasFiltradas.length} materia(s) encontrada(s)
            </p>
          </div>
        )}

        {!loading_state && searchValue && materiasFiltradas.length === 0 && (
          <p className="text-center text-gray-500 text-sm mt-8">
            No se encontraron materias con esos filtros
          </p>
        )}
      </div>
      {showOpcionesMateria && materiaSeleccionada && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl border border-sky-800/30 animate-fadeIn">
            <h2 className="text-2xl font-bold text-sky-900 mb-4 text-center">
              Opciones de Materia
            </h2>

            <div className="rounded-xl border border-gray-200 p-4 mb-6 bg-gray-50">
              <div className="mb-3">
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="font-semibold text-gray-800">
                  {materiaSeleccionada.name}
                </p>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-500">Carrera</p>
                <p className="font-semibold text-gray-800">
                  {carreraDict[materiaSeleccionada.uuid_carrera] ||
                    "Sin carrera"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Descripción</p>
                <p className="font-semibold text-gray-800 whitespace-pre-line">
                  {materiaSeleccionada.description || "Sin descripción"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleEditarMateria}
              >
                Editar materia
              </Button>

              <Button
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                onClick={handleEliminarMateria}
              >
                Eliminar materia
              </Button>

              <Button
                variant="secondary"
                className="w-full mt-1"
                onClick={cerrarOpcionesMateria}
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
