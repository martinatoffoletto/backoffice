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
import GestionCorrelativas from "@/components/GestionCorrelativas";


export default function Materias() {

  const navigate=useNavigate();

  const [value, setValue] = useState("");
  const opciones = [
    { value: "alta", label: "Alta de Materia" },
    { value: "baja", label: "Baja de Materia" },
    { value: "modif", label: "Modificación de Materia" },
    { value: "busqueda", label: "Búsqueda de Materia" },
    { value: "correlativas", label: "Gestión de Correlativas" }
  ];

  

  // const handleChoice=()=>{
  //   // if(!value) return;
  //   // console.log("Opción seleccionada:", value);
  //   // navigate("/" + value + "materia");
  // }

  return (
    <div className="min-h-screen w-full bg-white shadow-lg rounded-2xl flex flex-col items-center p-4 mt-4">
      <div className="w-full max-w-2xl p-6">
        <h1 className="font-bold text-center text-2xl mb-4">Gestión de Materias</h1>
        <span className="block w-full h-[3px] bg-sky-950"></span>
        <div className="flex flex-col items-center lg:flex-row lg:items-center gap-4 mt-8">
          <h3 className="text-sm flex-shrink-0">Elija qué tipo de operación desea realizar</h3>

          <SelectForm
            title="Operaciones"
            options={opciones}
            value={value}
            onValueChange={setValue}
          />
          {/* <Button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={handleChoice}
            disabled={!value}>
              Ir
          </Button> */}
        </div>
        
      </div>

      {/* <span className="block w-full h-[1px] bg-neutral-400"></span> */}


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

      {value==="correlativas" && (
        <GestionCorrelativas/>
      )}

    </div>
  );
}
