import AltaCarrera from "@/components/AltaCarrera";
import BajaCarrera from "@/components/BajaCarrera";
import BusquedaCarrera from "@/components/BusquedaCarrera";
import ModifCarrera from "@/components/ModifCarrera";
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


export default function Carreras(second) {

    const [value, setValue] = useState("");

    return(
         <div className="flex flex-col min-h-screen max-w-2xl bg-white shadow-lg rounded-2xl  items-start justify-start mt-4 space-y-6">
            <div className="w-full max-w-2xl p-6 ">
                <h1 className="font-bold text-xl mb-4">Gestión de Carreras</h1>
                <span className="block w-full h-[2px] bg-sky-950"></span>

                <div className="flex flex-col items-start  lg:flex-row  gap-4 min-w-xl mt-8">
                    <h3 className="text-sm flex-shrink-0">
                        Elija qué tipo de operación desea realizar
                    </h3>

                    <Select onValueChange={setValue} value={value} className="flex-1">
                        <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione una opción" />
                        </SelectTrigger>

                        <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Operaciones</SelectLabel>
                            <SelectItem value="alta">Alta de Carrera</SelectItem>
                            <SelectItem value="baja">Baja de Carrera</SelectItem>
                            <SelectItem value="modificacion">Modificación de Carrera</SelectItem>
                            <SelectItem value="busqueda">Busqueda de Carrera</SelectItem>
                        </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        {value==="alta" && (<AltaCarrera/>)}
        {value==="baja" && (<BajaCarrera/>)}
        {value==="modificacion" && (<ModifCarrera/>)}
        {value==="busqueda" && (<BusquedaCarrera/>)}
        </div>
    )
}