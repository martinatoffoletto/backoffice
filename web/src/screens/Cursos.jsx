import AltaCurso from "@/components/AltaCurso";
import BajaCurso from "@/components/BajaCurso";
import BusquedaCurso from "@/components/BusquedaCurso";
import ModifCurso from "@/components/ModifCurso";
import GestionClases from "@/components/GestionClases";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { useState } from "react";

const Cursos = () => {
  const [operacion_seleccionada, setOperacionSeleccionada] = useState("");
  const [curso_seleccionado, setCursoSeleccionado] = useState(null);

  const handleCursoSeleccionado = (curso, accion) => {
    setCursoSeleccionado(curso);
    if (accion === "modificar") {
      setOperacionSeleccionada("modificacion");
    } else if (accion === "gestionar") {
      setOperacionSeleccionada("gestionar");
    }
  };

  const handleResetOperacion = () => {
    setCursoSeleccionado(null);
  };

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
                <SelectItem value="baja">Baja de Curso</SelectItem>
                <SelectItem value="modificacion">
                  Modificación de Curso
                </SelectItem>
                <SelectItem value="busqueda">Búsqueda de Curso</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {operacion_seleccionada === "alta" && <AltaCurso />}
      {operacion_seleccionada === "baja" && <BajaCurso />}
      {operacion_seleccionada === "modificacion" && (
        <ModifCurso cursoInicial={curso_seleccionado} />
      )}
      {operacion_seleccionada === "busqueda" && (
        <BusquedaCurso onCursoSeleccionado={handleCursoSeleccionado} />
      )}
      {operacion_seleccionada === "gestionar" && curso_seleccionado && (
        <GestionClases
          id_curso={curso_seleccionado.id_curso || curso_seleccionado.id}
          fecha_inicio={curso_seleccionado.fecha_inicio}
          fecha_fin={curso_seleccionado.fecha_fin}
          dia={curso_seleccionado.dia}
          turno={curso_seleccionado.turno}
        />
      )}
    </div>
  );
};

export default Cursos;
