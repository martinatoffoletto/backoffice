import CardCurso from "@/components/CardCurso";
import PopUp from "../components/PopUp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { bajaCurso, cursoPorId } from "@/api/cursosApi";

export default function BajaCurso() {
  const [value, setValue] = useState("");
  const [found, setFound] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [cursoData, setCursoData]=useState(null)
  const [error, setError]=useState(null)

  const handleSearch = async() => {
      try{
          if (!value.trim()) return;
          const response = await cursoPorId(value)
          console.log(`Curso con id: ${value}  encontrado: ${response}`)
          setCursoData(response)
          setFound(true)
      }catch(error){
          console.log("Error al buscar curso:", error.message)
          setError(error.message)
      }
  };

  const handleBaja=async()=>{
      try{
          const response= await bajaCurso()
          console.log("Curso dado de baja exitosamente")
      }catch(err){
          console.log("Error al dar de baja curso:", err.message)
          setError(err.message)
      }
      
  }
  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-50 mt-4">
      {/* Sección de búsqueda */}
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md my-4">
        <h1 className="font-bold text-center text-xl mb-4">Baja de Curso</h1>
        <h3 className="text-sm mb-2">
          Ingrese el número de curso para proceder a la baja
        </h3>

        {/* Input controlado */}
        <Input
          className="mb-4"
          placeholder="Número de Curso"
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
      </div>

      {/* Resultado simulado */}
      {found && (
        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md ml-6">
          <CardCurso />
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
      {showPopup && (
        <PopUp title={"Se ha dado de baja el curso solicitado"} message={"se pasara el objeto curso"} onClose={() => setShowPopup(false)}/>
      )}

      { error && (<PopUp title={"Error"} message={error} onClose={()=>setError(null)}/>)}
    </div>
  );
}
