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
import { carreraPorId, modificarCarrera, obtenerCarreras} from "@/api/carrerasApi";
import { useEffect } from "react";
import { Checkbox } from "./ui/checkbox";
import CardCarrera from "./CardCarrera";


export default function ModifCarrera(second) {
    const [date, setDate] = useState();
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
    const [completed, setCompleted] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [addError, setAddError] = useState(null);
    const [value, setValue] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [selectedValues, setSelectedValues]=useState([])
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [error, setError]=useState(null)
    const [carreraData, setCarreraData] = useState(null);


    const toggleValue = (id) => {
      setSelectedValues((prev) =>
        prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
      );
    };

    const handleSearch = async() => {
        try{
        if (!value.trim()) return;
        const response = await carreraPorId(value);
        console.log("Carrera encontrada exitosamente") 
        setCarreraData(response)
        setForm({
            id: response.id,
            nombre: response.nombre || "",
            status: response.status || "activo"
            });
            setShowForm(true);
        }catch(error){
        console.log("Error al buscar carrera", error.message)
        setSearchError("No se encontró la carrera o ocurrió un error al buscar.");
        }
  };

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{            
            const response = await modificarCarrera(value, form)
            console.log("Carrera modificada exitosamente")
            setShowForm(false)
            setCompleted(true);
        }catch(err){
            setError(err.message);
            console.error(err.message)
        }

    }
    return(
        <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-2xl p-6">
                <h1 className="font-bold text-center text-2xl mb-4">Modificación de Carrera</h1>
                <span className="block w-full h-[3px] bg-sky-950"></span>

                <h3 className="text-sm mb-2 mt-8 text-center">
                Ingrese el numero de la carrera a modificar
                </h3>
                <div className="flex flex-col items-center lg:flex-row gap-4 justify-center">
                {/* Input controlado */}
                <Input   
                placeholder="ID carrera"
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
                {searchError && <p className="text-red-500 mt-2 text-center">{searchError}</p>}
            </div>
            { showForm &&( 
                <div className="w-full max-w-2xl p-6">
                    <h1 className="font-bold text-center text-2xl mb-4">Modificación de Carrera</h1>
                    <span className="block w-full h-[3px] bg-sky-950"></span>

                    <FieldSet className={"my-4"}>
                    <FieldGroup>

                        <Field>
                            <FieldLabel htmlFor="biblioteca">Nombre Carrera</FieldLabel>
                            <Input id="nombre" placeholder="Nombre/s" value={form.nombre} onChange={(e)=> setForm((prev) => ({ ...prev, nombre: e.target.value }))} />  
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
                <div className="w-full max-w-2xl p-6">
                    <div className="flex flex-col justify-center items-center border border-green-500 p-4 rounded-md shadow-sm gap-4 bg-white">
                        <CardCarrera title={"Información modificada exitosamente"} carrera={form} />
                        <Button
                        onClick={() => {setCompleted(false); setValue("")}}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-md"
                        >
                        OK
                        </Button>
                    </div>
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