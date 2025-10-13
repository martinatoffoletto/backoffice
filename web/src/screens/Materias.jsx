import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator
} from "@/components/ui/select.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import SelectForm from "@/components/SelectForm";
import AltaMateria from "@/components/AltaMateria";
import BusquedaMateria from "@/components/BusquedaMateria";
import BajaMateria from "@/components/BajaMateria";
import ModifMateria from "@/components/ModifMateria";
// import AltaUsuario from "@/components/AltaUsuario";
// import ModifUsuario from "@/components/ModifUsuario";
// import BajaUsuario from "@/components/BajaUsuario";

export default function Materias() {

  const navigate=useNavigate();

  const [value, setValue] = useState("");
  const opciones = [
    { value: "alta", label: "Alta de Materia" },
    { value: "baja", label: "Baja de Materia" },
    { value: "modif", label: "Modificación de Materia" },
    { value: "busqueda", label: "Búsqueda de Materia" }
  ];

  

  const handleChoice=()=>{
    // if(!value) return;
    // console.log("Opción seleccionada:", value);
    // navigate("/" + value + "materia");
  }

  return (
    <div className="flex min-h-screen min-w-2xl items-start justify-center bg-gray-50 mt-4">
      { value=== "" && (<div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h1 className="font-bold text-center text-xl mb-4">Gestión de Materias</h1>
    
        <h3 className="text-sm mb-2">Elija qué tipo de operación desea realizar</h3>

        <SelectForm
          title="Operaciones"
          options={opciones}
          value={value}
          onValueChange={setValue}
        />
        <Button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={handleChoice}
          disabled={!value}>
            Ir
        </Button>
      </div>)}

      {value==="alta" && (
        <AltaMateria/>
      )}

      {value==="baja" && (
        <BajaMateria/>
      )}

      {value==="modif" && (
        <ModifMateria/>
      )}

      {value==="busqueda" && (
        <BusquedaMateria/>
      )}

    </div>
  );
}
