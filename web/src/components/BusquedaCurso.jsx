import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PopUp from "@/components/PopUp";
import { obtenerCursos } from "@/api/cursosApi";
import { obtenerMaterias } from "@/api/materiasApi";
import { obtenerSedes } from "@/api/sedesApi";
import { bajaCurso } from "@/api/cursosApi"
import { buscarCurso } from "@/api/cursosApi";


const estadoInicialFiltros = {
  uuid_materia: "",
  turno: "",
  sede: "",
};

const BusquedaCurso = ({ onCursoSeleccionado }) => {
  const [filtros_state, setFiltrosState] = useState(estadoInicialFiltros);
  const [cursos_state, setCursosState] = useState([]);
  const [materias_state, setMateriasState] = useState([]);
  const [sedes_state, setSedesState] = useState([]);
  const [resultados_state, setResultadosState] = useState([]);
  const [loading_state, setLoadingState] = useState(false);
  const [error_state, setErrorState] = useState(null);
  const [curso_seleccionado, setCursoSeleccionado] = useState(null);
  const [show_opciones, setShowOpciones] = useState(false);
  const [showPopUpConfirmacion,setShowPopUpConfirmacion]=useState(false);


  useEffect(() => {
    const cargarDatos = async () => {
      setLoadingState(true);
      try {
        const [cursos_respuesta, materias_respuesta, sedes_respuesta] =
          await Promise.all([
            obtenerCursos(),
            obtenerMaterias(),
            obtenerSedes(),
          ]);
        setCursosState(Array.isArray(cursos_respuesta) ? cursos_respuesta : []);
        setMateriasState(
          Array.isArray(materias_respuesta) ? materias_respuesta : []
        );
        setSedesState(Array.isArray(sedes_respuesta) ? sedes_respuesta : []);
        setResultadosState([]);
      } catch (error) {
        console.error("Error al cargar datos de cursos:", error);
        setErrorState(
          error.response?.data?.detail ||
            error.message ||
            "Error al cargar cursos"
        );
        // En caso de error, asegurar arrays vacíos
        setCursosState([]);
        setMateriasState([]);
        setSedesState([]);
        setResultadosState([]);
      } finally {
        setLoadingState(false);
      }
    };

    cargarDatos();
  }, []);

  const normalizarTexto = (texto) =>
    (texto ?? "").toString().toLowerCase().trim();

  const obtenerMateriaNombre = (uuid_materia) => {
    const materia_encontrada = materias_state.find(
      (materia) =>
        materia.id_materia === uuid_materia || materia.id === uuid_materia
    );
    return materia_encontrada?.nombre ?? uuid_materia ?? "";
  };

  const obtenerSedeNombre = (identificador) => {
    const sede_encontrada = sedes_state.find(
      (sede) =>
        sede.id_sede === identificador ||
        sede.id === identificador ||
        sede.nombre === identificador
    );
    return sede_encontrada?.nombre ?? identificador ?? "";
  };

  const aplicarFiltros = () => {
    if (!cursos_state.length) return [];

    return cursos_state.filter((curso) => {
      if (
        filtros_state.uuid_materia &&
        normalizarTexto(curso.uuid_materia) !==
          normalizarTexto(filtros_state.uuid_materia)
      ) {
        return false;
      }

      if (
        filtros_state.turno &&
        normalizarTexto(curso.turno) !== normalizarTexto(filtros_state.turno)
      ) {
        return false;
      }

      if (filtros_state.sede) {
        const curso_sede_normalizado = normalizarTexto(curso.sede);
        const curso_sede_nombre_normalizado = normalizarTexto(
          obtenerSedeNombre(curso.sede)
        );
        const filtro_sede_normalizado = normalizarTexto(filtros_state.sede);

        if (
          curso_sede_normalizado !== filtro_sede_normalizado &&
          curso_sede_nombre_normalizado !== filtro_sede_normalizado
        ) {
          return false;
        }
      }

      return true;
    });
  };

  const handleBuscarCursos = () => {
    const cursos_filtrados = aplicarFiltros();
    setResultadosState(cursos_filtrados);
  };

  const handleResetFiltros = () => {
    setFiltrosState(estadoInicialFiltros);
    setResultadosState(cursos_state);
  };

  const handleInputChange = (campo) => (evento) => {
    setFiltrosState((prev) => ({
      ...prev,
      [campo]: evento.target.value,
    }));
  };

  const handleSelectChange = (campo) => (valor) => {
    setFiltrosState((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const handleCursoClick = (curso) => {
    setCursoSeleccionado(curso);
    setShowOpciones(true);
  };

  const handleEditarCurso = () => {
    if (onCursoSeleccionado && curso_seleccionado) {
      onCursoSeleccionado(curso_seleccionado, "modificar");
    }
    setShowOpciones(false);
  };

  const handleGestionarClases = () => {
    if (onCursoSeleccionado && curso_seleccionado) {
      onCursoSeleccionado(curso_seleccionado, "gestionar");
    }
    setShowOpciones(false);
  };

  const handleEliminarCurso= async()=>{
    try{
      setShowOpciones(false);
      setShowPopUpConfirmacion(true);
    }catch(err){
      console.error("Error al eliminar curso: ", err);
      setErrorState(
        err.response?.data?.detail ||
          err.message ||
          "Error al eliminar curso"
      )
    }
  }

  const handleBaja= async () => {
      try {
        await bajaCurso(curso_seleccionado.uuid);
        console.log("Curso dado de baja exitosamente");
        setShowPopUpConfirmacion(false);
      } catch (err) {
        setShowPopUpConfirmacion(false);
        console.log("Error al dar de baja curso:", err.message);
        setErrorState(
          err.response?.data?.detail ||
            err.message ||
            "Error al dar de baja el curso"
        );
      }
    };

  const handleCerrarOpciones = () => {
    setShowOpciones(false);
    setCursoSeleccionado(null);
  };

  return (
    <div className="flex flex-col w-full min-h-screen items-start justify-start mt-6 py-4 sm:px-8">
      <div className="w-full max-w-5xl">
        <h1 className="font-bold text-start text-xl mb-4 text-black">
          Búsqueda de Cursos
        </h1>
        <span className="block w-full h-[2px] bg-sky-950 mb-6" />

        <FieldSet>
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5 items-end">
              <Field>
                <FieldLabel>Materia</FieldLabel>
                <Select
                  value={filtros_state.uuid_materia}
                  onValueChange={handleSelectChange("uuid_materia")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccioná una materia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Materias</SelectLabel>
                      {Array.isArray(materias_state) &&
                        materias_state.map((materia) => {
                          if (!materia || !materia.nombre) return null;
                          const materiaId =
                            materia.id_materia ||
                            materia.id ||
                            materia.uuid_materia;
                          if (!materiaId) return null;
                          return (
                            <SelectItem key={materiaId} value={materiaId}>
                              {materia.nombre}
                            </SelectItem>
                          );
                        })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Turno</FieldLabel>
                <Select
                  value={filtros_state.turno}
                  onValueChange={handleSelectChange("turno")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccioná un turno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Turnos</SelectLabel>
                      <SelectItem value="Mañana">Mañana</SelectItem>
                      <SelectItem value="Tarde">Tarde</SelectItem>
                      <SelectItem value="Noche">Noche</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Sede</FieldLabel>
                <Select
                  value={filtros_state.sede}
                  onValueChange={handleSelectChange("sede")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccioná una sede" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Sedes</SelectLabel>
                      {Array.isArray(sedes_state) &&
                        sedes_state.map((sede) => {
                          if (!sede || !sede.nombre) return null;
                          return (
                            <SelectItem
                              key={
                                sede.id_sede || sede.id || `sede-${sede.nombre}`
                              }
                              value={sede.nombre}
                            >
                              {sede.nombre}
                            </SelectItem>
                          );
                        })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md"
                onClick={handleBuscarCursos}
                disabled={loading_state}
              >
                {loading_state ? "Buscando..." : "Buscar"}
              </Button>

              {(filtros_state.uuid_materia ||
                filtros_state.turno ||
                filtros_state.sede) && (
                <Button
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-6 py-2 rounded-md"
                  variant="secondary"
                  onClick={handleResetFiltros}
                  disabled={loading_state}
                >
                  Limpiar
                </Button>
              )}
            </div>
          </FieldGroup>
        </FieldSet>

        <div className="mt-6">
          {loading_state && (
            <p className="text-gray-500">Cargando resultados...</p>
          )}

          {!loading_state && resultados_state.length === 0 && (
             <p className="text-gray-500">No se encontraron cursos con los filtros aplicados.</p>
          )}

          {!loading_state && resultados_state.length > 0 && (
            <div className="overflow-x-auto mt-8">
              <Table className="min-w-full border border-gray-200">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Materia</TableHead>
                    <TableHead>Comisión</TableHead>
                    <TableHead>Modalidad</TableHead>
                    <TableHead>Sede</TableHead>
                    <TableHead>Día</TableHead>
                    <TableHead>Turno</TableHead>
                    <TableHead>Período</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(resultados_state) &&
                    resultados_state.map((curso) => (
                      <TableRow
                        key={curso.uuid || Math.random()}
                        className="cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleCursoClick(curso)}
                      >
                        <TableCell>
                          {curso.uuid|| "-"}
                        </TableCell>
                        <TableCell>
                          {obtenerMateriaNombre(curso.uuid_materia)}
                        </TableCell>
                        <TableCell>{curso.comision || "-"}</TableCell>
                        <TableCell>{curso.modalidad || "-"}</TableCell>
                        <TableCell>{obtenerSedeNombre(curso.sede)}</TableCell>
                        <TableCell>{curso.dia || "-"}</TableCell>
                        <TableCell>{curso.turno || "-"}</TableCell>
                        <TableCell>{curso.periodo || "-"}</TableCell>
                        
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {error_state && (
        <PopUp
          title="Error"
          message={error_state}
          onClose={() => setErrorState(null)}
        />
      )}

      {/* Popup de opciones para curso seleccionado */}
      {show_opciones && curso_seleccionado && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl border-2 border-blue-500 w-96 max-w-md">
            <h2 className="text-xl font-bold mb-4 text-blue-600">
              Opciones para el curso
            </h2>
            <p className="mb-4 text-gray-700">
              <span className="font-semibold">Materia:</span>{" "}
              {obtenerMateriaNombre(curso_seleccionado.uuid_materia)}
            </p>
            <p className="mb-4 text-gray-700">
              <span className="font-semibold">ID:</span>{" "}
              {curso_seleccionado.id_curso || curso_seleccionado.id}
            </p>
            <div className="flex flex-col gap-3 mb-4">
              <Button
                onClick={handleEditarCurso}
                className="bg-gray-50 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-bold py-2 px-4 rounded"
              >
                Editar Curso
              </Button>
              <Button
                onClick={handleGestionarClases}
                className="bg-gray-50 border border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-bold py-2 px-4 rounded"
              >
                Gestionar Clases
              </Button>
              <Button
                onClick={handleEliminarCurso} 
                className="bg-gray-50 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold py-2 px-4 rounded">
                Eliminar curso
              </Button>
            </div>
            <Button
              onClick={handleCerrarOpciones}
              className="bg-gray-50 border border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white font-bold py-2 px-4 rounded w-full"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {
        showPopUpConfirmacion &&(
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-md border border-red-500 flex flex-col gap-3 ">
              <h2 className="font-bold text-lg ">Confirmar eliminación</h2>
              <p>¿Está seguro que desea eliminar el curso seleccionado?</p>
              <div className="flex gap-4 justify-end">
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4"
                  onClick={()=>handleBaja()}
                  >
                    Confirmar
                  </Button>
              </div>
            </div>
            </div>
        )
      }
    </div>
  );
};

export default BusquedaCurso;
