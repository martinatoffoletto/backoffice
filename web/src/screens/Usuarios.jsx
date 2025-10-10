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
import { use } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Usuarios() {

  const [value, setValue] = useState("");
  const navigate=useNavigate();

  const handleChoice=()=>{
    if(!value) return;
    console.log("Opción seleccionada:", value);
    // Aquí podrías agregar lógica para redirigir o mostrar formularios según la opción
    navigate("/" + value + "usuario");
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-50 mt-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h1 className="font-bold text-center text-xl mb-4">Gestión de Usuarios</h1>
    
        <h3 className="text-sm mb-2">Elija qué tipo de operación desea realizar</h3>

        <Select onValueChange={setValue} value={value}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccione una opción" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>Operaciones</SelectLabel>
              <SelectItem value="alta">Alta de Usuario</SelectItem>
              <SelectItem value="baja">Baja de Usuario</SelectItem>
              <SelectItem value="modificacion">Modificación de Usuario</SelectItem>
              <SelectItem value="busqueda">Búsqueda de Usuario</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={handleChoice}
          disabled={!value}>
            Ir
        </Button>
      </div>
    </div>
  );
}
