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
        examen: "",
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
        status:"activo",
    });
    const [showPopUp, setShowPopUp] = useState(false);
    const [completed, setCompleted]=useState(false)
    const [filteredSedes, setFilteredSedes] = useState([]);
    const [filteredMaterias, setFilteredMaterias] = useState([]);
    const [error, setError] = useState(null);
    const [cursoData, setCursoData]=useState(null)
    const [showGestionClases, setShowGestionClases] = useState(false)
    const [camposConError, setCamposConError] = useState(new Set())
    
    const handleSubmit = async(e) => {
        e.preventDefault();
        
        // Validar campos obligatorios
        const camposObligatorios = {
            modalidad: form.modalidad,
            sede: form.sede,
            uuid_materia: form.uuid_materia,
            comision: form.comision,
            dia: form.dia,
            periodo: form.periodo,
            fecha_inicio: form.fecha_inicio,
            fecha_fin: form.fecha_fin,
            examen: form.examen,
        };
        
        const camposFaltantes = Object.entries(camposObligatorios)
            .filter(([, value]) => !value || (typeof value === 'string' && value.trim() === ''))
            .map(([campo]) => campo);
        
        const erroresFechas = [];
        // Validar que fecha fin sea posterior o igual a fecha inicio
        if (form.fecha_inicio && form.fecha_fin) {
            const fechaInicio = new Date(form.fecha_inicio);
            const fechaFin = new Date(form.fecha_fin);
            // Normalizar a medianoche para comparar solo fechas (sin hora)
            fechaInicio.setHours(0, 0, 0, 0);
            fechaFin.setHours(0, 0, 0, 0);
            
            if (fechaFin < fechaInicio) {
                erroresFechas.push('fecha_fin');
            }
        }
        
        // Combinar todos los campos con error
        const todosLosErrores = new Set([...camposFaltantes, ...erroresFechas]);
        
        if (todosLosErrores.size > 0) {
            setCamposConError(todosLosErrores);
            
            const nombres = {
                modalidad: 'Modalidad',
                examen: 'Examen',
                sede: 'Sede',
                uuid_materia: 'Materia',
                comision: 'Comisión',
                dia: 'Día de cursada',
                periodo: 'Período',
                fecha_inicio: 'Fecha Inicio',
                fecha_fin: 'Fecha Fin',
            };
            
            const mensajesError = [];
            if (camposFaltantes.length > 0) {
                mensajesError.push(`Campos obligatorios faltantes: ${camposFaltantes.map(c => nombres[c] || c).join(', ')}`);
            }
            if (erroresFechas.length > 0) {
                mensajesError.push("La fecha fin debe ser posterior o igual a la fecha inicio");
            }
            
            setError(mensajesError.join('. '));
            return;
        }
        
        // Si no hay errores, limpiar los campos con error
        setCamposConError(new Set());
        
        try{
            const nuevo_curso = await altaCurso(form)
            console.log("Curso dado de alta exitosamente")
            setCursoData(nuevo_curso)
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
            // Asegurar que sean arrays
            setFilteredSedes(Array.isArray(sedes) ? sedes : []);
            setFilteredMaterias(Array.isArray(materias) ? materias : []);
        } catch (err) {
            console.error(err);
            // En caso de error, asegurar arrays vacíos
            setFilteredSedes([]);
            setFilteredMaterias([]);
        }
        };
        fetchData();
    }, []);
            
    return(
        <div className="w-full flex flex-col items-center">
           {!completed && ( 
            <div className="w-full max-w-2xl p-6">
                <h1 className="font-bold text-center text-2xl mb-4">Alta Curso</h1>
                <span className="block w-full h-[3px] bg-sky-950 mb-4"></span>


                <FieldSet className="my-4 mt-8">
                    <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                    {/* Examen */}
                    <Field>
                        <FieldLabel htmlFor="examen">Examen</FieldLabel>
                        <Input
                        id="examen"
                        placeholder="Examen"
                        value={form.examen}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, examen: e.target.value }))
                        }
                        />
                    </Field>

                    {/* Modalidad */}
                    <Field>
                        <FieldLabel>Modalidad <span className="text-red-500">*</span></FieldLabel>
                        <Select
                        value={form.modalidad}
                        onValueChange={(value) => {
                            setForm((prev) => ({ ...prev, modalidad: value }));
                            // Limpiar error del campo cuando se modifica
                            if (camposConError.has('modalidad')) {
                                const nuevosErrores = new Set(camposConError);
                                nuevosErrores.delete('modalidad');
                                setCamposConError(nuevosErrores);
                                if (nuevosErrores.size === 0) setError(null);
                            }
                        }}
                        >
                        <SelectTrigger className={`w-full ${camposConError.has('modalidad') ? 'ring-2 ring-orange-500 ring-offset-2' : ''}`}>
                            <SelectValue placeholder="Seleccione modalidad" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>Modalidad</SelectLabel>
                            <SelectItem value="Presencial">Presencial</SelectItem>
                            <SelectItem value="Virtual">Virtual</SelectItem>
                            <SelectItem value="Hibrida">Híbrida</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                        </Select>
                    </Field>

                    {/* Sede */}
                    <Field>
                        <FieldLabel>Sede <span className="text-red-500">*</span></FieldLabel>
                        <Select
                        value={form.sede}
                        onValueChange={(value) => {
                            setForm((prev) => ({ ...prev, sede: value }));
                            // Limpiar error del campo cuando se modifica
                            if (camposConError.has('sede')) {
                                const nuevosErrores = new Set(camposConError);
                                nuevosErrores.delete('sede');
                                setCamposConError(nuevosErrores);
                                if (nuevosErrores.size === 0) setError(null);
                            }
                        }}
                        >
                        <SelectTrigger className={`w-full ${camposConError.has('sede') ? 'ring-2 ring-orange-500 ring-offset-2' : ''}`}>
                            <SelectValue placeholder="Seleccione sede" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>Sedes</SelectLabel>
                            {filteredSedes && filteredSedes.length > 0 ? (
                                
                                filteredSedes.map((sede) => (
                                    <SelectItem key={sede.id} value={sede.id}>
                                    {sede.nombre}
                                    </SelectItem>
                                ))
                                ) : (
                                <p className="text-sm text-gray-400 px-2">No hay sedes disponibles</p>
                            )}
                            </SelectGroup>
                        </SelectContent>
                        </Select>
                    </Field>

                    {/* Materia */}
                    <Field>
                        <FieldLabel>Materia <span className="text-red-500">*</span></FieldLabel>
                        <Select
                        value={form.uuid_materia}
                        onValueChange={(value) => {
                            setForm((prev) => ({ ...prev, uuid_materia: value }));
                            // Limpiar error del campo cuando se modifica
                            if (camposConError.has('uuid_materia')) {
                                const nuevosErrores = new Set(camposConError);
                                nuevosErrores.delete('uuid_materia');
                                setCamposConError(nuevosErrores);
                                if (nuevosErrores.size === 0) setError(null);
                            }
                        }}
                        >
                        <SelectTrigger className={`w-full ${camposConError.has('uuid_materia') ? 'ring-2 ring-orange-500 ring-offset-2' : ''}`}>
                            <SelectValue placeholder="Seleccione materia" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>Materias</SelectLabel>
                            {filteredMaterias.map((materia) => (
                                <SelectItem key={materia.id_materia || materia.uuid_materia || materia.id} value={materia.id_materia || materia.uuid_materia || materia.id}>
                                {materia.nombre}
                                </SelectItem>
                            ))}
                            </SelectGroup>
                        </SelectContent>
                        </Select>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="comision">Comisión <span className="text-red-500">*</span></FieldLabel>
                        <Input
                        id="comision"
                        placeholder="Comisión"
                        value={form.comision}
                        onChange={(e) => {
                            setForm((prev) => ({ ...prev, comision: e.target.value }));
                            // Limpiar error del campo cuando se modifica
                            if (camposConError.has('comision')) {
                                const nuevosErrores = new Set(camposConError);
                                nuevosErrores.delete('comision');
                                setCamposConError(nuevosErrores);
                                if (nuevosErrores.size === 0) setError(null);
                            }
                        }}
                        className={camposConError.has('comision') ? 'ring-2 ring-orange-500 ring-offset-2' : ''}
                        required
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
                        <div className={camposConError.has('dia') ? 'ring-2 ring-orange-500 ring-offset-2 rounded-md p-2' : ''}>
                            <RadioGroupField
                            label="Día de cursada *"
                            value={form.dia}
                            options={[{ label: "Lunes", value: "lunes" }, { label: "Martes", value: "martes" }, { label: "Miércoles", value: "miercoles" }, { label: "Jueves", value: "jueves" }, { label: "Viernes", value: "viernes" }]}
                            onChange={(v) => {
                                setForm({ ...form, dia: v });
                                // Limpiar error del campo cuando se modifica
                                if (camposConError.has('dia')) {
                                    const nuevosErrores = new Set(camposConError);
                                    nuevosErrores.delete('dia');
                                    setCamposConError(nuevosErrores);
                                    if (nuevosErrores.size === 0) setError(null);
                                }
                            }}/>
                        </div>
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
                        <FieldLabel>Período <span className="text-red-500">*</span></FieldLabel>
                        <Select
                        value={form.periodo}
                        onValueChange={(value) => {
                            setForm((prev) => ({ ...prev, periodo: value }));
                            // Limpiar error del campo cuando se modifica
                            if (camposConError.has('periodo')) {
                                const nuevosErrores = new Set(camposConError);
                                nuevosErrores.delete('periodo');
                                setCamposConError(nuevosErrores);
                                if (nuevosErrores.size === 0) setError(null);
                            }
                        }}
                        >
                        <SelectTrigger className={`w-full ${camposConError.has('periodo') ? 'ring-2 ring-orange-500 ring-offset-2' : ''}`}>
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
                        <FieldLabel htmlFor="fecha_inicio">Fecha Inicio <span className="text-red-500">*</span></FieldLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={`w-full text-left ${camposConError.has('fecha_inicio') ? 'ring-2 ring-orange-500 ring-offset-2' : ''}`}
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
                                setForm((prev) => {
                                    const nuevoForm = { ...prev, fecha_inicio: date };
                                    // Limpiar error del campo cuando se modifica
                                    if (camposConError.has('fecha_inicio')) {
                                        const nuevosErrores = new Set(camposConError);
                                        nuevosErrores.delete('fecha_inicio');
                                        setCamposConError(nuevosErrores);
                                        if (nuevosErrores.size === 0) setError(null);
                                    }
                                    return nuevoForm;
                                });
                                }}
                            />
                            </PopoverContent>
                        </Popover>
                        </Field>

                        <Field>
                        <FieldLabel htmlFor="fecha_fin">Fecha Fin <span className="text-red-500">*</span></FieldLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={`w-full text-left ${camposConError.has('fecha_fin') ? 'ring-2 ring-orange-500 ring-offset-2' : ''}`}
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
                                    setForm((prev) => {
                                        const nuevoForm = { ...prev, fecha_fin: date };
                                        // Limpiar error del campo cuando se modifica
                                        if (camposConError.has('fecha_fin')) {
                                            const nuevosErrores = new Set(camposConError);
                                            nuevosErrores.delete('fecha_fin');
                                            setCamposConError(nuevosErrores);
                                            if (nuevosErrores.size === 0) setError(null);
                                        }
                                        return nuevoForm;
                                    });
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

          <div className="flex justify-center mt-4 gap-4">
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
                                   filteredMaterias.find(m => 
                                       (m.uuid_materia === cursoData.uuid_materia) || 
                                       (m.id_materia === cursoData.uuid_materia) ||
                                       (m.id === cursoData.uuid_materia)
                                   )?.nombre || cursoData.uuid_materia || "N/A"
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
                           onClick={() => {
                               setShowPopUp(false);
                               setShowGestionClases(true);
                           }}
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
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="bg-white p-6 rounded-lg shadow-xl border-2 border-red-500 w-96 max-w-md mx-4 pointer-events-auto">
                        <h2 className="text-xl font-bold mb-4 text-red-600">Error al dar de alta el curso</h2>
                        <p className="mb-6 text-gray-700">{error}</p>
                        <div className="flex justify-end">
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                                onClick={() => {
                                    setError(null);
                                    setCamposConError(new Set());
                                }}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
    )
}

function RadioGroupField({ label, value, options, onChange }) {
  return (
    <div className="flex-1 flex flex-col">
      <span className="text-sm font-medium mb-1">
        {label.includes('*') ? (
          <>
            {label.replace('*', '')} <span className="text-red-500">*</span>
          </>
        ) : (
          label
        )}
      </span>
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