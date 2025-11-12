import { useState } from "react";
import SelectForm from "@/components/SelectForm";
import AltaUsuario from "@/components/AltaUsuario";
import ModifUsuario from "@/components/ModifUsuario";
import BajaUsuario from "@/components/BajaUsuario";
import BusquedaUsuario from "@/components/BusquedaUsuario";

export default function Usuarios() {
  const [value, setValue] = useState("");
  const opciones = [
    { value: "alta", label: "Alta de Usuario" },
    { value: "baja", label: "Baja de Usuario" },
    { value: "modif", label: "Modificación de Usuario" },
    { value: "busqueda", label: "Búsqueda de Usuario" },
  ];

  return (
    <div className="min-h-screen w-full bg-white shadow-lg rounded-2xl flex flex-col items-center p-4 mt-4">
      <div className="w-full max-w-2xl p-6">
        <h1 className="font-bold text-center text-2xl mb-4">
          Gestión de Usuarios
        </h1>
        <span className="block w-full h-[3px] bg-sky-950"></span>

        <div className="flex flex-col items-center lg:flex-row lg:items-center gap-4 mt-8">
          <h3 className="text-sm flex-shrink-0">
            Elija qué tipo de operación desea realizar
          </h3>

          <SelectForm
            title="Operaciones"
            options={opciones}
            value={value}
            onValueChange={setValue}
          />
        </div>
      </div>

      {value === "alta" && <AltaUsuario />}

      {value === "baja" && <BajaUsuario />}

      {value === "modif" && <ModifUsuario />}

      {value === "busqueda" && <BusquedaUsuario />}
    </div>
  );
}
