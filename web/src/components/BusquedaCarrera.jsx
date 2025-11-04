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

        <div className="flex min-h-screen flex-col items-center justify-start my-4">
            <div className="w-full max-w-md  p-6 r">
            <h1 className="font-bold text-xl mb-4">Buscar Carrera</h1>
            <span className="block w-full h-[3px] bg-sky-950"></span>

            <div className="flex flex-row items-center justify-between my-4 gap-2">
                <h3 className="text-sm mb-2 shrink-0">
                    Indique nombre de la carrera
                </h3>
                <Input
                    className="mb-4"
                    type="text"
                    placeholder="Ingrese nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
            </div>
            
                        
            <div className="flex flex-row items-center justify-between my-4 gap-2">
                <h3 className="text-sm mb-2 shrink-0">
                    Buscar por identificador de carrera
                </h3>
                <Input
                    className="mb-4"
                    type="text"
                    placeholder="Ingrese el identificador"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    />
            </div>
            
            <Button
                disabled={!value.trim()}
                onClick={handleSearch}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
>
                Buscar
            </Button>
            </div>
            {found && carreraData ? (
                <div className="w-full max-w-md  p-6 ml-6 my-4">
                <CardCarrera title={"Carrera encontrada"} carrera={carreraData} onClose={()=>{setFound(false); setName(""); setValue("")}}></CardCarrera>
                </div>
            ):
            (<div>
                <p className="text-sm text-gray-500 mt-4">No se han encontrado resultados</p>  {/* desp lo cprrijo*/ }
            </div>)}
            {error !== null && (
                <PopUp title={"Error"} message={error} onClose={()=>setError(null)}/>
            )}
            
        </div>
    )
}