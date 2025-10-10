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


export default function AltaUsuario(second) {
    const [date, setDate] = useState();
    const [form, setForm] = useState({
        tipoUsuario: "",
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
    const [completed, setCompleted] = useState(false);
    const [error, setError] = useState(null);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría la lógica para enviar el formulario
        setCompleted(true);
        setError(null); // O setError("Mensaje de error") si hay un error
    } 

    return(
        <div className="flex min-h-screen items-center justify-center bg-gray-50 mt-4">
            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
                <h1 className="font-bold text-center text-xl mb-6">Alta Usuario</h1>

                <FieldSet>
                <FieldGroup>

                    <Field>
                    <FieldLabel htmlFor="address">Tipo de Usuario</FieldLabel>
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccione una opción" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                <SelectLabel>Operaciones</SelectLabel>
                                <SelectItem value="alta">DNI</SelectItem>
                                <SelectItem value="baja">Pasaporte</SelectItem>
                                <SelectItem value="modificacion">Modificación de Curso</SelectItem>

                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="biblioteca">Nombre/s</FieldLabel>
                        <Input id="nombre" placeholder="Nombre/s" />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="biblioteca">Apellido/s</FieldLabel>
                        <Input id="apellido" placeholder="Apelido/s" />
                    </Field>

                    <Field>

                        <FieldLabel htmlFor="name">Fecha de Nacimiento</FieldLabel>
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
                    <FieldLabel htmlFor="address">Tipo de Documento</FieldLabel>
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccione una opción" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                <SelectLabel>Operaciones</SelectLabel>
                                <SelectItem value="alta">DNI</SelectItem>
                                <SelectItem value="baja">Pasaporte</SelectItem>
                                <SelectItem value="modificacion">Modificación de Curso</SelectItem>

                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="biblioteca">N° Documento</FieldLabel>
                        <Input id="documento" placeholder="Documento" />
                    </Field>

                    

                    <Field>
                        <FieldLabel htmlFor="biblioteca">Correo Electrónico</FieldLabel>
                        <Input id="correo" placeholder="Correo Electronico" />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="biblioteca">Teléfono/Celular</FieldLabel>
                        <Input id="telefono" placeholder="Telefono/Celular" />
                    </Field>

                    
                    <Field>
                        <FieldLabel htmlFor="biblioteca">Dirección</FieldLabel>
                        <Input id="direccion" placeholder="Direccion" />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="biblioteca">Localidad</FieldLabel>
                        <Input id="localidad" placeholder="Localidad" />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="biblioteca">Provincia</FieldLabel>
                        <Input id="provincia" placeholder="Provincia" />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="biblioteca">País de residencia</FieldLabel>
                        <Input id="pais" placeholder="Pais de residencia" />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="biblioteca">Nacionalidad</FieldLabel>
                        <Input id="nacionalidad" placeholder="Nacionalidad" />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="biblioteca">Carrera</FieldLabel>
                        <Input id="carrera" placeholder="Carrera" />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="biblioteca">Fecha de Inscripción</FieldLabel>
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

                    <div className="flex justify-center">
                    <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded mt-4" onClick={handleSubmit}>
                        Guardar
                    </Button>
                    </div>
                </FieldGroup>
                </FieldSet>
            </div>

            {completed && (
                <PopUp title={"Alumno dado de alta exitosamente"} message={"se pasara el objeto alumno"} onClose={() => setCompleted(false)}/>
            )}

            {error && (
                <PopUp title={"Error al dar de alta al alumno"} message={error} onClose={() => setError(null)}/>
            )}
            </div>
    )
}