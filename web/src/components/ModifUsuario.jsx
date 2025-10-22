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
import { modificarUsuario, usuarioPorId } from "@/api/usuariosApi";
import { data } from "react-router-dom";
import CardUsuario from "./CardUsuario";
import { Checkbox } from "./ui/checkbox";

export default function ModifUsuario(second) {
    const [date, setDate] = useState();
    const [form, setForm] = useState({
        tipoUsuario: [],       
        nombre: "",
        apellido: "",
        nroDocumento: "",
        correoElectronico: "",
        telefonoPersonal: "",
        telefonoLaboral: "",
        carrera: "",            
    });

    const [completed, setCompleted] = useState(false);
    const [error, setError] = useState(null);
    const [value, setValue] = useState("");
    const [userData, setUserData]=useState(null)
    const [showForm, setShowForm] = useState(false);
    const [selectedValues, setSelectedValues] = useState([]);
    const options = ["Administrador", "Docente", "Alumno"];

    // Función para agregar o quitar valores en el array de selección
    const toggleValue = (opt) => {
    setSelectedValues((prev) => {
        if (prev.includes(opt)) {
        return prev.filter((v) => v !== opt)
        } else {
        return [...prev, opt]
        }
    })
    }


    const handleSearch = async () => {
        try {
            if (!value.trim()) return
            const response = await usuarioPorId(parseInt(value))
            console.log("Usuario encontrado exitosamente")

            // Inicializamos selectedValues con el tipo de usuario actual
            const tipoArray = Array.isArray(response.tipoUsuario)
            ? response.tipoUsuario
            : [response.tipoUsuario]

            setForm({
            tipoUsuario: response.tipoUsuario,
            nombre: response.nombre,
            apellido: response.apellido,
            nroDocumento: response.nroDocumento,
            correoElectronico: response.correoElectronico,
            telefonoPersonal: response.telefonoPersonal,
            telefonoLaboral: response.telefonoLaboral,
            carrera: response.carrera || "",
            })
            setSelectedValues(tipoArray)
            setUserData(response)
            setShowForm(true)
        } catch (err) {
            setError(err.message)
            setShowForm(false)
        }
        }

    const handleSubmit = async () => {
        try {
            const dataToSend = { ...form, tipoUsuario: selectedValues }
            console.log(dataToSend)
            const response = await modificarUsuario(value, dataToSend)
            console.log("Usuario modificado exitosamente")
            setUserData(response)
            setCompleted(true)
        } catch (err) {
            setError(err.message)
            console.error(err.message)
        }
    }


    const cleanForm = () => {
        setForm({
        tipoUsuario: [],
        nombre: "",
        apellido: "",
        nroDocumento: "",
        correoElectronico: "",
        telefonoPersonal: "",
        telefonoLaboral: "",
        carrera: "",
        });
        setSelectedValues([]);
        setError(null);
        setCompleted(false);
        setUserData(null);
    };

    return(
        <div className="flex min-h-screen min-w-2xl flex-col items-start justify-start">
            <div className="w-full max-w-md p-6">
                <h1 className="font-bold  text-xl mb-4">Modificación de Usuario</h1>
                <span className="block w-full h-[2px] bg-sky-950"></span>

                <h3 className="text-sm mb-2 mt-8">
                Ingrese el legajo del usuario a modificar
                </h3>

                <div className="flex flex-col items-start lg:flex-row gap-4 min-w-xl">
                {/* Input controlado */}
                <Input
                className="lg:mb-4"
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
                </div>
            </div>
            { showForm &&( 
                <div className="w-full max-w-md px-6 my-4">
                    <h1 className="font-bold  text-xl mb-4">Modificación de Usuario</h1>
                    <span className="block w-full h-[2px] bg-sky-950"></span>

                    <FieldSet className="my-8">
                <FieldGroup className="space-y-5">
                    {/* Tipo de usuario */}
                    <Field>
                    <FieldLabel>
                        Tipo de Usuario <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full sm:w-[80%] md:w-[70%] justify-start"
                        >
                            {selectedValues.length > 0
                            ? selectedValues.join(", ")
                            : "Seleccioná tipo(s) de usuario"}
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

                    {/* Datos personales */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field>
                        <FieldLabel>
                        Nombre/s <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                        id="nombre"
                        placeholder="Nombre/s"
                        value={form.nombre}
                        onChange={(e) =>
                            setForm({ ...form, nombre: e.target.value })
                        }
                        />
                    </Field>

                    <Field>
                        <FieldLabel>
                        Apellido/s <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                        id="apellido"
                        placeholder="Apellido/s"
                        value={form.apellido}
                        onChange={(e) =>
                            setForm({ ...form, apellido: e.target.value })
                        }
                        />
                    </Field>
                    </div>

                    <Field>
                    <FieldLabel>
                        N° Documento <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                        id="documento"
                        placeholder="Documento"
                        value={form.nroDocumento}
                        onChange={(e) =>
                        setForm({ ...form, nroDocumento: e.target.value })
                        }
                    />
                    </Field>

                    <Field>
                    <FieldLabel>
                        Correo Electrónico <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                        id="correo"
                        placeholder="Correo Electrónico"
                        value={form.correoElectronico}
                        onChange={(e) =>
                        setForm({
                            ...form,
                            correoElectronico: e.target.value,
                        })
                        }
                    />
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field>
                        <FieldLabel>
                        Teléfono Personal <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                        id="telefonoPersonal"
                        placeholder="Teléfono/Celular"
                        value={form.telefonoPersonal}
                        onChange={(e) =>
                            setForm({
                            ...form,
                            telefonoPersonal: e.target.value,
                            })
                        }
                        />
                    </Field>

                    <Field>
                        <FieldLabel>Teléfono Laboral</FieldLabel>
                        <Input
                        id="telefonoLaboral"
                        placeholder="Teléfono/Celular"
                        value={form.telefonoLaboral}
                        onChange={(e) =>
                            setForm({
                            ...form,
                            telefonoLaboral: e.target.value,
                            })
                        }
                        />
                    </Field>
                    </div>

                    {selectedValues.includes("Alumno") && (
                    <Field>
                        <FieldLabel>Carrera</FieldLabel>
                        <Input
                        id="carrera"
                        placeholder="Carrera"
                        value={form.carrera}
                        onChange={(e) =>
                            setForm({ ...form, carrera: e.target.value })
                        }
                        />
                    </Field>
                    )}

                    {/* Botones */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                    <Button
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md w-full sm:w-auto"
                    >
                        Guardar
                    </Button>
                    <Button
                        type="button"
                        onClick={cleanForm}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-2 rounded-md w-full sm:w-auto"
                    >
                        Cancelar
                    </Button>
                    </div>
                </FieldGroup>
                </FieldSet>
                </div>
            )}

            {completed && (
                <CardUsuario title={"Usuario modificado exitosamente"} user={userData}/>
            )}

            {error && (
                <PopUp title={"Error al modificar la información del usuario"} message={error} onClose={() => setError(null)}/>
            )}
        </div>
    )
}