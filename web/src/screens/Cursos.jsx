import AltaCurso from "@/components/AltaCurso";
import BusquedaCurso from "@/components/BusquedaCurso";
import GestionClases from "@/components/GestionClases";
import ModificarCurso from "@/components/ModificarCurso";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { useState, useEffect } from "react";
import { cursoPorIdConDocentes } from "@/api/cursosApi";

const Cursos = () => {
  const [operacion_seleccionada, setOperacionSeleccionada] = useState("");
  const [curso_seleccionado, setCursoSeleccionado] = useState(null);
  const [curso_enriquecido, setCursoEnriquecido] = useState(null);
  const [loading_docentes, setLoadingDocentes] = useState(false);

  const handleCursoSeleccionado = (curso, accion) => {
    setCursoSeleccionado(curso);
    if (accion === "gestionar") {
      setOperacionSeleccionada("gestionar");
    } else if (accion === "modificar") {
      setOperacionSeleccionada("modificar");
    }
  };

  const handleResetOperacion = () => {
    setCursoSeleccionado(null);
    setCursoEnriquecido(null);
  };

  // Cargar docentes cuando se selecciona gestionar clases
  useEffect(() => {
    const cargarDocentesDelCurso = async () => {
      if (operacion_seleccionada === "gestionar" && curso_seleccionado) {
        const uuid_curso =
          curso_seleccionado.uuid ||
          curso_seleccionado.id_curso ||
          curso_seleccionado.id;

        if (uuid_curso) {
          try {
            setLoadingDocentes(true);
            const curso_con_docentes = await cursoPorIdConDocentes(uuid_curso);
            setCursoEnriquecido(curso_con_docentes);
          } catch (error) {
            console.error("Error cargando docentes del curso:", error);
            // Si falla, usar el curso original sin docentes enriquecidos
            setCursoEnriquecido({
              ...curso_seleccionado,
              docentes_enriquecidos: { titular: null, auxiliar: null },
            });
          } finally {
            setLoadingDocentes(false);
          }
        }
      }
    };

    cargarDocentesDelCurso();
  }, [operacion_seleccionada, curso_seleccionado]);

  return (
    <div className="min-h-screen w-full bg-white shadow-lg rounded-2xl flex flex-col items-center p-4 mt-4">
      <div className="w-full max-w-6xl p-6">
        <h1 className="font-bold text-center text-2xl mb-4">
          Gestión de Cursos
        </h1>
        <span className="block w-full h-[3px] bg-sky-950"></span>

        <div className="flex flex-col items-center lg:flex-row lg:items-center gap-4 mt-8">
          <h3 className="text-sm flex-shrink-0">
            Elija qué tipo de operación desea realizar
          </h3>

          <Select
            onValueChange={(value) => {
              setOperacionSeleccionada(value);
              handleResetOperacion();
            }}
            value={operacion_seleccionada}
            className="flex-1 w-full"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione una opción" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Operaciones</SelectLabel>
                <SelectItem value="alta">Alta de Curso</SelectItem>
                <SelectItem value="busqueda">
                  Búsqueda, Baja y Modificación de Curso
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {operacion_seleccionada === "alta" && <AltaCurso />}

      {operacion_seleccionada === "busqueda" && (
        <BusquedaCurso onCursoSeleccionado={handleCursoSeleccionado} />
      )}

      {operacion_seleccionada === "gestionar" && curso_seleccionado && (
        <>
          {loading_docentes ? (
            <div className="w-full max-w-4xl mt-6 text-center">
              <p className="text-gray-500">Cargando información del curso...</p>
            </div>
          ) : curso_enriquecido ? (
            <GestionClases
              id_curso={
                curso_enriquecido.uuid ||
                curso_enriquecido.id_curso ||
                curso_enriquecido.id
              }
              fecha_inicio={
                curso_enriquecido.desde || curso_enriquecido.fecha_inicio
              }
              fecha_fin={
                curso_enriquecido.hasta || curso_enriquecido.fecha_fin
              }
              dia={curso_enriquecido.dia}
              turno={curso_enriquecido.turno}
              materia={
                curso_enriquecido.materia?.nombre ||
                curso_enriquecido.materia ||
                "N/A"
              }
              periodo={curso_enriquecido.periodo}
              modalidad={curso_enriquecido.modalidad}
              titular={
                curso_enriquecido.docentes_enriquecidos?.titular
                  ?.nombre_completo || null
              }
              titular_uuid={
                curso_enriquecido.docentes_enriquecidos?.titular?.user_uuid ||
                null
              }
              auxiliar={
                curso_enriquecido.docentes_enriquecidos?.auxiliar
                  ?.nombre_completo || null
              }
              auxiliar_uuid={
                curso_enriquecido.docentes_enriquecidos?.auxiliar?.user_uuid ||
                null
              }
            />
          ) : null}
        </>
      )}

      {operacion_seleccionada === "modificar" && curso_seleccionado && (
        <ModificarCurso
          curso={curso_seleccionado}
          onCancel={() => {
            setOperacionSeleccionada("busqueda");
            setCursoSeleccionado(null);
          }}
        />
      )}
    </div>
  );
};

export default Cursos;
