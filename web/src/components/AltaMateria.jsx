import { Button } from "@/components/ui/button"
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
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator
} from "@/components/ui/select.jsx";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import  {format} from "date-fns"
import PopUp from "@/components/PopUp";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import { altaMateria } from "@/api/materiasApi";
import { Checkbox } from "./ui/checkbox";

export default function AltaMateria(second) {
    const [date, setDate] = useState();
    const [completed, setCompleted] = useState(false);
    const [error, setError] = useState(null);
    const [selectedValues, setSelectedValues]=useState([])

    const options=["Carrera 1", "Carrera 2", "Carrera 3", "Carrera 4"]

    const toggleValue = (value) => {
      setSelectedValues((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
    };

    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        fechaNacimiento: "",
        tipoDocumento: "",
        nroDocumento: "",
        correoElectronico: "",
        telefono: "",
        direccion: "",
        localidad: "",
        provincia: "",
        paisResidencia: "",
        nacionalidad: "",
        carrera: "",
        fechaInscripcion: ""
    });
    
    const handleSubmit = async(e) => {
       try{
          e.preventDefault();
          const response= await altaMateria(form)
          console.log("Materia dada de alta exitosamente")
          setCompleted(true);
        } catch (err){
            setError(err.message);  
        }
    } 

    return(
    <div className="flex min-h-screen min-w-2xl  items-start justify-start">
      <div className="w-full max-w-2xl p-8">
        <h1 className="font-bold text-xl mb-4">Alta de Materia</h1>
        <span className="block w-full h-[2px] bg-sky-950"></span>

        <form onSubmit={handleSubmit} className="space-y-5 mt-8">
          <FieldSet>
            <FieldGroup className="space-y-5">

              <Field>
                <FieldLabel htmlFor="nombre">Nombre de Materia</FieldLabel>
                <Input id="nombre" placeholder="Nombre de Materia" />
              </Field>

              <Field>
                  <FieldLabel>
                    Carrera/s<span className="text-red-500">*</span>
                  </FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full sm:w-[80%] md:w-[70%] justify-start"
                      >
                        {selectedValues.length > 0
                          ? selectedValues.join(", ")
                          : "Seleccioná carrera(s) a la(s) que pertenece"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[250px] p-2">
                      {options.map((opt) => (
                        <div
                          key={opt}
                          className="flex items-center space-x-2 py-1 cursor-pointer"
                          onClick={() => toggleValue(opt)}
                        >
                          <Checkbox checked={selectedValues.includes(opt)} />
                          <label>{opt}</label>
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                </Field>

              <div className="flex justify-start">
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
      </div>

      {completed && (
        <PopUp
          title="Usuario dado de alta exitosamente"
          message="Se pasará el objeto usuario."
          onClose={() => setCompleted(false)}
        />
      )}

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