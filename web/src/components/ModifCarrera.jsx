import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import PopUp from "@/components/PopUp";
import { carreraPorNombre, modificarCarrera } from "@/api/carrerasApi";
import FormCarrera from "./FormCarrera";

export default function ModifCarrera() {
  const [nombreCarrera, setNombreCarrera] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    degree_title: "",
    code: "",
    faculty: "",
    modality: "presencial",
    duration_hours: 0,
    duration_years: 0,
  });
  const [completed, setCompleted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [carreraData, setCarreraData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!nombreCarrera.trim()) {
      setError("Por favor, ingresá un nombre de carrera para buscar.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const carrera = await carreraPorNombre(nombreCarrera.trim());

      if (carrera) {
        setCarreraData(carrera);

        // Rellenar el formulario con los datos actuales de la carrera
        setForm({
          name: carrera.name || "",
          description: carrera.description || "",
          degree_title: carrera.degree_title || "",
          code: carrera.code || "",
          faculty: carrera.faculty || "",
          modality: carrera.modality || "presencial",
          duration_hours: carrera.duration_hours || 0,
          duration_years: carrera.duration_years || 0,
        });
        setShowForm(true);
      } else {
        setError("Carrera no encontrada");
      }
    } catch (error) {
      console.log("Error al buscar carrera", error.message);
      setError(error.message || "Carrera no encontrada");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!carreraData || !carreraData.uuid) {
      setError("No hay carrera seleccionada para modificar");
      return;
    }

    setLoading(true);
    try {
      console.log("Enviando datos:", { uuid: carreraData.uuid, data: form });
      const response = await modificarCarrera(carreraData.uuid, form);
      console.log("Respuesta del servidor:", response);
      console.log("Carrera modificada exitosamente");
      setShowForm(false);
      setCompleted(true);
    } catch (err) {
      console.error("Error completo:", err);
      console.error("Respuesta del error:", err.response?.data);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Error al modificar carrera"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-6xl p-6">
        {!completed && !showForm && (
          <div>
            <h1 className="font-bold text-center text-2xl mb-4">
              Modificación de Carrera
            </h1>
            <span className="block w-full h-[3px] bg-sky-950 mb-6" />

            <div className="flex gap-3 items-center w-full">
              <Input
                placeholder="Ingrese nombre de carrera"
                value={nombreCarrera}
                onChange={(e) => setNombreCarrera(e.target.value)}
                className="flex-1"
              />
              <Button
                disabled={loading || !nombreCarrera.trim()}
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

        {showForm && carreraData && (
          <div>
            <h1 className="font-bold text-center text-2xl mb-4">
              Modificar Carrera - {carreraData.name}
            </h1>
            <span className="block w-full h-[3px] bg-sky-950 mb-6" />

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Carrera actual:</span>{" "}
                {carreraData.name} ({carreraData.code})
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Modificá los campos que desees actualizar y presioná "Guardar"
              </p>
            </div>

            <FormCarrera
              form={form}
              setForm={setForm}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setCarreraData(null);
                setNombreCarrera("");
              }}
              showCancel={true}
            />
          </div>
        )}

        {completed && (
          <div className="w-full bg-green-50 border-2 border-green-500 p-8 rounded-xl shadow-lg">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-3xl font-bold">✓</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-green-700 text-center mb-2">
              Carrera Modificada Exitosamente
            </h2>
            <p className="text-center text-gray-600 text-sm mb-6">
              Los cambios se han guardado correctamente.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  setCompleted(false);
                  setShowForm(false);
                  setCarreraData(null);
                  setNombreCarrera("");
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded"
              >
                Nueva Modificación
              </Button>
            </div>
          </div>
        )}

        {error && (
          <PopUp title="Error" message={error} onClose={() => setError(null)} />
        )}
      </div>
    </div>
  );
}
