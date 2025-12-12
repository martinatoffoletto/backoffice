import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { altaCurso } from "@/api/cursosApi";
import { obtenerMaterias } from "@/api/materiasApi";
import { obtenerSedes } from "@/api/sedesApi";
import GestionClases from "@/components/GestionClases";
import FormCurso from "@/components/FormCurso";

export default function AltaCurso() {
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
    titular_uuid: "",
    auxiliar_uuid: "",
  });
  const [showPopUp, setShowPopUp] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [filteredSedes, setFilteredSedes] = useState([]);
  const [filteredMaterias, setFilteredMaterias] = useState([]);
  const [error, setError] = useState(null);
  const [cursoData, setCursoData] = useState(null);
  const [showGestionClases, setShowGestionClases] = useState(false);
  const [camposConError, setCamposConError] = useState(new Set());

  // Función para convertir datetime-local a ISO 8601 format
  const formatDateToISO = (dateTimeLocal) => {
    if (!dateTimeLocal) return "";
    // dateTimeLocal format: "2024-12-08T14:30"
    const date = new Date(dateTimeLocal);
    // Convertir a ISO 8601: "2024-12-08T14:30:00.000Z"
    return date.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos obligatorios
    const camposObligatorios = {
      modalidad: form.modalidad,
      sede: form.sede,
      uuid_materia: form.uuid_materia,
      comision: form.comision,
      dia: form.dia,
      periodo: form.periodo,
      desde: form.desde,
      hasta: form.hasta,
      examen: form.examen,
      aula: form.aula,
      turno: form.turno,
    };

    const camposFaltantes = Object.entries(camposObligatorios)
      .filter(
        ([, value]) =>
          !value || (typeof value === "string" && value.trim() === "")
      )
      .map(([campo]) => campo);

    const erroresFechas = [];
    // Validar que fecha fin sea posterior o igual a fecha inicio
    if (form.desde && form.hasta) {
      const fechaInicio = new Date(form.desde);
      const fechaFin = new Date(form.hasta);

      if (fechaFin < fechaInicio) {
        erroresFechas.push("hasta");
      }
    }

    // Validar que haya al menos un titular o auxiliar
    const tieneDocente = form.titular_uuid || form.auxiliar_uuid;
    if (!tieneDocente) {
      camposFaltantes.push("inscripciones_iniciales");
    }

    // Combinar todos los campos con error
    const todosLosErrores = new Set([...camposFaltantes, ...erroresFechas]);

    if (todosLosErrores.size > 0) {
      setCamposConError(todosLosErrores);

      const nombres = {
        modalidad: "Modalidad",
        examen: "Examen",
        sede: "Sede",
        uuid_materia: "Materia",
        comision: "Comisión",
        dia: "Día de cursada",
        periodo: "Período",
        desde: "Fecha Desde",
        hasta: "Fecha Hasta",
        aula: "Aula",
        turno: "Turno",
        inscripciones_iniciales: "Docentes (Titular o Auxiliar)",
      };

      const mensajesError = [];
      if (camposFaltantes.length > 0) {
        mensajesError.push(
          `Campos obligatorios faltantes: ${camposFaltantes
            .map((c) => nombres[c] || c)
            .join(", ")}`
        );
      }
      if (erroresFechas.length > 0) {
        mensajesError.push(
          "La fecha fin debe ser posterior o igual a la fecha inicio"
        );
      }

      setError(mensajesError.join(". "));
      return;
    }

    // Si no hay errores, limpiar los campos con error
    setCamposConError(new Set());

    try {
      // Map FormCurso fields to API fields - DTO de CursoCreateDTO
      // Construir inscripciones_iniciales
      const inscripciones_iniciales = [];
      if (form.titular_uuid) {
        inscripciones_iniciales.push({
          user_uuid: form.titular_uuid,
          rol: "TITULAR",
        });
      }
      if (form.auxiliar_uuid) {
        inscripciones_iniciales.push({
          user_uuid: form.auxiliar_uuid,
          rol: "AUXILIAR",
        });
      }

      const cursoData = {
        uuid_materia: form.uuid_materia,
        examen: form.examen,
        comision: form.comision,
        modalidad: form.modalidad,
        sede: form.sede,
        aula: form.aula,
        dia: form.dia,
        turno: form.turno,
        periodo: form.periodo,
        desde: formatDateToISO(form.desde),
        hasta: formatDateToISO(form.hasta),
        cantidad_max: parseInt(form.cantidad_max) || 0,
        cantidad_min: parseInt(form.cantidad_min) || 0,
        estado: form.estado,
        inscripciones_iniciales: inscripciones_iniciales,
      };
      const nuevo_curso = await altaCurso(cursoData);
      console.log("Curso dado de alta exitosamente");
      setCursoData(nuevo_curso);
      setCompleted(true);
      setShowPopUp(true);
    } catch (err) {
      console.error(`Error al dar de alta el curso: ${err.message}`);
      setError(err.message);
    }
  };

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

  return (
    <div className="w-full flex flex-col items-center">
      {!completed && (
        <div className="w-full max-w-6xl p-6">
          <h1 className="font-bold text-center text-2xl mb-4">Alta Curso</h1>
          <span className="block w-full h-[3px] bg-sky-950 mb-4"></span>

          {/* FormCurso Component */}
          <FormCurso
            form={form}
            setForm={setForm}
            onSubmit={handleSubmit}
            isModificacion={false}
            filteredMaterias={filteredMaterias}
            filteredSedes={filteredSedes}
            camposConError={camposConError}
            setCamposConError={setCamposConError}
            setError={setError}
          />
        </div>
      )}

      {showPopUp && cursoData && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="flex flex-col justify-center items-center border-2 border-green-500 p-6 rounded-lg shadow-xl gap-4 w-full max-w-md bg-white mx-4">
            <h2 className="text-xl font-bold text-green-600">
              Curso dado de alta exitosamente
            </h2>
            <div className="w-full space-y-2 text-left">
              <p className="text-gray-700">
                <span className="font-semibold">Materia:</span>{" "}
                {filteredMaterias.find(
                  (m) =>
                    m.uuid_materia === cursoData.uuid_materia ||
                    m.id_materia === cursoData.uuid_materia ||
                    m.id === cursoData.uuid_materia
                )?.nombre ||
                  cursoData.uuid_materia ||
                  "N/A"}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Día:</span>{" "}
                {cursoData.dia || form.dia
                  ? (cursoData.dia || form.dia).charAt(0).toUpperCase() +
                    (cursoData.dia || form.dia).slice(1).toLowerCase()
                  : ""}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Turno:</span>{" "}
                {cursoData.turno || form.turno
                  ? (cursoData.turno || form.turno).charAt(0).toUpperCase() +
                    (cursoData.turno || form.turno).slice(1).toLowerCase()
                  : ""}
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
            <h2 className="text-xl font-bold mb-4 text-red-600">
              Error al dar de alta el curso
            </h2>
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
  );
}
