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
import AltaEspacio from "@/components/AltaEspacio";
import ModifEspacio from "@/components/ModifEspacio";
import BajaEspacio from "@/components/BajaEspacio";
import BusquedaEspacio from "@/components/BusquedaEspacio";

export default function Espacios() {
  const [value, setValue] = useState("");
  const opciones = [
    { value: "alta", label: "Alta de Espacio" },
    { value: "baja", label: "Baja de Espacio" },
    { value: "modif", label: "Modificación de Espacio" },
    { value: "busqueda", label: "Búsqueda de Espacio" }
  ];

  return (
    <div className="flex flex-col min-h-screen max-w-2xl bg-white shadow-lg rounded-2xl items-start justify-start mt-4 space-y-6">
      <div className="w-full max-w-2xl p-6">
        <h1 className="font-bold text-xl mb-4">Gestión de Espacios</h1>
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

      {value === "alta" && <AltaEspacio />}
      {value === "baja" && <BajaEspacio />}
      {value === "modif" && <ModifEspacio />}
      {value === "busqueda" && <BusquedaEspacio />}
    </div>
  );
}

