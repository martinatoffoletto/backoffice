import AltaCurso from "@/components/AltaCurso";
import BajaCurso from "@/components/BajaCurso";
import ModifCurso from "@/components/ModifCurso";
import { Button } from "@/components/ui/button";
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
import { useNavigate } from "react-router-dom";

export default function Cursos() {
  const [value, setValue] = useState("");
  const navigate = useNavigate(); 

  const handleChoice = () => {
    if (!value) return;
    console.log("Opción seleccionada:", value);

  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-50 mt-4">
      { value==="" && (<div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h1 className="font-bold text-center text-xl mb-4">Gestión de Cursos</h1>
        <h3 className="text-sm mb-2">Elija qué tipo de operación desea realizar</h3>

        <Select onValueChange={setValue} value={value}>
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

        <Button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={handleChoice}
          disabled={!value}
        >
          Ir
        </Button>
      </div>)}
      
      {value==="alta" && (
        <AltaCurso/>
      )}

      {value==="baja" && (
        <BajaCurso/>
      )}

      {value==="modif" && (
        <ModifCurso/>
      )}

    </div>
  );
}
