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
import AltaUsuario from "@/components/AltaUsuario";
import ModifUsuario from "@/components/ModifUsuario";
import BajaUsuario from "@/components/BajaUsuario";
import BusquedaUsuario from "@/components/BusquedaUsuario";

export default function Usuarios() {

  const navigate=useNavigate();

  const [value, setValue] = useState("");
  const opciones = [
    { value: "alta", label: "Alta de Usuario" },
    { value: "baja", label: "Baja de Usuario" },
    { value: "modif", label: "Modificación de Usuario" },
    { value: "busqueda", label: "Búsqueda de Usuario" }
  ];

  

  // const handleChoice=()=>{
  //   if(!value) return;
  //   console.log("Opción seleccionada:", value);
  //   // Aquí podrías agregar lógica para redirigir o mostrar formularios según la opción
  //   navigate("/" + value + "usuario");
  // }

  return (
    <div className="flex flex-col min-h-screen items-start justify-start mt-4 space-y-6">
      <div className="w-full max-w-2xl p-6 ">
        <h1 className="font-bold text-xl mb-4">Gestión de Usuarios</h1>
        <span className="block w-full h-[2px] bg-sky-950"></span>

        <div className="flex items-center gap-4 min-w-xl mt-8">
          <h3 className="text-sm flex-shrink-0">Elija qué tipo de operación desea realizar</h3>

          <SelectForm
            title="Operaciones"
            options={opciones}
            value={value}
            onValueChange={setValue}
          />
        </div> 
      </div>
          {/* <Button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={handleChoice}
            disabled={!value}>
              Ir
          </Button> */}
  


      {value==="alta" && (
        <AltaUsuario/>
      )}

      {value==="baja" && (
        <BajaUsuario/>
      )}

      {value==="modif" && (
        <ModifUsuario/>
      )}

      {value==="busqueda" && (
        <BusquedaUsuario/>
      )}

    </div>
  );
}
