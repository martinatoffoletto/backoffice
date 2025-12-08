import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import SelectForm from "@/components/SelectForm";
import AltaMateria from "@/components/AltaMateria";
import BusquedaMateria2 from "@/components/BusquedaMateria";
import BajaMateria from "@/components/BajaMateria";
import ModifMateria from "@/components/ModifMateria";
import GestionCorrelativas from "@/components/GestionCorrelativas";

export default function Materias() {
  const [value, setValue] = useState("");
  const opciones = [
    { value: "alta", label: "Alta de Materia" },
    { value: "baja", label: "Baja de Materia" },
    { value: "modif", label: "Modificación de Materia" },
    { value: "busqueda", label: "Búsqueda de Materia" },
    { value: "correlativas", label: "Gestión de Correlativas" },
  ];
  const [materia_seleccionada, setMateriaSeleccionada] = useState(null);

  const handleMateriaSelccionada = (materia, accion) => {
    setMateriaSeleccionada(materia);
    if (accion === "modif") {
      setValue("modif");
    } else if (accion === "gestionar") {
      setValue("gestionar");
    }
  };

  const handleResetOperacion = () => {
    setMateriaSeleccionada(null);
  };

  return (
    <div className="min-h-screen w-full bg-white shadow-lg rounded-2xl flex flex-col items-center p-4 mt-4">
      <div className="w-full max-w-6xl p-6">
        <h1 className="font-bold text-center text-2xl mb-4">
          Gestión de Materias
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
            onValueChange={(value) => {
              setValue(value);
              handleResetOperacion();
            }}
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

      {value === "alta" && <AltaMateria />}

      {value === "baja" && <BajaMateria />}

      {value === "modif" && (
        <ModifMateria materia_inicial={materia_seleccionada} />
      )}

      {value === "busqueda" && (
        <BusquedaMateria2 onMateriaSeleccionada={handleMateriaSelccionada} />
      )}

      {value === "correlativas" && <GestionCorrelativas />}
    </div>
  );
}
