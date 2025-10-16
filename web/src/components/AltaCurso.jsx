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
import { altaCurso } from "@/api/cursosApi";
import CardCurso from "@/components/CardCurso";


export default function AltaCurso(second) {
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
    const [showPopUp, setShowPopUp] = useState(false);
    const [completed, setCompleted]=useState(false)
    const [error, setError] = useState(null);
    const [cursoData, setCursoData]=useState(null)
    
    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const response= await altaCurso(form)
            console.log("Curso dado de alta exitosamente")
            setCursoData(response)
            setShowPopUp(true)
        }catch(err){
            console.error(`Error al dar de alta el curso: ${err.message}`)
            setError(err.message)
        }
    } 

    return(
        <div className="flex min-h-screen min-w-2xl  items-center justify-start ">
           { !completed && ( 
            <div className="w-full max-w-md p-6 ">
                <h1 className="font-bold text-xl mb-4">Alta Curso</h1>
                <span className="block w-full h-[3px] bg-sky-950"></span>


                <FieldSet className={"mt-8"}>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="name">Fecha Inicio</FieldLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button className="w-full bg-blue-500 hover:bg-blue-700">
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
                    <div className="flex justify-start">
                    <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded mt-4" onClick={handleSubmit}>
                        Guardar
                    </Button>
                    </div>
                </FieldGroup>
                </FieldSet>
            </div>)}

            {showPopUp && (
                <PopUp title={"Curso dado de alta exitosamente"} message={"se pasara el objeto curso"} onClose={() => setShowPopUp(false)}/>
            )}

            {completed && (
                <CardCurso title={"El curso se ha dado de alta exitosamente"} curso={cursoData}/>
            )
            }
        

            {error && (
                <PopUp title={"Error al dar de alta el curso"} message={error} onClose={() => setError(null)}/>
            )}
            </div>
    )
}