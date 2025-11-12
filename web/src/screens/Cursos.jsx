import AltaCurso from "@/components/AltaCurso";
import BajaCurso from "@/components/BajaCurso";
import ModifCurso from "@/components/ModifCurso";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select.jsx";
import { useState } from "react";

export default function Cursos() {
  const [value, setValue] = useState("");

  return (
    <div className="min-h-screen w-full bg-white shadow-lg rounded-2xl flex flex-col items-center p-4 mt-4">
      {/* Selector */}
      <div className="w-full max-w-2xl p-6">
        <h1 className="font-bold text-center text-2xl mb-4">Gestión de Cursos</h1>
        <span className="block w-full h-[3px] bg-sky-950"></span>

        <div className="flex flex-col items-center lg:flex-row lg:items-center gap-4 mt-8">
          <h3 className="text-sm flex-shrink-0">
            Elija qué tipo de operación desea realizar
          </h3>

          <Select onValueChange={setValue} value={value} className="flex-1 w-full">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione una opción" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Operaciones</SelectLabel>
                <SelectItem value="alta">Alta de Curso</SelectItem>
                <SelectItem value="baja">Baja de Curso</SelectItem>
                <SelectItem value="modificacion">Modificación de Curso</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        
      </div>


      {/* Formularios debajo */}
      {value === "alta" && <AltaCurso />}
      {value === "baja" && <BajaCurso />}
      {value === "modificacion" && <ModifCurso />}
    </div>
  );
}
