import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
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
import PopUp from "@/components/PopUp";
import CardCurso from "@/components/CardCurso";
import { cursoPorId, modificarCurso } from "@/api/cursosApi";
import { obtenerMaterias } from "@/api/materiasApi";
import { obtenerSedes } from "@/api/sedesApi";
import FormCurso from "@/components/FormCurso";

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
    dia: "",
    turno: "",
    periodo: "",
    desde: "",
    hasta: "",
    cantidad_max: 0,
    cantidad_min: 0,
    estado: "activo",
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
        dia: cursoInicial.dia || "",
        turno: cursoInicial.turno || "",
        periodo: cursoInicial.periodo || "",
        desde: cursoInicial.fecha_inicio || "",
        hasta: cursoInicial.fecha_fin || "",
        cantidad_max: cursoInicial.capacidad_max || 0,
        cantidad_min: cursoInicial.capacidad_min || 0,
        estado: cursoInicial.status || "activo",
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
        turno: response.turno,
        periodo: response.periodo,
        desde: response.fecha_inicio,
        hasta: response.fecha_fin,
        cantidad_max: response.capacidad_max,
        cantidad_min: response.capacidad_min,
        estado: response.status || "activo",
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
      // Map FormCurso fields to API fields
      const cursoData = {
        ...form,
        fecha_inicio: form.desde,
        fecha_fin: form.hasta,
        capacidad_max: form.cantidad_max,
        capacidad_min: form.cantidad_min,
        status: form.estado,
      };
      const response = await modificarCurso(value, cursoData);
      setCursoData(response);
      setValue("");
      setShowForm(false);
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
        <div className="w-full max-w-6xl p-6">
          <h1 className="font-bold text-center text-2xl mb-4">
            Modificar Curso
          </h1>
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
        <div className="w-full max-w-6xl p-6">
          <h1 className="font-bold text-center text-2xl mb-4">
            Modificar Curso
          </h1>
          <span className="block w-full h-[3px] bg-sky-950 mb-4"></span>

          {/* FormCurso Component */}
          <FormCurso
            form={form}
            setForm={setForm}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setValue("");
            }}
            showCancel={true}
            isModificacion={true}
            filteredMaterias={filteredMaterias}
            filteredSedes={filteredSedes}
          />
        </div>
      )}

      {/* PopUp de éxito */}
      {completed && (
        <div className="w-full max-w-6xl p-6">
          <div className="flex flex-col justify-center items-center border border-green-500 p-4 rounded-md shadow-sm gap-4 bg-white">
            <CardCurso
              title={"Curso modificado exitosamente"}
              curso={cursoData}
            />
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
        <PopUp
          title={"Error al modificar el curso"}
          message={error}
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
}