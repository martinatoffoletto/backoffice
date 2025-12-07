import { Button } from "@/components/ui/button";
import { useState } from "react";
import PopUp from "@/components/PopUp";
import { altaCarrera } from "@/api/carrerasApi";
import CardCarrera from "./CardCarrera";
import FormCarrera from "./FormCarrera";

export default function AltaCarrera(second) {
  const [date, setDate] = useState();
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [selectedValues, setSelectedValues] = useState([]);
  const [carreraData, setCarreraData] = useState(null);
  const [filteredOptions, setFilteredOptions] = useState([]);

  const toggleValue = (id) => {
    setSelectedValues((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

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

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log("Selected values:", selectedValues);
      const response = await altaCarrera(form, selectedValues);
      console.log("Carrera dada de alta exitosamente");
      setCompleted(true);
      // Extraer data si viene en formato { success: true, data: {...} }
      setCarreraData(response.data || response);
      setSelectedValues([]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-6xl p-6">
        <h1 className="font-bold text-center text-2xl mb-4">Alta de Carrera</h1>
        <span className="block w-full h-[3px] bg-sky-950"></span>

        {!completed && (
          <FormCarrera form={form} setForm={setForm} onSubmit={handleSubmit} />
        )}

        {completed && (
          <div className="flex flex-col justify-center items-center border border-green-500 p-4 rounded-md shadow-sm gap-4 w-full max-w-md mx-auto my-4 bg-white">
            <CardCarrera
              title={"Carrera dada de alta exitosamente"}
              carrera={carreraData}
            />
            <Button
              onClick={() => {
                setCompleted(false);
                setForm({
                  name: "",
                  description: "",
                  degree_title: "",
                  code: "",
                  faculty: "",
                  modality: "presencial",
                  duration_hours: 0,
                  duration_years: 0,
                });
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
          title="Error al dar de alta la carrera"
          message={error}
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
}
