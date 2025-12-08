import { Button } from "@/components/ui/button";
import {
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import PopUp from "@/components/PopUp";
import { altaMateria } from "@/api/materiasApi";
import { obtenerCarreras } from "@/api/carrerasApi";
import CardMateria from "./CardMateria";
import FormMateria from "./FormMateria";

export default function AltaMateria(second) {
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [materiaData, setMateriaData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    description: "",
    approval_method: "",
    is_elective: false,
    uuid_carrera: "",
  });

  const handleSubmit = async (e) => {
    try {
      setIsLoading(true);
      const response = await altaMateria(form);
      console.log("Materia dada de alta exitosamente");
      setCompleted(true);
      setMateriaData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-6xl p-6">
        <h1 className="font-bold text-center text-2xl mb-4">Alta de Materia</h1>
        <span className="block w-full h-[3px] bg-sky-950"></span>

        {!completed && (
          <form onSubmit={handleSubmit} className="space-y-5 mt-8">
            <FormMateria
              form={form}
              setForm={setForm}
              onSubmit={handleSubmit}
              submitButtonText="Guardar"
              isLoading={isLoading}
            />
          </form>
        )}

        {completed && (
          <div className="flex flex-col justify-center items-center border border-green-500 p-4 rounded-md shadow-sm gap-4 w-full max-w-md mx-auto my-4 bg-white">
            <CardMateria
              title={"Materia dada de alta exitosamente"}
              materia={materiaData}
            />
            <Button
              onClick={() => {
                setCompleted(false);
                setForm({ nombre: "", description: "", approval_method: "", is_elective: false, uuid_carrera: "" });
              }}
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-md"
            >
              OK
            </Button>
          </div>
        )}
      </div>

      {error && (
        <PopUp
          title="Error al dar de alta al usuario"
          message={error}
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
}
