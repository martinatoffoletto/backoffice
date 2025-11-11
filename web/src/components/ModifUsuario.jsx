import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PopUp from "@/components/PopUp";
import CardUsuario from "./CardUsuario";
import FormUsuarios from "./FormUsuarios";
import SueldosForm from "./SueldosForm";
import { modificarUsuario, usuarioPorId } from "@/api/usuariosApi";

export default function ModifUsuario() {
  const [value, setValue] = useState(""); // Legajo a buscar
  const [form, setForm] = useState({
    tipoUsuario: [],
    nombre: "",
    apellido: "",
    nroDocumento: "",
    correoElectronico: "",
    telefono_Celular: "",
    carrera: "",
  });
  const [selectedValues, setSelectedValues] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  // Limpiar formulario
  const cleanForm = () => {
    setForm({
      tipoUsuario: [],
      nombre: "",
      apellido: "",
      nroDocumento: "",
      correoElectronico: "",
      telefono_Celular: "",
      carrera: "",
    });
    setSelectedValues([]);
    setError(null);
    setCompleted(false);
    setShowForm(false);
    setUserData(null);
    setValue("");
  };

  // Buscar usuario por legajo
  const handleSearch = async () => {
    try {
      if (!value.trim()) return;
      const response = await usuarioPorId(parseInt(value));

      // Aseguramos que tipoUsuario siempre sea array
      const tipoArray = Array.isArray(response.tipoUsuario)
        ? response.tipoUsuario
        : [response.tipoUsuario];

      setForm({
        tipoUsuario: tipoArray,
        nombre: response.nombre || "",
        apellido: response.apellido || "",
        nroDocumento: response.nroDocumento || "",
        correoElectronico: response.correoElectronico || "",
        telefono_Celular: response.telefono_Celular || "",
        carrera: response.carrera || "",
      });

      setSelectedValues(tipoArray);
      setUserData(response);
      setShowForm(true);
      setCompleted(true);
      setError(null);
    } catch (err) {
      setError(err.message);
      setShowForm(false);
    }
  };

  // Modificar usuario
  const handleSubmit = async () => {
    try {
      const dataToSend = { ...form, tipoUsuario: selectedValues };
      const response = await modificarUsuario(value, dataToSend);
      setUserData(response);
      setCompleted(true);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error(err.message);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen items-start justify-start mt-6 py-4 sm:px-8">
      <div className="w-full max-w-3xl">
        <h1 className="font-bold text-start text-xl mb-4 text-black">
          Modificación de Usuario
        </h1>
        <span className="block w-full h-[2px] bg-sky-950 mb-6"></span>

        {/* Input legajo y botón */}
        {!showForm && (<div className="flex flex-col lg:flex-row gap-4 mb-6 w-full">
          <Input
            placeholder="Legajo"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full lg:w-1/3"
          />
          <Button
            disabled={!value.trim()}
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full lg:w-auto"
          >
            Buscar
          </Button>
        </div>)}

        {/* Formulario */}
        {showForm && (
          <FormUsuarios
            form={form}
            setForm={setForm} 
            selectedValues={selectedValues}
            setSelectedValues={setSelectedValues}
            handleSubmit={handleSubmit}
            cleanForm={cleanForm}
          />
        )}
        {completed && selectedValues.includes("Alumno") && (
                <CardUsuario
                  title="Se ha dado de alta exitosamente"
                  user={userData}
                  onClose={cleanForm}
                />
              )}
        
        {completed && (selectedValues.includes("Administrador") ||
                  selectedValues.includes("Docente")) && (
                  <SueldosForm userData={userData} onClose={cleanForm} />
        )}              

        {/* Resultado exitoso */}
        {completed && userData && (
          <CardUsuario
            title="Usuario modificado exitosamente"
            user={userData}
            onClose={cleanForm}
          />
        )}

        {/* Error */}
        {error && (
          <PopUp
            title="Error al modificar la información del usuario"
            message={error}
            onClose={() => setError(null)}
          />
        )}
      </div>
    </div>
  );
}
