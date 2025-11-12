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
import PopUp from "@/components/PopUp";
import { altaCurso } from "@/api/cursosApi";
import CardCurso from "@/components/CardCurso";
import { obtenerMaterias } from "@/api/materiasApi";
import { obtenerSedes } from "@/api/sedesApi";
import GestionClases from "@/components/GestionClases";

export default function AltaCurso() {
    const [form, setForm] = useState({
        id_curso: "",
        uuid_materia: "",
        comision: "",
        modalidad: "",
        sede: "",
        aula: "",
        dia:"",
        turno: "",
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
    const [cursoData, setCursoData]=useState(null)
    const [showGestionClases, setShowGestionClases] = useState(false)
    
    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const nuevo_curso = await altaCurso(form)
            console.log("Curso dado de alta exitosamente")
            setCursoData(nuevo_curso)
            setCompleted(true)
            setShowPopUp(true)
            setShowGestionClases(true)
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
                                <SelectItem key={sede.id_sede || sede.id} value={sede.nombre}>
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
                        <RadioGroupField
                        label="Día de cursada"
                        value={form.dia}
                        options={[{ label: "Lunes", value: "lunes" }, { label: "Martes", value: "martes" }, { label: "Miércoles", value: "miercoles" }, { label: "Jueves", value: "jueves" }, { label: "Viernes", value: "viernes" }]}
                        onChange={(v) => setForm({ ...form, dia: v })}/>
                    </Field>
                    <Field>
                        <FieldLabel>Turno</FieldLabel>
                        <Select
                        value={form.turno}
                        onValueChange={(value) => setForm((prev) => ({ ...prev, turno: value }))}
                        >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccione turno" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>Materias</SelectLabel>
                          
                                <SelectItem  value="Mañana">
                                Mañana
                                </SelectItem>
                                <SelectItem value="Tarde">
                                Tarde
                                </SelectItem>
                                <SelectItem  value="Noche">
                                Noche
                                </SelectItem>
                         
                            </SelectGroup>
                        </SelectContent>
                        </Select>
                    </Field>


                    <Field>
                        <FieldLabel>Período</FieldLabel>
                        <Select
                        value={form.periodo}
                        onValueChange={(value) => setForm((prev) => ({ ...prev, periodo: value }))}
                        >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccione período" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>Períodos</SelectLabel>
                            <SelectItem value="1er Cuatrimestre">1er Cuatrimestre</SelectItem>
                            <SelectItem value="2do Cuatrimestre">2do Cuatrimestre</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                        </Select>
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

            {showPopUp && cursoData && (
               <div className="fixed inset-0 flex items-center justify-center z-50">
                   <div className="flex flex-col justify-center items-center border-2 border-green-500 p-6 rounded-lg shadow-xl gap-4 w-full max-w-md bg-white mx-4">
                       <h2 className="text-xl font-bold text-green-600">Curso dado de alta exitosamente</h2>
                       <div className="w-full space-y-2 text-left">
                           <p className="text-gray-700">
                               <span className="font-semibold">Materia:</span> {
                                   filteredMaterias.find(m => m.uuid_materia === cursoData.uuid_materia)?.nombre || cursoData.uuid_materia
                               }
                           </p>
                           <p className="text-gray-700">
                               <span className="font-semibold">Día:</span> {
                                   (cursoData.dia || form.dia) ? 
                                   (cursoData.dia || form.dia).charAt(0).toUpperCase() + (cursoData.dia || form.dia).slice(1).toLowerCase() 
                                   : ''
                               }
                           </p>
                           <p className="text-gray-700">
                               <span className="font-semibold">Turno:</span> {
                                   (cursoData.turno || form.turno) ? 
                                   (cursoData.turno || form.turno).charAt(0).toUpperCase() + (cursoData.turno || form.turno).slice(1).toLowerCase() 
                                   : ''
                               }
                           </p>
                       </div>
                       <Button
                           onClick={() => {setShowPopUp(false);  }}
                           className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-md"
                       >
                           OK
                       </Button>
                   </div>
               </div>
            )}

            {showGestionClases && cursoData && (
                <div className="w-full max-w-4xl mt-6">
                    <GestionClases 
                        id_curso={cursoData.id_curso || cursoData.id}
                        fecha_inicio={cursoData.fecha_inicio}
                        fecha_fin={cursoData.fecha_fin}
                        dia={cursoData.dia}
                        turno={cursoData.turno}
                    />
                </div>
            )}

 
            {error && (
                <PopUp title={"Error al dar de alta el curso"} message={error} onClose={() => setError(null)}/>
            )}
            </div>
    )
}

function RadioGroupField({ label, value, options, onChange }) {
  return (
    <div className="flex-1 flex flex-col">
      <span className="text-sm font-medium mb-1">{label}</span>
      <div className="flex flex-wrap gap-4">
        {options.map(opt => (
          <label key={opt.value} className="flex items-center gap-1">
            <input
              type="radio"
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}