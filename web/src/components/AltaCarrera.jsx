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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import PopUp from "@/components/PopUp";
import { altaCarrera, obtenerCarreras } from "@/api/carrerasApi";
import { Checkbox } from "./ui/checkbox";
import CardCarrera from "./CardCarrera";


export default function AltaCarrera(second) {
    const [date, setDate] = useState();
    const [completed, setCompleted] = useState(false);
    const [error, setError] = useState(null);
    const [selectedValues, setSelectedValues]=useState([])
    const[carreraData, setCarreraData]=useState(null)
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
          const response= await altaCarrera(form, selectedValues)
          console.log("Carrera dada de alta exitosamente")
          setCompleted(true);
          setCarreraData(response)         
          setSelectedValues([]);
        } catch (err){
            setError(err.message);  
        }
    }

    return(
    <div className="flex min-h-screen min-w-2xl  items-start justify-start">
      <div className="w-full max-w-2xl p-8">
        <h1 className="font-bold text-xl mb-4">Alta de Carrera</h1>
        <span className="block w-full h-[2px] bg-sky-950"></span>

        {!completed &&(
          <form onSubmit={handleSubmit} className="space-y-5 mt-8">
          <FieldSet>
            <FieldGroup className="space-y-5">

              <Field>
                <FieldLabel htmlFor="nombre">Nombre de Carrera<span className="text-red-500">*</span></FieldLabel>
                <Input
                  id="nombre"
                  placeholder="Nombre de Carrera"
                  value={form.nombre}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, nombre: e.target.value }))
                  } 
                />
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
          <CardCarrera title={"Carrera dada de alta exitosamente"} carrera={carreraData} />
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
          title="Error al dar de alta la carrera"
          message={error}
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
}