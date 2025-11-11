import { useState } from "react";
import PopUp from "@/components/PopUp";
import CardUsuario from "./CardUsuario";
import SueldoForm from "./SueldosForm";
import FormUsuarios from "./FormUsuarios";
import { altaUsuario } from "@/api/usuariosApi";
import { obtenerRoles, buscarRoles } from "@/api/rolesApi";
import { asociarCarreraUsuario } from "@/api/usuariosCarrerasApi";
import { altaSueldo } from "@/api/sueldosApi";
import { obtenerCarreras } from "@/api/cursosApi";

export default function AltaUsuario() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    nroDocumento: "",
    correoElectronico: "",
    telefono_Celular: "",
    carrera: "",
  });
  const [categorias_seleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [subcategoria_seleccionada, setSubcategoriaSeleccionada] = useState("");
  const [subcategorias_disponibles, setSubcategoriasDisponibles] = useState([]);
  const [loadingSubcategorias, setLoadingSubcategorias] = useState(false);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [userData, setUserData] = useState(null);
  const [step, setStep] = useState(1); // 1: datos generales, 2: carrera/sueldo
  const [carreras, setCarreras] = useState([]);
  const [carrera_seleccionada, setCarreraSeleccionada] = useState("");
  const [sueldoForm, setSueldoForm] = useState({
    cbu: "",
    sueldo_adicional: "",
    observaciones: "",
  });

  const CATEGORIAS_DISPONIBLES = ["ADMINISTRADOR", "ALUMNO", "DOCENTE"];

  // Cargar roles y carreras al iniciar
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [rolesData, carrerasData] = await Promise.all([
          obtenerRoles(true), // Solo roles activos
          obtenerCarreras()
        ]);
        setRoles(rolesData);
        setCarreras(carrerasData);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar los datos. Por favor, recargá la página.");
      }
    };
    cargarDatos();
  }, []);

  // Cargar subcategorías cuando se selecciona ADMINISTRADOR
  useEffect(() => {
    const cargarSubcategorias = async () => {
      if (categorias_seleccionadas.includes("ADMINISTRADOR")) {
        setLoadingSubcategorias(true);
        try {
          const rolesAdmin = await buscarRoles("categoria", "ADMINISTRADOR", true);
          const subcategorias = rolesAdmin
            .map((rol) => rol.subcategoria)
            .filter((sub) => sub && sub.trim() !== "");
          setSubcategoriasDisponibles([...new Set(subcategorias)]);
        } catch (err) {
          console.error("Error al cargar subcategorías:", err);
          setSubcategoriasDisponibles([]);
        } finally {
          setLoadingSubcategorias(false);
        }
      } else {
        setSubcategoriasDisponibles([]);
        setSubcategoriaSeleccionada("");
      }
    };
    cargarSubcategorias();
  }, [categorias_seleccionadas]);

  const toggleCategoria = (categoria) => {
    setCategoriasSeleccionadas((prev) => {
      if (prev.includes(categoria)) {
        return prev.filter((c) => c !== categoria);
      } else {
        return [...prev, categoria];
      }
    });
  };

  const cleanForm = () => {
    setForm({
      nombre: "",
      apellido: "",
      nroDocumento: "",
      correoElectronico: "",
      telefonoPersonal: "",
      contraseña: "",
      id_rol: "",
    });
    setCategoriasSeleccionadas([]);
    setSubcategoriaSeleccionada("");
    setSubcategoriasDisponibles([]);
    setCarreraSeleccionada("");
    setSueldoForm({
      cbu: "",
      sueldo_adicional: "",
      observaciones: "",
    });
    setError(null);
    setCompleted(false);
    setUserData(null);
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.nombre ||
      !form.apellido ||
      !form.nroDocumento ||
      !form.correoElectronico ||
      !form.telefonoPersonal ||
      !form.contraseña ||
      categorias_seleccionadas.length === 0
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
      // Mostrar mensaje de error más descriptivo
      const errorMessage = err.response?.data?.detail || err.message || "Error al crear el usuario";
      setError(errorMessage);
    }
  };

  const es_alumno = categorias_seleccionadas.includes("ALUMNO");

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
          user={userData.user || userData}
          onClose={cleanForm}
        />
      )}

      {completed && selectedValues.includes("Administrador") ||
          selectedValues.includes("Docente") && (
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
