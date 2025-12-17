import { useState } from "react";
import FormCurso from "./FormCurso";
import { modificarCurso } from "@/api/cursosApi";
import PopUp from "@/components/PopUp";

const formatLocalDateTime = (isoString) => {
  const date = new Date(isoString);
  return (
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0") +
    "T" +
    String(date.getHours()).padStart(2, "0") +
    ":" +
    String(date.getMinutes()).padStart(2, "0")
  );
};

const ModificarCurso = ({ curso, onCancel }) => {
  const [form, setForm] = useState({
    uuid_materia: curso.uuid_materia || "",
    examen: curso.examen || "",
    comision: curso.comision || "",
    modalidad: curso.modalidad || "",
    sede: curso.sede || "",
    aula: curso.aula || "",
    periodo: curso.periodo || "",
    turno: curso.turno || "",
    estado: curso.estado || "activo",
    cantidad_max: curso.cantidad_max || 0,
    cantidad_min: curso.cantidad_min || 0,
    desde: curso.desde ? formatLocalDateTime(curso.desde) : "",
    hasta: curso.hasta ? formatLocalDateTime(curso.hasta) : "",
    dia: curso.dia || "",
  });

  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [camposConError, setCamposConError] = useState(new Set());

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errores = new Set();
    const camposRequeridos = [
      "examen",
      "comision",
      "modalidad",
      "periodo",
      "turno",
      "estado",
      "dia",
      "desde",
      "hasta",
    ];

    camposRequeridos.forEach((campo) => {
      if (!form[campo]) {
        errores.add(campo);
      }
    });

    if (errores.size > 0) {
      setCamposConError(errores);
      setError("Por favor complete todos los campos obligatorios");
      return;
    }

    try {
      const cursoData = {
        uuid_materia: form.uuid_materia,
        examen: form.examen,
        comision: form.comision,
        modalidad: form.modalidad,
        sede: form.sede,
        aula: form.aula,
        periodo: form.periodo,
        turno: form.turno,
        estado: form.estado,
        cantidad_max: parseInt(form.cantidad_max),
        cantidad_min: parseInt(form.cantidad_min),
        desde: new Date(form.desde).toISOString(),
        hasta: new Date(form.hasta).toISOString(),
        dia: form.dia,
      };

      await modificarCurso(curso.uuid, cursoData);
      setShowSuccess(true);
    } catch (err) {
      console.error("Error al modificar curso:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Error al modificar el curso"
      );
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen items-start justify-start mt-6 py-4 sm:px-8">
      <div className="w-full max-w-5xl">
        <h1 className="font-bold text-start text-xl mb-4 text-black">
          Modificar Curso
        </h1>
        <span className="block w-full h-[2px] bg-sky-950 mb-6" />

        <FormCurso
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onCancel={onCancel}
          showCancel={true}
          isModificacion={true}
          camposConError={camposConError}
          setCamposConError={setCamposConError}
          setError={setError}
        />
      </div>

      {error && (
        <PopUp title="Error" message={error} onClose={() => setError(null)} />
      )}

      {showSuccess && (
        <PopUp
          title="Éxito"
          message="Curso modificado exitosamente"
          onClose={handleSuccessClose}
        />
      )}
    </div>
  );
};

export default ModificarCurso;
