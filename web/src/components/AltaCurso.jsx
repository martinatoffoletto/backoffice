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
import { useState , useEffect} from "react";
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
import { obtenerMaterias } from "@/api/materiasApi";
import { obtenerSedes } from "@/api/sedesApi";

export default function AltaCurso(second) {
    const [date, setDate] = useState();
    const [form, setForm] = useState({
        id_curso: "",
        uuid_materia: "",
        comision: "",
        modalidad: "",
        sede: "",
        aula: "",
        horario: "",
        periodo: "",
        fecha_inicio: "",
        fecha_fin: "",
        capacidad_max: 0,
        capacidad_min: 0,
        fecha_creacion: "",
    });
    const [showPopUp, setShowPopUp] = useState(false);
    const [completed, setCompleted]=useState(false)
    const [filteredSedes, setFilteredSedes] = useState([]);
    const [filteredMaterias, setFilteredMaterias] = useState([]);
    const [error, setError] = useState(null);
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);
    const [cursoData, setCursoData]=useState(null)
    
    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const response= await altaCurso(form)
            console.log("Curso dado de alta exitosamente")
            setCursoData(response)
            setCompleted(true)
            setShowPopUp(true)
        }catch(err){
            console.error(`Error al dar de alta el curso: ${err.message}`)
            setError(err.message)
        }
    } 

      useEffect(() => {
        const fetchData = async () => {
        try {
            const sedes = await obtenerSedes();
            const materias = await obtenerMaterias();
            setFilteredSedes(sedes);
            setFilteredMaterias(materias);
        } catch (err) {
            console.error(err);
        }
        };
        fetchData();
    }, []);

    return(
        <div className="flex min-h-screen min-w-3xl  items-center justify-start ">
           { !completed && ( 
            <div className="w-full max-w-md md:max-w-2xl p-6 ">
                <h1 className="font-bold text-xl mb-4">Alta Curso</h1>
                <span className="block w-full h-[3px] bg-sky-950"></span>


                <FieldSet className="my-4">
                    <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Modalidad */}
                    <Field>
                        <FieldLabel>Modalidad</FieldLabel>
                        <Select
                        value={form.modalidad}
                        onValueChange={(value) => setForm((prev) => ({ ...prev, modalidad: value }))}
                        >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccione modalidad" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>Modalidad</SelectLabel>
                            <SelectItem value="Presencial">Presencial</SelectItem>
                            <SelectItem value="Virtual">Virtual</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                        </Select>
                    </Field>

                    {/* Sede */}
                    <Field>
                        <FieldLabel>Sede</FieldLabel>
                        <Select
                        value={form.sede}
                        onValueChange={(value) => setForm((prev) => ({ ...prev, sede: value }))}
                        >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccione sede" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>Sedes</SelectLabel>
                            {filteredSedes.map((sede) => (
                                <SelectItem key={sede.id} value={sede.id}>
                                {sede.nombre}
                                </SelectItem>
                            ))}
                            </SelectGroup>
                        </SelectContent>
                        </Select>
                    </Field>

                    {/* Materia */}
                    <Field>
                        <FieldLabel>Materia</FieldLabel>
                        <Select
                        value={form.uuid_materia}
                        onValueChange={(value) => setForm((prev) => ({ ...prev, uuid_materia: value }))}
                        >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccione materia" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>Materias</SelectLabel>
                            {filteredMaterias.map((materia) => (
                                <SelectItem key={materia.id_materia} value={materia.id_materia}>
                                {materia.nombre}
                                </SelectItem>
                            ))}
                            </SelectGroup>
                        </SelectContent>
                        </Select>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="comision">Comisión</FieldLabel>
                        <Input
                        id="comision"
                        placeholder="Comisión"
                        value={form.comision}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, comision: e.target.value }))
                        }
                        />
                    </Field>

                    

                    <Field>
                        <FieldLabel htmlFor="aula">Aula</FieldLabel>
                        <Input
                        id="aula"
                        placeholder="Aula"
                        value={form.aula}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, aula: e.target.value }))
                        }
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="horario">Horario</FieldLabel>
                        <Input
                        id="horario"
                        placeholder="Ej: Lunes 8-10"
                        value={form.horario}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, horario: e.target.value }))
                        }
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="periodo">Período</FieldLabel>
                        <Input
                        id="periodo"
                        placeholder="Ej: 1er Cuatrimestre"
                        value={form.periodo}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, periodo: e.target.value }))
                        }
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="fecha_inicio">Fecha Inicio</FieldLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full text-left"
                            >
                                {form.fecha_inicio
                                ? new Date(form.fecha_inicio).toLocaleDateString()
                                : "Seleccione una fecha"}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={form.fecha_inicio ? new Date(form.fecha_inicio) : undefined}
                               onSelect={(date) => {
                                setFechaInicio(date);
                                setForm((prev) => ({ ...prev, fecha_inicio: date }));
                                }}
                            />
                            </PopoverContent>
                        </Popover>
                        </Field>

                        <Field>
                        <FieldLabel htmlFor="fecha_fin">Fecha Fin</FieldLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full text-left"
                            >
                                {form.fecha_fin
                                ? new Date(form.fecha_fin).toLocaleDateString()
                                : "Seleccione una fecha"}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={form.fecha_fin ? new Date(form.fecha_fin) : undefined}
                                onSelect={(date) => {
                                    setFechaFin(date);
                                    setForm((prev) => ({ ...prev, fecha_fin: date }));
                                }}
                            />
                            </PopoverContent>
                        </Popover>
                        </Field>


                    <Field>
                        <FieldLabel htmlFor="capacidad_max">Capacidad Máxima</FieldLabel>
                        <Input
                        type="number"
                        id="capacidad_max"
                        value={form.capacidad_max}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, capacidad_max: parseInt(e.target.value) }))
                        }
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="capacidad_min">Capacidad Mínima</FieldLabel>
                        <Input
                        type="number"
                        id="capacidad_min"
                        value={form.capacidad_min}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, capacidad_min: parseInt(e.target.value) }))
                        }
                        />
                    </Field>

                    </FieldGroup>
                </FieldSet>

          <div className="flex justify-end mt-4 gap-4">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md"
              onClick={handleSubmit}
            >
              Guardar
            </Button>
          </div>
            </div>)}

            {showPopUp && (
               <div className="flex flex-col justify-center items-center border border-green-500 p-4 rounded-md shadow-sm gap-4 w-full max-w-md mx-auto my-4 bg-white">
                                   <CardCurso title={"Curso dado de alta exitosamente"} curso={cursoData} />
                                   <Button
                                   onClick={() => {setShowPopUp(false);  }}
                                   className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-md"
                                   >
                                   OK
                                   </Button>
                               </div>
            )}

 
            {error && (
                <PopUp title={"Error al dar de alta el curso"} message={error} onClose={() => setError(null)}/>
            )}
            </div>
    )
}