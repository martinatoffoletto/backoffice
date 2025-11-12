import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select.jsx";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import SelectForm from "@/components/SelectForm";
import AltaParametro from "@/components/AltaParametro";
import ModifParametro from "@/components/ModifParametro";
import BajaParametro from "@/components/BajaParametro";
import BusquedaParametro from "@/components/BusquedaParametro";

export default function Parametros() {
  const [value, setValue] = useState("");
  const opciones = [
    { value: "alta", label: "Alta de Parámetro" },
    { value: "baja", label: "Baja de Parámetro" },
    { value: "modif", label: "Modificación de Parámetro" },
    { value: "busqueda", label: "Búsqueda de Parámetro" }
  ];

  return (
    <div className="flex flex-col min-h-screen max-w-2xl bg-white shadow-lg rounded-2xl items-start justify-start mt-4 space-y-6">
      <div className="w-full max-w-2xl p-6">
        <h1 className="font-bold text-xl mb-4">Gestión de Parámetros</h1>
        <span className="block w-full h-[2px] bg-sky-950"></span>

        <div className="flex flex-col items-start lg:flex-row gap-4 min-w-xl mt-8">
          <h3 className="text-sm flex-shrink-0">Elija qué tipo de operación desea realizar</h3>

          <SelectForm
            title="Operaciones"
            options={opciones}
            value={value}
            onValueChange={setValue}
          />
        </div>
      </div>

      {value === "alta" && <AltaParametro />}
      {value === "baja" && <BajaParametro />}
      {value === "modif" && <ModifParametro />}
      {value === "busqueda" && <BusquedaParametro />}
    </div>
  );
}

