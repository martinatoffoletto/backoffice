import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import PopUp from "@/components/PopUp";
import { materiaPorId, modificarMateria, obtenerCarreras, obtenerCarrerasPorMateria } from "@/api/materiasApi";
import { useEffect } from "react";
import { Checkbox } from "./ui/checkbox";
import CardMateria from "./CardMateria";


export default function ModifMateria(second) {
    const [date, setDate] = useState();
    const [form, setForm] = useState({
        id:null,
        nombre:"",
        status:"activo"
    });
    const [completed, setCompleted] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [addError, setAddError] = useState(null);
    const [value, setValue] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedValues, setSelectedValues]=useState([])
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [error, setError]=useState(null)


    const toggleValue = (id) => {
      setSelectedValues((prev) =>
        prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
      );
    };

    const handleSearch = async () => {
        try {
            if (!value.trim()) return;

            const response = await materiaPorId(value);
            const carrerasPorMateria = await obtenerCarrerasPorMateria(value);

            setForm(response);

            // Guardar solo los IDs
            const idsCarreras = carrerasPorMateria.map((c) => c.id_carrera);
            setSelectedValues(idsCarreras);

            console.log("Materia encontrada. Carreras asociadas:", idsCarreras);

            setShowForm(true);
        } catch (err) {
            setSearchError(err.message);
            setShowForm(false);
        }
        };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{            
            const response = await modificarMateria(value, form)
            console.log("materia modificada exitosamente")
            setShowForm(false)
            setCompleted(true);
        }catch(err){
            setError(err.message);
            console.error(err.message)
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
        <div className="flex min-h-screen min-w-2xl flex-col items-start justify-start  my-4">
            <div className="w-full max-w-md p-6 ">
                <h1 className="font-bold text-xl mb-4">Modificación de Materia</h1>
                        <span className="block w-full h-[2px] bg-sky-950"></span>

                <h3 className="text-sm mb-2 mt-8">
                Ingrese el numero de materia a modificar
                </h3>
                <div className="flex flex-col items-start lg:flex-row gap-4 min-w-xl">
                {/* Input controlado */}
                <Input
                className="mb-4"
                placeholder="ID Materia"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                />

                {/* Botón de búsqueda */}
                <Button
                disabled={!value.trim()}
                onClick={handleSearch}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                Buscar
                </Button>
                </div>
                {searchError && <p className="text-red-500 mt-2">{searchError}</p>}
            </div>
            { showForm &&( 
                <div className="w-full max-w-md bg-white p-6 my-4">
                    <h1 className="font-bold text-xl mb-4">Modificación de Materia</h1>
                    <span className="block w-full h-[2px] bg-sky-950"></span>

                    <FieldSet className={"my-4"}>
                    <FieldGroup>

                        <Field>
                            <FieldLabel htmlFor="biblioteca">Nombre Materia</FieldLabel>
                            <Input id="nombre" placeholder="Nombre/s" value={form.nombre} onChange={(e)=> setForm((prev) => ({ ...prev, nombre: e.target.value }))} />  
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

                        <div className="flex justify-center">
                        <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded mt-4" onClick={handleSubmit}>
                            Guardar
                        </Button>
                        <Button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded mt-4 ml-4" onClick={() => setShowForm(false)}>
                            Cancelar
                        </Button>
                        </div>
                    </FieldGroup>
                    </FieldSet>
                </div>
            )}

            {completed && (
                <div className="flex flex-col justify-center items-center border border-green-500 p-4 rounded-md shadow-sm gap-4 w-full max-w-md mx-auto my-4 bg-white">
                    <CardMateria title={"Información modificada exitosamente"} materia={form} />
                    <Button
                    onClick={() => {setCompleted(false); setValue("")}}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-md"
                    >
                    OK
                    </Button>
                </div>
            )}
            {addError && (
                <PopUp title="Error" message={addError} onClose={() => setAddError(null)} />
            )}
            {error!==null && (
                <PopUp title={"Error"} message={error} onClose={()=>setError(null)}/>
            )}

            
        </div>
    )
}