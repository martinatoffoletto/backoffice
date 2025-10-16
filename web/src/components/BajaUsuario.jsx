import CardUsuario from "@/components/CardUsuario";
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
import PopUp from "@/components/PopUp";
import { useState } from "react";
import { bajaUsuario, usuarioPorId } from "@/api/usuariosApi";

export default function BajaUsuario(second) {
    const [value, setValue] = useState("");
    const [found, setFound] = useState(false);
    const [error, setError] = useState(null);
    const [completed, setCompleted]=useState(false)
    const [user, setUser]= useState(null)

    const handleSearch = async() => {
        try{
            if (!value.trim()) return;
            const response = await usuarioPorId(value)
            console.log(`Usuario con id: ${value}  encontrado: ${response}`)
            setUser(response)
            setFound(true)
        }catch(error){
            console.log("Error al buscar usuario", error.message)
            setError(error.message)
        }
    };

    const handleBaja=async()=>{
        try{
           const response= await bajaUsuario(value)
           console.log("Usuario dado de baja exitosamente")
        }catch(err){
            console.log("Error al dar de baja usuario:", err.message)
            setError(err.message)
        }
        
    }
    return(
        <div className="flex min-h-screen flex-col items-start justify-start ">
            { !completed && (<div className="w-full max-w-md bg-white p-6 rounded-xl">
                <h1 className="font-bold  text-xl mb-4">Baja de Usuario</h1>
                <span className="block w-full h-[2px] bg-sky-950"></span>

                <h3 className="text-sm mb-2 mt-8">
                    Ingrese el legajo del usuario para proceder a la baja
                </h3>

                {/* Input controlado */}
                <Input
                className="mb-4"
                placeholder="Legajo"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                />

                {/* Botón de búsqueda */}
                <Button
                disabled={!value.trim()}
                onClick={handleSearch}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                Buscar
                </Button>
            </div>)}

            {completed && (
                <CardUsuario title={"Se ha dado de baja exitosamente"} user={user}/>
            
            )}

            {/* Resultado simulado */}
            {found && (
                <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md ml-6">
                <CardUsuario />
                <Button
                    variant="destructive"
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
                    onClick={handleBaja}
                >
                    Confirmar Baja
                </Button>
                </div>
            )}

            {/* Popup de confirmación */}
            {found && (
                <PopUp title={"Se ha dado de baja al usuario solicitado"} message={"Se enviara una notificación de la misma al usuario"} onClose={() => setCompleted(false)}/>
            )}
            {error !== null && (
                <PopUp title={"Error"} message={error} onClose={()=>setError(null)}/>
            )}
        </div>
    );
}