import PopUp from "../components/PopUp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { bajaCarrera, carreraPorNombre } from "@/api/carrerasApi";

export default function BajaCarrera() {
  const [value, setValue] = useState("");
  const [found, setFound] = useState(false);
  const [carreraData, setCarreraData] = useState(null);
  const [deleted, setDeleted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!value.trim()) {
      setError("Por favor, ingresá un nombre de carrera para buscar.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const carrera = await carreraPorNombre(value.trim());

      if (carrera) {
        setCarreraData(carrera);
        setFound(true);
      } else {
        setError("Carrera no encontrada");
      }
    } catch (error) {
      console.log("Error al buscar carrera", error.message);
      setError(error.message || "Carrera no encontrada");
      setFound(false);
    } finally {
      setLoading(false);
    }
  };

  const handleBaja = async () => {
    if (!carreraData || !carreraData.uuid) {
      setError("No hay carrera seleccionada para dar de baja");
      return;
    }

    setLoading(true);
    try {
      await bajaCarrera(carreraData.uuid);
      console.log("Carrera dada de baja exitosamente");
      setDeleted(true);
      setFound(false);
    } catch (err) {
      console.log("Error al dar de baja la carrera", err.message);
      setError(err.message || "Error al eliminar carrera");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-6xl p-6">
        {!deleted && (
          <div>
            <h1 className="font-bold text-center text-2xl mb-4">
              Baja de Carrera
            </h1>
            <span className="block w-full h-[3px] bg-sky-950 mb-6" />

            <div className="flex gap-3 items-center w-full">
              <Input
                placeholder="Ingrese nombre de carrera"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="flex-1"
              />
              <Button
                disabled={loading || !value.trim()}
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6"
              >
                {loading ? "Buscando..." : "Buscar"}
              </Button>
            </div>

            {error && (
              <div className="text-center text-red-500 text-sm mt-4">
                {error}
              </div>
            )}
          </div>
        )}

        {/* Carrera encontrada - Confirmación */}
        {found && carreraData && (
          <div className="w-full max-w-6xl p-6">
            <div className="w-full bg-white border-2 border-red-500 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-red-600 mb-4">
                ⚠️ Confirmar Baja de Carrera
              </h2>
              <span className="block w-full h-[2px] bg-red-500 mb-4"></span>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-3 text-gray-800">
                  Datos de la Carrera:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Nombre:</span>
                    <p className="text-gray-900">{carreraData.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Código:</span>
                    <p className="text-gray-900">{carreraData.code}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Facultad:</span>
                    <p className="text-gray-900">{carreraData.faculty}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Modalidad:
                    </span>
                    <p className="text-gray-900">{carreraData.modality}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Duración:</span>
                    <p className="text-gray-900">
                      {carreraData.duration_years} años /{" "}
                      {carreraData.duration_hours} hs
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Título:</span>
                    <p className="text-gray-900">{carreraData.degree_title}</p>
                  </div>
                </div>
              </div>

              <p className="text-red-600 font-medium mb-6">
                ¿Estás seguro que deseas dar de baja esta carrera? Esta acción
                no se puede deshacer.
              </p>

              <div className="flex gap-4">
                <Button
                  disabled={loading}
                  onClick={handleBaja}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded"
                >
                  {loading ? "Procesando..." : "Confirmar Baja"}
                </Button>
                <Button
                  onClick={() => {
                    setFound(false);
                    setCarreraData(null);
                    setValue("");
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-2 rounded"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Carrera dada de baja exitosamente */}
        {deleted && (
          <div className="w-full max-w-6xl p-6">
            <div className="w-full bg-white border-2 border-green-500 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-green-600 mb-4">
                ✓ Carrera Dada de Baja Exitosamente
              </h2>
              <span className="block w-full h-[2px] bg-green-500 mb-4"></span>

              <p className="text-gray-700 mb-6">
                La carrera{" "}
                <span className="font-semibold">{carreraData?.name}</span> ha
                sido dada de baja correctamente.
              </p>

              <Button
                onClick={() => {
                  setDeleted(false);
                  setCarreraData(null);
                  setValue("");
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded"
              >
                Nueva Baja
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
