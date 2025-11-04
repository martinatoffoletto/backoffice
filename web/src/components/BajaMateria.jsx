import CardCurso from "@/components/CardCurso";
import PopUp from "../components/PopUp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { bajaMateria, materiaPorId } from "@/api/materiasApi";
import CardMateria from "./CardMateria";

export default function BajaMateria() {
  const [value, setValue] = useState("");
  const [found, setFound] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [materiaData, setMateriaData]=useState(null)



  const handleSearch = async() => {
    try{
      if (!value.trim()) return;
      const response = await materiaPorId(value);
      console.log("Materia encontrada exitosamente") 
      setFound(response)
      setMateriaData(response)
    }catch(error){
      console.log("Error al buscar materia", error.message)
    }
  };

  const handleBaja=async()=>{
    try{
      const response= await bajaMateria(value)
      console.log("Materia dado de baja exitosamente")
      setShowPopup(true)
      setFound(null)
      setValue("")
    }catch(err){
        console.log("Error al dar de baja materia:", err.message)
        setError(err.message)
    }
  }



  return (
    <div className="flex min-h-screen flex-col items-start justify-start mt-4">
      {/* Sección de búsqueda */}
      <div className="w-full max-w-md  p-6">
        <h1 className="font-bold text-xl mb-4">Baja de Materia</h1>
        <span className="block w-full h-[2px] bg-sky-950"></span>

        <h3 className="text-sm mb-2 mt-8">
          Ingrese el número de materia para proceder a la baja
        </h3>

        <div className="flex flex-col items-start lg:flex-row gap-4 min-w-xl">
        {/* Input controlado */}
        <Input
          className="mb-4"
          placeholder="Número de Materia"
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
      </div>

      {/* Resultado simulado */}
      {found !== null && (
        <div className="flex flex-col justify-center items-center border border-red-500 p-4 rounded-md shadow-sm gap-4 w-full max-w-md mx-auto my-4 bg-white">
          <CardMateria title={"Materia encontrada"} materia={found}/>
          <Button
            variant="destructive"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={handleBaja}
          >
            Confirmar Baja
          </Button>
        </div>
      )}

      {/* Popup de confirmación */}
      {showPopup && (
        <div className="flex flex-col justify-center items-center border border-green-500 p-4 rounded-md shadow-sm gap-4 w-full max-w-md mx-auto my-4 bg-white">
            <CardMateria title={"Información eliminada exitosamente"} materia={materiaData} />
            <Button
            onClick={() => {setShowPopup(false); setValue("");setMateriaData(null)}}
            className="bg-green-500 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-md"
            >
            OK
            </Button>
        </div>
      )}

    </div>
  );
}
