import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select.jsx";
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import PopUp from "@/components/PopUp";
import CardCurso from "@/components/CardCurso";
import { cursoPorId, modificarCurso } from "@/api/cursosApi";
import { obtenerMaterias } from "@/api/materiasApi";
import { obtenerSedes } from "@/api/sedesApi";

export default function ModifCurso({ cursoInicial = null }) {
  const [value, setValue] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    uuid_materia: "",
    examen: "",
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
  });
  const [filteredSedes, setFilteredSedes] = useState([]);
  const [filteredMaterias, setFilteredMaterias] = useState([]);
  const [cursoData, setCursoData] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(null);

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

  // Si se proporciona un curso inicial, cargarlo automáticamente
  useEffect(() => {
    if (cursoInicial) {
      const curso_id = cursoInicial.id_curso || cursoInicial.id;
      setValue(curso_id);
      setForm({
        uuid_materia: cursoInicial.uuid_materia || "",
        examen: cursoInicial.examen || "",
        comision: cursoInicial.comision || "",
        modalidad: cursoInicial.modalidad || "",
        sede: cursoInicial.sede || "",
        aula: cursoInicial.aula || "",
        horario: cursoInicial.horario || "",
        dia: cursoInicial.dia || "",
        turno: cursoInicial.turno || "",
        periodo: cursoInicial.periodo || "",
        fecha_inicio: cursoInicial.fecha_inicio || "",
        fecha_fin: cursoInicial.fecha_fin || "",
        capacidad_max: cursoInicial.capacidad_max || 0,
        capacidad_min: cursoInicial.capacidad_min || 0,
      });
      setShowForm(true);
    }
  }, [cursoInicial]);

  const handleSearch = async () => {
    try {
      if (!value.trim()) return;
      const response = await cursoPorId(value);
      setForm({
        uuid_materia: response.uuid_materia,
        examen: response.examen,
        comision: response.comision,
        modalidad: response.modalidad,
        sede: response.sede,
        aula: response.aula,
        dia: response.dia,
        turno:response.turno,
        periodo: response.periodo,
        fecha_inicio: response.fecha_inicio,
        fecha_fin: response.fecha_fin,
        capacidad_max: response.capacidad_max,
        capacidad_min: response.capacidad_min,
      });
      setShowForm(true);
    } catch (err) {
      setError(err.message);
      setShowForm(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await modificarCurso(value, form);
      setCursoData(response);
      setValue("")
      setShowForm(false)
      setCompleted(true);

    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Búsqueda de curso */}
      {!showForm && (
        <div className="w-full max-w-2xl p-6">
          <h1 className="font-bold text-center text-2xl mb-4">Modificar Curso</h1>
          <span className="block w-full h-[3px] bg-sky-950 mb-4"></span>
          <div className="flex flex-col items-center lg:flex-row gap-4 justify-center">
            <Input
            
                placeholder="Número de Curso"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <Button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold "
                onClick={handleSearch}
                disabled={!value.trim()}
            >
                Buscar
            </Button>
          </div>
         
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div className="w-full max-w-2xl p-6">
          <h1 className="font-bold text-center text-2xl mb-4">Modificar Curso</h1>
           <span className="block w-full h-[3px] bg-sky-950 mb-4"></span>
          <FieldSet className="my-6">
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <FieldLabel>Modalidad</FieldLabel>
                <Select
                  value={form.modalidad}
                  onValueChange={(val) => setForm((prev) => ({ ...prev, modalidad: val }))}
                >
                  <SelectTrigger className="w-full">
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
                <FieldLabel>Sede</FieldLabel>
                <Select
                  value={form.sede}
                  onValueChange={(val) => setForm((prev) => ({ ...prev, sede: val }))}
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
                  onValueChange={(val) => setForm((prev) => ({ ...prev, uuid_materia: val }))}
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

              {/* Comision */}
              <Field>
                <FieldLabel>Comisión</FieldLabel>
                <Input
                  placeholder="Comisión"
                  value={form.comision}
                  onChange={(e) => setForm((prev) => ({ ...prev, comision: e.target.value }))}
                />
              </Field>

              {/* Aula */}
              <Field>
                <FieldLabel>Aula</FieldLabel>
                <Input
                  placeholder="Aula"
                  value={form.aula}
                  onChange={(e) => setForm((prev) => ({ ...prev, aula: e.target.value }))}
                />
              </Field>

              {/* Horario */}
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

              {/* Periodo */}
              <Field>
                <FieldLabel>Período</FieldLabel>
                <Select
                  value={form.periodo}
                  onValueChange={(val) => setForm((prev) => ({ ...prev, periodo: val }))}
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

              {/* Fecha Inicio */}
              <Field>
                <FieldLabel>Fecha Inicio</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full text-left">
                      {form.fecha_inicio
                        ? new Date(form.fecha_inicio).toLocaleDateString()
                        : "Seleccione una fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={form.fecha_inicio ? new Date(form.fecha_inicio) : undefined}
                      onSelect={(date) => setForm((prev) => ({ ...prev, fecha_inicio: date }))}
                    />
                  </PopoverContent>
                </Popover>
              </Field>

              {/* Fecha Fin */}
              <Field>
                <FieldLabel>Fecha Fin</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full text-left">
                      {form.fecha_fin
                        ? new Date(form.fecha_fin).toLocaleDateString()
                        : "Seleccione una fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={form.fecha_fin ? new Date(form.fecha_fin) : undefined}
                      onSelect={(date) => setForm((prev) => ({ ...prev, fecha_fin: date }))}
                    />
                  </PopoverContent>
                </Popover>
              </Field>

              {/* Capacidad Max */}
              <Field>
                <FieldLabel>Capacidad Máxima</FieldLabel>
                <Input
                  type="number"
                  value={form.capacidad_max}
                  onChange={(e) => setForm((prev) => ({ ...prev, capacidad_max: parseInt(e.target.value) }))}
                />
              </Field>

              {/* Capacidad Min */}
              <Field>
                <FieldLabel>Capacidad Mínima</FieldLabel>
                <Input
                  type="number"
                  value={form.capacidad_min}
                  onChange={(e) => setForm((prev) => ({ ...prev, capacidad_min: parseInt(e.target.value) }))}
                />
              </Field>

            </FieldGroup>
          </FieldSet>

          <div className="flex justify-center mt-4 gap-4">
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md"
            >
              Guardar
            </Button>
          </div>
        </div>
      )}

      {/* PopUp de éxito */}
      {completed && (
        <div className="w-full max-w-2xl p-6">
          <div className="flex flex-col justify-center items-center border border-green-500 p-4 rounded-md shadow-sm gap-4 bg-white">
            <CardCurso title={"Curso modificado exitosamente"} curso={cursoData} />
            <Button
              onClick={() => setCompleted(false)}
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-md"
            >
              OK
            </Button>
          </div>
        </div>
      )}

      {error && (
        <PopUp title={"Error al modificar el curso"} message={error} onClose={() => setError(null)} />
      )}
    </div>
  );
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
