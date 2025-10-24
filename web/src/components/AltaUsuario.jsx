import { useState } from "react";
import PopUp from "@/components/PopUp";
import CardUsuario from "./CardUsuario";
import SueldoForm from "./SueldosForm";
import FormUsuarios from "./FormUsuarios";
import { altaUsuario } from "@/api/usuariosApi";

export default function AltaUsuario() {
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
  const [selectedValues, setSelectedValues] = useState([]);
  const [showPopUp, setShowPopUp] = useState(false);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [userData, setUserData] = useState(null);

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
    setShowPopUp(false);
    setUserData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.nombre ||
      !form.apellido ||
      !form.nroDocumento ||
      !form.correoElectronico ||
      !form.telefonoPersonal
    ) {
      setError("Por favor, completá todos los campos obligatorios.");
      return;
    }

    try {
      const response = await altaUsuario({ ...form, tipoUsuario: selectedValues });
      setUserData(response);
      setCompleted(true);
      setShowPopUp(true);
    } catch (err) {
      console.error("Error al dar de alta el usuario:", err);
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen items-start justify-start mt-6 py-4 sm:px-8">
      
        <div className="w-full max-w-3xl">
          <h1 className="font-bold text-start text-xl mb-4 text-black">
            Alta de Usuario
          </h1>
          <span className="block w-full h-[2px] bg-sky-950 mb-6"></span>
          {!completed && (
          <FormUsuarios
            form={form}
            setForm={setForm}
            selectedValues={selectedValues}
            setSelectedValues={setSelectedValues}
            handleSubmit={handleSubmit}
            cleanForm={cleanForm}
          />
          )}
        </div>
      

      {completed && selectedValues.includes("Alumno") && (
        <CardUsuario
          title="Se ha dado de alta exitosamente"
          user={userData}
          onClose={cleanForm}
        />
      )}

      {completed &&
        (selectedValues.includes("Administrador") ||
          selectedValues.includes("Docente")) && (
          <SueldoForm onClose={cleanForm} />
        )}

      {error && (
        <PopUp
          title="Error al dar de alta al usuario"
          message={error}
          onClose={cleanForm}
        />
      )}
    </div>
  );
}
