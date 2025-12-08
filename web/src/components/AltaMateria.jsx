import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select.jsx";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import PopUp from "@/components/PopUp";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { altaMateria, obtenerCarreras } from "@/api/materiasApi";
import { Checkbox } from "./ui/checkbox";
import CardMateria from "./CardMateria";

export default function AltaMateria(second) {
  const [date, setDate] = useState();
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [selectedValues, setSelectedValues] = useState([]);
  const [materiaData, setMateriaData] = useState(null);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [loadingCarreras, setLoadingCarreras] = useState(false);
  const [carreraSearch, setCarreraSearch] = useState("");

  const toggleValue = (id) => {
    setSelectedValues((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const [form, setForm] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    metodo_aprobacion: "",
    curricular: true,
    status: "activo",
  });

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log("Selected values:", selectedValues);
      const response = await altaMateria(form, selectedValues);
      console.log("Materia dada de alta exitosamente");
      setCompleted(true);
      setMateriaData(response);
      setSelectedValues([]);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const getCarreras = async () => {
      try {
        const carreras = await obtenerCarreras();
        console.log("carreras:", carreras);
        setFilteredOptions(carreras);
      } catch (err) {}
    };
    getCarreras();
  })
  
  useEffect(() => {
      const fetchCarreras = async () => {
        try {
          setLoadingCarreras(true);
          const response = await obtenerCarreras();
          setCarreras(response || []);
        } catch (error) {
          console.error("Error al cargar carreras:", error);
          setCarreras([]);
        } finally {
          setLoadingCarreras(false);
        }
      };
      fetchCarreras();
    }, []);
  
    const filteredCarreras = carreras.filter((carrera) =>
      carrera.nombre?.toLowerCase().includes(carreraSearch.toLowerCase().trim())
    );;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-6xl p-6">
        <h1 className="font-bold text-center text-2xl mb-4">Alta de Materia</h1>
        <span className="block w-full h-[3px] bg-sky-950"></span>

        {!completed && (
          <form onSubmit={handleSubmit} className="space-y-5 mt-8">
            <FieldSet>
              <FieldGroup className="space-y-5">
                <Field>
                  <FieldLabel htmlFor="nombre">
                    Nombre de Materia<span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="nombre"
                    placeholder="Nombre de Materia"
                    value={form.nombre}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, nombre: e.target.value }))
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="carrera">
                    Carrera<span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select
                    value={form.carrera}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, carrera: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingCarreras ? "Cargando carreras..." : "Seleccione carrera"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2">
                        <Input
                          placeholder="Buscar carrera..."
                          value={carreraSearch}
                          onChange={(e) => setCarreraSearch(e.target.value)}
                          className="mb-2"
                        />
                      </div>
                      <SelectGroup>
                        <SelectLabel>Carreras</SelectLabel>
                        {filteredCarreras.length > 0 ? (
                          filteredCarreras.map((carrera) => (
                            <SelectItem key={carrera.nombre} value={carrera.nombre}>
                              {carrera.nombre}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-2 py-1.5 text-sm text-gray-500">
                            {loadingCarreras
                              ? "Cargando..."
                              : "No se encontraron carreras"}
                          </div>
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="descripcion">
                    Descripción<span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="descripcion"
                    placeholder="Descripción"
                    value={form.descripcion}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        descripcion: e.target.value,
                      }))
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="metodo_aprobacion">
                    Tipo de Aprobación<span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select
                    id="metodo_aprobacion"
                    value={form.metodo_aprobacion}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev,
                        metodo_aprobacion: value, }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione tipo de aprobación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="final">Final Obligatorio</SelectItem>
                      <SelectItem value="promocion">Promoción</SelectItem>
                      <SelectItem value="trabajo_practico">Trabajo Practico Obligatorio</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <div>
                    <FieldLabel>¿Es curricular?</FieldLabel>
                    <RadioGroup
                      value={form.curricular ? "si" : "no"}
                      onValueChange={(value) =>
                        setForm((prev) => ({
                          ...prev,
                          curricular: value === "si",
                        }))
                      }
                      className="flex gap-4 mt-2"
                    >
                      <label className="flex items-center gap-2">
                        <RadioGroupItem value="si" id="curricular-si" />
                        <span>Si</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <RadioGroupItem value="no" id="curricular-no" />
                        <span>No</span>
                      </label>
                    </RadioGroup>
                  </div>
                </Field>

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md"
                  >
                    Guardar
                  </Button>
                </div>
              </FieldGroup>
            </FieldSet>
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
                setForm({ id: null, nombre: "", status: "activo" });
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
