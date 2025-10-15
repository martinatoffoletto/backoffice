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
import { materiaPorId, modificarMateria } from "@/api/materiasApi";

export default function ModifMateria(second) {
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
    const [searchError, setSearchError] = useState(null);
    const [addError, setAddError] = useState(null);
    const [value, setValue] = useState("");
    const [showForm, setShowForm] = useState(false);

    const handleSearch = async() => {
        try{
            if(!value.trim()) return;
            const response = await materiaPorId(value)
            console.log("materia encontrado exitosamente")
            setShowForm(true);
        }catch(err){
            setError(err.message);
            setShowForm(false);
        }
    };
    const handleSubmit = async(e) => {
        e.preventDefault();
        try{            
            const response = await modificarMateria(value, form)
            console.log("materia modificada exitosamente")
            setUserData(response)
            setCompleted(true);
        }catch(err){
            setError(err.message);
            console.error(err.message)
        }

    } 

    return(
        <div className="flex min-h-screen min-w-2xl flex-col items-center justify-start bg-gray-50 my-4">
            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
                <h1 className="font-bold text-center text-xl mb-6">Modificación de Materia</h1>
                <h3 className="text-sm mb-2">
                Ingrese el numero de materia a modificar
                </h3>

                {/* Input controlado */}
                <Input
                className="mb-4"
                placeholder="Legajo"
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
                {searchError && <p className="text-red-500 mt-2">{searchError}</p>}
            </div>
            { showForm &&( 
                <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md my-4">
                    <h1 className="font-bold text-center text-xl mb-6">Modificación de Materia</h1>

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
                                    <SelectLabel>Opciones</SelectLabel>
                                    <SelectItem value="alumno">Alumno</SelectItem>
                                    <SelectItem value="docente">Docente</SelectItem>
                                    
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
                        <Button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded mt-4 ml-4" onClick={() => setShowForm(false)}>
                            Cancelar
                        </Button>
                        </div>
                    </FieldGroup>
                    </FieldSet>
                </div>
            )}

            {completed && (
                <PopUp title={"Información modificada exitosamente"} onClose={() => setCompleted(false)}/>
            )}
            {addError && (
                <PopUp title="Error" message={addError} onClose={() => setAddError(null)} />
            )}

            
        </div>
    )
}