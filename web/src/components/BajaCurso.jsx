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
          const response= await bajaCurso(value)
          console.log("Curso dado de baja exitosamente")
          setFound(null)
          setShowPopup(true)
      }catch(err){
          console.log("Error al dar de baja curso:", err.message)
          setError(err.message)
      }
      
  }
  return (
    <div className="flex min-h-screen items-start justify-center">
      {/* Sección de búsqueda */}
      <div className="w-full max-w-2xl bg-white p-6 rounded-xl ">
        <h1 className="font-bold text-xl mb-4">Baja de Curso</h1>
        <span className="block w-full h-[3px] bg-sky-950"></span>

        <h3 className="text-sm mb-4 mt-8">
            Ingrese el número de curso para proceder a la baja
        </h3>
        <div className="flex flex-col items-start lg:flex-row gap-4 min-w-xl">
          

          {/* Input controlado */}
          <Input
            className="lg:mb-4"
            placeholder="Número de Curso"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

           {/* Botón de búsqueda */}
          <Button
            disabled={!value.trim()}
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Buscar
          </Button>

        </div>
         {/* Resultado simulado */}
      {found && (
        <div className="flex flex-col justify-center items-center border w-full max-w-md bg-white  border-red-500  p-6 rounded-xl shadow-md ml-6">
          <CardCurso title={"Desea eliminar el curso?"} curso={cursoData}/>
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
        <div className="flex flex-col justify-center items-center border border-blue-500 p-4 rounded-md shadow-sm gap-4 w-full max-w-md mx-auto my-4 bg-white">
                    <CardCurso title={"Curso eliminado exitosamente"} curso={cursoData} />
                    <Button
                    onClick={() => {setShowPopup(false); setValue("")}}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md"
                    >
                    OK
                    </Button>
                </div>
      )}

      { error && (<PopUp title={"Error"} message={error} onClose={()=>setError(null)}/>)}
       
      </div>

     
    </div>
  );
}
