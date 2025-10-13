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
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"


export default function AltaMateria(second) {
    const [date, setDate] = useState();
    const [completed, setCompleted] = useState(false);
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
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
    
    const handleSubmit = async(e) => {
       try{
            e.preventDefault();
            const response= await fetch('/api/materias', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });
            if(!response.ok){
                throw new Error('Error al dar de alta la materia');
            }
            setCompleted(true);
        } catch (err){
            setError(err.message);  
        }
    } 

    return(
    <div className="flex min-h-screen min-w-2xl  items-center justify-center bg-gray-50 mt-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md">
        <h1 className="font-bold text-center text-2xl mb-8">Alta de Materia</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FieldSet>
            <FieldGroup className="space-y-5">

              <Field>
                <FieldLabel htmlFor="nombre">Nombre de Materia</FieldLabel>
                <Input id="nombre" placeholder="Nombre de Materia" />
              </Field>

              <Field>
                <FieldLabel htmlFor="apellido">Apellido/s</FieldLabel>
                <Input id="apellido" placeholder="Apellido/s" />
              </Field>

              <Field>
                <FieldLabel>Fecha de Nacimiento</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
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
                <FieldLabel>Tipo de Documento</FieldLabel>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="dni">DNI</SelectItem>
                      <SelectItem value="pasaporte">Pasaporte</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>N° Documento</FieldLabel>
                <Input id="documento" placeholder="Documento" />
              </Field>

              <Field>
                <FieldLabel>Correo Electrónico</FieldLabel>
                <Input id="correo" placeholder="Correo Electrónico" />
              </Field>

              <Field>
                <FieldLabel>Teléfono/Celular</FieldLabel>
                <Input id="telefono" placeholder="Teléfono/Celular" />
              </Field>

              <div className="grid grid-cols-2 gap-5">
                <Field>
                  <FieldLabel>Dirección</FieldLabel>
                  <Input id="direccion" placeholder="Dirección" />
                </Field>

                <Field>
                  <FieldLabel>Localidad</FieldLabel>
                  <Input id="localidad" placeholder="Localidad" />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <Field>
                  <FieldLabel>Provincia</FieldLabel>
                  <Input id="provincia" placeholder="Provincia" />
                </Field>

                <Field>
                  <FieldLabel>País de residencia</FieldLabel>
                  <Input id="pais" placeholder="País de residencia" />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <Field>
                  <FieldLabel>Nacionalidad</FieldLabel>
                  <Input id="nacionalidad" placeholder="Nacionalidad" />
                </Field>

                <Field>
                  <FieldLabel>Carrera</FieldLabel>
                  <Input id="carrera" placeholder="Carrera" />
                </Field>
              </div>

              <Field>
                <FieldLabel>Fecha de Inscripción</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
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
                    <FieldLabel htmlFor="correlativa">¿Es correlativa?</FieldLabel>
                    <RadioGroup className="flex flex-row gap-4" defaultValue="no" id="correlativa">
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="si" id="correlativa-si" />
                        <label htmlFor="correlativa-si">Sí</label>
                        </div>
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="correlativa-no" />
                        <label htmlFor="correlativa-no">No</label>
                        </div>
                    </RadioGroup>
                    </Field>

              <div className="flex justify-center pt-4">
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
      </div>

      {completed && (
        <PopUp
          title="Usuario dado de alta exitosamente"
          message="Se pasará el objeto usuario."
          onClose={() => setCompleted(false)}
        />
      )}

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