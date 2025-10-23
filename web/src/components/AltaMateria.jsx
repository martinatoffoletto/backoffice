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
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import  {format} from "date-fns"
import PopUp from "@/components/PopUp";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import { altaMateria, obtenerCarreras } from "@/api/materiasApi";
import { Checkbox } from "./ui/checkbox";
import CardMateria from "./CardMateria";

export default function AltaMateria(second) {
    const [date, setDate] = useState();
    const [completed, setCompleted] = useState(false);
    const [error, setError] = useState(null);
    const [selectedValues, setSelectedValues]=useState([])
    const[materiaData, setMateriaData]=useState(null)
    const [filteredOptions, setFilteredOptions] = useState([]);


    const toggleValue = (id) => {
      setSelectedValues((prev) =>
        prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
      );
    };

    const [form, setForm] = useState({
        id:null,
        nombre:"",
        status:"activo"
    });
    
    const handleSubmit = async(e) => {
       try{
          e.preventDefault();
          console.log("Selected values:",selectedValues)
          const response= await altaMateria(form, selectedValues)
          console.log("Materia dada de alta exitosamente")
          setCompleted(true);
          setMateriaData(response)         
          setSelectedValues([]);
        } catch (err){
            setError(err.message);  
        }
    }
    
    useEffect(()=>{
      const getCarreras=async()=>{
        try{
          const carreras= await obtenerCarreras()
          console.log("carreras:", carreras)
          setFilteredOptions(carreras)
        }catch(err){

        }
      }
      getCarreras()
    })

    return(
    <div className="flex min-h-screen min-w-2xl  items-start justify-start">
      <div className="w-full max-w-2xl p-8">
        <h1 className="font-bold text-xl mb-4">Alta de Materia</h1>
        <span className="block w-full h-[2px] bg-sky-950"></span>

        {!completed &&(
          <form onSubmit={handleSubmit} className="space-y-5 mt-8">
          <FieldSet>
            <FieldGroup className="space-y-5">

              <Field>
                <FieldLabel htmlFor="nombre">Nombre de Materia<span className="text-red-500">*</span></FieldLabel>
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
                  <FieldLabel>
                    Carrera/s<span className="text-red-500">*</span>
                  </FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full sm:w-[80%] md:w-[70%] justify-start">
                        {selectedValues.length > 0
                          ? filteredOptions
                              .filter((c) => selectedValues.includes(c.id_carrera))
                              .map((c) => c.nombre)
                              .join(", ")
                          : "Seleccioná carrera(s) a la(s) que pertenece"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[250px] p-2">
                      {filteredOptions.map((opt) => (
                        <div
                          key={opt.id_carrera}
                          className="flex items-center space-x-2 py-1 cursor-pointer"
                          onClick={() => toggleValue(opt.id_carrera)}
                        >
                          <Checkbox checked={selectedValues.includes(opt.id_carrera)} />
                          <label>{opt.nombre}</label>
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
      )}

      
      {completed  && (
        <div className="flex flex-col justify-center items-center border border-green-500 p-4 rounded-md shadow-sm gap-4 w-full max-w-md mx-auto my-4 bg-white">
          <CardMateria title={"Materia dada de alta exitosamente"} materia={materiaData} />
          <Button
            onClick={() => {setCompleted(false); setForm({ id: null, nombre: "", status: "activo" });}}
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