import CardCurso from "@/components/CardCurso";
import PopUp from "../components/PopUp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function BajaMateria() {
  const [value, setValue] = useState("");
  const [found, setFound] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleSearch = async() => {
    try{
      if (!value.trim()) return;
      const response = await fetch(`http://localhost:8080/materias/${value}`); 
      if (!response.ok){
        throw new Error("")
      }
      const data= await response.json()
      setFound(true)
    }catch(error){
      console.log("Error al buscar materia", error.message)
    }
  };

  const handleBaja=async()=>{
    
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gray-50 mt-4">
      {/* Sección de búsqueda */}
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md my-4">
        <h1 className="font-bold text-center text-xl mb-4">Baja de Materia</h1>
        <h3 className="text-sm mb-2">
          Ingrese el número de materia para proceder a la baja
        </h3>

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
        <PopUp title={"Se ha dado de baja la materia solicitada"} message={"se pasara el objeto materia"} onClose={() => setShowPopup(false)}/>
      )}
    </div>
  );
}
