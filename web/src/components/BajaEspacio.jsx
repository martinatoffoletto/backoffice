import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PopUp from "@/components/PopUp";
import { useState } from "react";
import { bajaEspacio, espacioPorId } from "@/api/espaciosApi";

export default function BajaEspacio() {
  const [id_espacio, setIdEspacio] = useState("");
  const [espacioData, setEspacioData] = useState(null);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSearch = async () => {
    try {
      if (!id_espacio.trim()) return;
      const response = await espacioPorId(id_espacio);
      setEspacioData(response);
      setShowConfirm(true);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Error al buscar el espacio");
      setEspacioData(null);
      setShowConfirm(false);
    }
  };

  const handleDelete = async () => {
    try {
      await bajaEspacio(id_espacio);
      setCompleted(true);
      setShowConfirm(false);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Error al eliminar el espacio");
    }
  };

  const cleanForm = () => {
    setIdEspacio("");
    setEspacioData(null);
    setError(null);
    setCompleted(false);
    setShowConfirm(false);
  };

  return (
    <div className="flex min-h-screen min-w-2xl flex-col items-start justify-start">
      <div className="w-full max-w-md p-6">
        <h1 className="font-bold text-xl mb-4">Baja de Espacio</h1>
        <span className="block w-full h-[2px] bg-sky-950"></span>

        <h3 className="text-sm mb-2 mt-8">
          Ingrese el ID del espacio a dar de baja
        </h3>

        <div className="flex flex-col items-start lg:flex-row gap-4 min-w-xl">
          <Input
            className="lg:mb-4"
            placeholder="ID del espacio"
            value={id_espacio}
            onChange={(e) => setIdEspacio(e.target.value)}
          />

          <Button
            disabled={!id_espacio.trim()}
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Buscar
          </Button>
        </div>
      </div>

      {showConfirm && espacioData && (
        <div className="w-full max-w-md px-6 my-4 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h2 className="font-bold text-lg mb-4">Confirmar eliminación</h2>
          <p className="mb-2">
            <strong>Nombre:</strong> {espacioData.nombre}
          </p>
          <p className="mb-2">
            <strong>Tipo:</strong> {espacioData.tipo}
          </p>
          <p className="mb-2">
            <strong>Ubicación:</strong> {espacioData.ubicacion}
          </p>
          <p className="mb-4">
            <strong>Capacidad:</strong> {espacioData.capacidad}
          </p>
          <div className="flex gap-4">
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-md"
            >
              Confirmar eliminación
            </Button>
            <Button
              onClick={cleanForm}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded-md"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {completed && (
        <div className="w-full max-w-md px-6 my-4 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="font-bold text-lg mb-2 text-green-800">
            Espacio eliminado exitosamente
          </h2>
        </div>
      )}

      {error && (
        <PopUp
          title="Error"
          message={error}
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
}

