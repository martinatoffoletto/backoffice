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
        descripcion:"",
        titulo:"",
        codigo:"",
        facultad:"",
        modalidad:"",
        duracion_horas:0,
        duracion_anios:0,
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
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-2xl p-6">
        <h1 className="font-bold text-center text-2xl mb-4">Alta de Carrera</h1>
        <span className="block w-full h-[3px] bg-sky-950"></span>

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
              <Field>
                <FieldLabel htmlFor="descripcion">Descripción<span className="text-red-500">*</span></FieldLabel>
                <Input
                  id="descripcion"
                  placeholder="Descripción"
                  value={form.descripcion}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, descripcion: e.target.value }))
                  } 
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="titulo">Título<span className="text-red-500">*</span></FieldLabel>
                <Input
                  id="titulo"
                  placeholder="Título"
                  value={form.titulo}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, titulo: e.target.value }))
                  } 
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="codigo">Código<span className="text-red-500">*</span></FieldLabel>
                <Input
                  id="codigo"
                  placeholder="Código"
                  value={form.codigo}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, codigo: e.target.value }))
                  } 
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="facultad">Facultad<span className="text-red-500">*</span></FieldLabel>
                <Input
                  id="facultad"
                  placeholder="Facultad"
                  value={form.facultad}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, facultad: e.target.value }))
                  } 
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="modalidad">Modalidad<span className="text-red-500">*</span></FieldLabel>
                <Input
                  id="modalidad"
                  placeholder="Modalidad"
                  value={form.modalidad}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, modalidad: e.target.value }))
                  } 
                />
              </Field>
              <Field>
                  <FieldLabel htmlFor="duracion_horas">Duración en Horas</FieldLabel>
                  <Input
                  type="number"
                  id="duracion_horas"
                  value={form.duracion_horas}
                  onChange={(e) =>
                      setForm((prev) => ({ ...prev, duracion_horas: parseInt(e.target.value) }))
                  }
                  />
              </Field>
              <Field>
                  <FieldLabel htmlFor="duracion_anios">Duración en Años</FieldLabel>
                  <Input
                  type="number"
                  id="duracion_anios"
                  value={form.duracion_anios}
                  onChange={(e) =>
                      setForm((prev) => ({ ...prev, duracion_anios: parseInt(e.target.value) }))
                  }
                  />
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