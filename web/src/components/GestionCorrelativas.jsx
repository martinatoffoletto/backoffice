import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldSet } from "@/components/ui/field";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import CardMateria from "./CardMateria";
import PopUp from "./PopUp";
import { materiaPorId, obtenerMaterias } from "@/api/materiasApi";
import { Checkbox } from "./ui/checkbox";

export default function GestionCorrelativas() {
  const [materiaID, setMateriaID] = useState("");           
  const [materiaOrigen, setMateriaOrigen] = useState(null); 
  const [allMaterias, setAllMaterias] = useState([]);       
  const [selectedValues, setSelectedValues] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const materias = await obtenerMaterias();
        setAllMaterias(materias);
      } catch (err) {
        setError(err.message || "Error al obtener materias");
      }
    };
    fetchMaterias();
  }, []);

  const handleBuscarOrigen = async () => {
    if (!materiaID.trim()) {
      setError("Debes ingresar un ID de materia");
      return;
    }

    try {
      const materia = await materiaPorId(materiaID);
      setMateriaOrigen(materia);
      setSelectedValues([]); 
      setError(null);
    } catch (err) {
      setError(err.message || "Materia no encontrada");
      setMateriaOrigen(null);
    }
  };

  const toggleValue = (id_materia) => {
    if (selectedValues.includes(id_materia)) {
      setSelectedValues(selectedValues.filter((id) => id !== id_materia));
    } else {
      setSelectedValues([...selectedValues, id_materia]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!materiaOrigen) {
      setError("Debes buscar primero la materia de origen");
      return;
    }

    if (selectedValues.length === 0) {
      setError("Debes seleccionar al menos una materia correlativa");
      return;
    }

    console.log("Materia de origen:", materiaOrigen);
    console.log("Correlativas seleccionadas:", selectedValues);

    setCompleted(true);
  };

  const handleReset = () => {
    setCompleted(false);
    setMateriaID("");
    setMateriaOrigen(null);
    setSelectedValues([]);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-8">
      <h1 className="font-bold text-xl mb-4">Gestión de Correlativas</h1>
      <span className="block w-full h-[2px] bg-sky-950 mb-6"></span>

      {!completed && (
        <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-2xl">
          {!materiaOrigen && (
            <div className="flex flex-col gap-4">
              <Input
                placeholder="Ingrese ID de la materia de origen"
                value={materiaID}
                onChange={(e) => setMateriaID(e.target.value)}
              />
              <Button
                onClick={handleBuscarOrigen}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
              >
                Buscar Materia
              </Button>
            </div>
          )}

          
          {materiaOrigen && (
            <>
              <div className="mb-4">
                <p>
                  <strong>Materia encontrada:</strong> {materiaOrigen.nombre} (ID: {materiaOrigen.id_materia})
                </p>
              </div>

              <Field>
                <FieldLabel>
                  Asignar correlativas <span className="text-red-500">*</span>
                </FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      {selectedValues.length > 0
                        ? allMaterias
                            .filter((m) => selectedValues.includes(m.id_materia))
                            .map((m) => m.nombre)
                            .join(", ")
                        : "Seleccione las materias correlativas"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[250px] p-2">
                    {allMaterias
                      .filter((m) => m.id_materia !== materiaOrigen.id_materia) 
                      .map((m) => (
                        <div
                          key={m.id_materia}
                          className="flex items-center space-x-2 py-1 cursor-pointer"
                          onClick={() => toggleValue(m.id_materia)}
                        >
                          <Checkbox checked={selectedValues.includes(m.id_materia)} />
                          <label>{m.nombre}</label>
                        </div>
                      ))}
                  </PopoverContent>
                </Popover>
              </Field>

              <div className="flex justify-start mt-4">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
                >
                  Guardar
                </Button>
              </div>
            </>
          )}
        </form>
      )}

      {completed && (
        <div className="flex flex-col justify-center items-center border border-green-500 p-4 rounded-md shadow-sm gap-4 w-full max-w-md my-4 bg-white">
          <CardMateria
            title="Las materias correlativas han sido asignadas exitosamente"
            materia={materiaOrigen}
          />
          <Button
            onClick={handleReset}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md"
          >
            OK
          </Button>
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