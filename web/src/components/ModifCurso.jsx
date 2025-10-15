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
import  {format, set} from "date-fns"
import PopUp from "@/components/PopUp";
import { cursoPorId, modificarCurso } from "@/api/cursosApi";
import CardCurso from "@/components/CardCurso";


export default function ModifCurso(second) {

    const [value, setValue] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [date, setDate] = useState();
    const [form, setForm] = useState({
        fechaInicio: "",
        carrera: "",
        materia: "",
        modalidad: "",
        docente: "",
        auxiliar: "",
        sede: "",
        aula: ""
    });
    const [cursoData, setCursoData]=useState(null)
    const [completed, setCompleted] = useState(false);
    const [error, setError] = useState(null);

    
    const handleSearch = async() => {
        try{
            if(!value.trim()) return;
            const response = await cursoPorId(value)
            console.log("Curso encontrado exitosamente")
            setShowForm(true);
        }catch(err){
            setError(err.message);
            setShowForm(false);
        }
    };
    const handleSubmit = async(e) => {
        try{
            e.preventDefault();
            const response = await modificarCurso(value, form)
            console.log("Curso modificado exitosamente")
            setCursoData(response)
            setCompleted(true);
        }catch(err){
            setError(err.message);
            console.error(err.message)
        }
    } 

    return(
        <div className="flex min-h-screen flex-col items-center justify-start bg-gray-50 mt-4">
            {/*Secciom de busqueda*/}
            {!showForm &&(<div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md my-4">
                <h1 className="font-bold text-center text-xl mb-4">Modificación de Curso</h1>
                <h3 className="text-sm mb-2">
                Ingrese el número de curso para proceder a la modificación
                </h3>

                {/* Input controlado */}
                <Input
                className="mb-4"
                placeholder="Número de Curso"
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
            </div>)}
            { showForm &&( 
                <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
                    <h1 className="font-bold text-center text-xl mb-6">Modificación de Curso</h1>

                    <FieldSet>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="name">Fecha Inicio</FieldLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button className="w-full">
                                    {date ? format(date, "dd/MM/yyyy") : "Seleccione una fecha"}
                                </Button>
                                </PopoverTrigger>

                                <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                        </Field>

                        <Field>
                        <FieldLabel htmlFor="address">Carrera/s</FieldLabel>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleccione una opción" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectGroup>
                                    <SelectLabel>Operaciones</SelectLabel>
                                    <SelectItem value="alta">Alta de Curso</SelectItem>
                                    <SelectItem value="baja">Baja de Curso</SelectItem>
                                    <SelectItem value="modificacion">Modificación de Curso</SelectItem>

                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field>
                        <FieldLabel htmlFor="aulas">Materia</FieldLabel>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleccione una opción" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectGroup>
                                    <SelectLabel>Operaciones</SelectLabel>
                                    <SelectItem value="alta">Alta de Curso</SelectItem>
                                    <SelectItem value="baja">Baja de Curso</SelectItem>
                                    <SelectItem value="modificacion">Modificación de Curso</SelectItem>

                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field>
                        <FieldLabel htmlFor="comedor">Modalidad</FieldLabel>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleccione una opción" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectGroup>
                                    <SelectLabel>Operaciones</SelectLabel>
                                    <SelectItem value="mañana">Mañana</SelectItem>
                                    <SelectItem value="tarde">Tarde</SelectItem>
                                    <SelectItem value="noche">Noche</SelectItem>

                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="biblioteca">Docente</FieldLabel>
                            <Input id="docente" placeholder="Docente" />
                        </Field>

                        
                        <Field>
                            <FieldLabel htmlFor="biblioteca">Auxiliar</FieldLabel>
                            <Input id="auxiliar" placeholder="Auxiliar" />
                        </Field>


                        <Field>
                            <FieldLabel htmlFor="biblioteca">Sede</FieldLabel>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Seleccione una opción" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectGroup>
                                    <SelectLabel>Operaciones</SelectLabel>
                                    <SelectItem value="Montserrat">Montserrat</SelectItem>
                                    <SelectItem value="Recoleta">Recoleta</SelectItem>
                                    <SelectItem value="Costa">Costa</SelectItem>
                                    <SelectItem value="Belgrano">Belgrano</SelectItem>

                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="biblioteca">Aula</FieldLabel>
                            <Input id="aula" placeholder="Aula" />

                        </Field>
                        <div className="flex justify-center">
                        <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded mt-4" onClick={handleSubmit}>
                            Guardar
                        </Button>
                        </div>
                    </FieldGroup>
                    </FieldSet>
                </div>
            )}

            {completed && (
                <CardCurso title={"Curso modificado exitosamente"} curso={cursoData}/>
            )}

            {error && (
                <PopUp title={"Error al modificar el curso"} message={error} onClose={() => setError(null)}/>
            )}
        </div>
    )
}