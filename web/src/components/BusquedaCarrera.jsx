import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
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
import { useState } from "react"
import CardCarrera from "./CardCarrera";
import PopUp from "./PopUp";
import { carreraPorId } from "@/api/carrerasApi";

export default function BusquedaCarrera(second) {

    const [name, setName] = useState("");
    const [found, setFound] = useState(false);
    const [value, setValue] = useState("");
    const [error, setError]=useState(null)
    const [carreraData, setCarreraData] = useState(null);

    const handleBaja=()=>{ 
        setFound(false);
        setName("");
        setValue("");
        setCarreraData(null);
    }
 
    const handleSearch= async()=>{
    if (!value.trim()) return;

    try {
        const response = await carreraPorId(value); 
        if (response) {
            setCarreraData(response); 
            setFound(true);           
        } else {
            setFound(false);          
            setCarreraData(null);
        }
    } catch (err) {
        setError(err.message || "Error al buscar la carrera");
        setFound(false);
        setCarreraData(null);
    }
    }

    return(

        <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-2xl p-6">
            <h1 className="font-bold text-center text-2xl mb-4">Buscar Carrera</h1>
            <span className="block w-full h-[3px] bg-sky-950"></span>

            <div className="flex flex-col items-center lg:flex-row lg:items-center justify-between my-4 gap-4">
                <h3 className="text-sm mb-2 shrink-0">
                    Indique nombre de la carrera
                </h3>
                <Input
                    className="mb-4 flex-1 w-full"
                    type="text"
                    placeholder="Ingrese nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
            </div>
            
                        
            <div className="flex flex-col items-center lg:flex-row lg:items-center justify-between my-4 gap-4">
                <h3 className="text-sm mb-2 shrink-0">
                    Buscar por identificador de carrera
                </h3>
                <Input
                    className="mb-4 flex-1 w-full"
                    type="text"
                    placeholder="Ingrese el identificador"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    />
            </div>
            
            <div className="flex justify-center">
            <Button
                disabled={!value.trim()}
                onClick={handleSearch}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Buscar
            </Button>
            </div>
            </div>
            {found && carreraData ? (
                <div className="w-full max-w-2xl p-6">
                <CardCarrera title={"Carrera encontrada"} carrera={carreraData} onClose={()=>{setFound(false); setName(""); setValue("")}}></CardCarrera>
                </div>
            ):
            (!found && value && (
                <div className="w-full max-w-2xl p-6">
                    <p className="text-sm text-gray-500 mt-4 text-center">No se han encontrado resultados</p>
                </div>
            ))}
            {error !== null && (
                <PopUp title={"Error"} message={error} onClose={()=>setError(null)}/>
            )}
            
        </div>
    )
}