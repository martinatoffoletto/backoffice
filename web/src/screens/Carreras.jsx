import AltaCarrera from "@/components/AltaCarrera";
import BajaCarrera from "@/components/BajaCarrera";
import BusquedaCarrera from "@/components/BusquedaCarrera";
import ModifCarrera from "@/components/ModifCarrera";
import MateriaCarrera from "@/components/MateriaCarrera";
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

export default function Carreras() {
  const [value, setValue] = useState("");
  const [carrera_seleccionada, setCarreraSeleccionada] = useState(null);

  const handleCarreraSeleccionada = (carrera, accion) => {
    setCarreraSeleccionada(carrera);
    if (accion === "modif") {
      setValue("modificacion");
    } else if (accion === "baja") {
      setValue("baja");
    }
  };

  const handleResetOperacion = () => {
    setCarreraSeleccionada(null);
  };

  return (
    <div className="min-h-screen w-full bg-white shadow-lg rounded-2xl flex flex-col items-center p-4 mt-4">
      <div className="w-full max-w-6xl p-6">
        <h1 className="font-bold text-center text-2xl mb-4">
          Gestión de Carreras
        </h1>
        <span className="block w-full h-[3px] bg-sky-950"></span>

        <div className="flex flex-col items-center lg:flex-row lg:items-center gap-4 mt-8">
          <h3 className="text-sm flex-shrink-0">
            Elija qué tipo de operación desea realizar
          </h3>

          <Select
            onValueChange={(val) => {
              setValue(val);
              handleResetOperacion();
            }}
            value={value}
            className="flex-1 w-full"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione una opción" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Operaciones</SelectLabel>
                <SelectItem value="alta">Alta de Carrera</SelectItem>
                <SelectItem value="baja">Baja de Carrera</SelectItem>
                <SelectItem value="modificacion">
                  Modificación de Carrera
                </SelectItem>
                <SelectItem value="busqueda">Busqueda de Carrera</SelectItem>
                <SelectItem value="materias">
                  Ver Materias de Carrera
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      {value === "alta" && <AltaCarrera />}
      {value === "baja" && (
        <BajaCarrera carrera_inicial={carrera_seleccionada} />
      )}
      {value === "modificacion" && (
        <ModifCarrera carrera_inicial={carrera_seleccionada} />
      )}
      {value === "busqueda" && (
        <BusquedaCarrera onCarreraSeleccionada={handleCarreraSeleccionada} />
      )}
      {value === "materias" && <MateriaCarrera />}
    </div>
  );
}
