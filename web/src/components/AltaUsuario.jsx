import { useState, useEffect, useCallback } from "react";
import PopUp from "@/components/PopUp";
import CardUsuario from "./CardUsuario";
import FormUsuarios from "./FormUsuarios";
import { altaUsuario } from "@/api/usuariosApi";
import { obtenerRoles } from "@/api/rolesApi";
import { altaSueldo } from "@/api/sueldosApi";
import {
  CARRERAS_MOCK,
  INITIAL_FORM_STATE,
  INITIAL_SUELDO_STATE,
} from "@/constants/formConstants";
import { carreras } from "@/data/mockData";

export default function AltaUsuario() {
  const [rolesOptions, setRolesOptions] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [userData, setUserData] = useState(null);
  const [carreraData, setCarreraData] = useState(null);
  const [sueldoData, setSueldoData] = useState(null);
  const [showPopUp, setShowPopUp] = useState(false);

  useEffect(() => {
    const cargarRoles = async () => {
      try {
        const roles = await obtenerRoles(true);
        const opciones = roles.map((rol) => ({
          id: rol.id_rol,
          label: rol.subcategoria
            ? `${rol.categoria} - ${rol.subcategoria}`
            : rol.categoria,
          categoria: rol.categoria,
          sueldo_base: rol.sueldo_base,
        }));
        setRolesOptions(opciones);
      } catch (err) {
        setError("Error al cargar los roles. Por favor, recargá la página.");
      } finally {
        setLoadingRoles(false);
      }
    };
    cargarRoles();
  }, []);

  const cleanForm = useCallback(() => {
    setError(null);
    setCompleted(false);
    setUserData(null);
    setCarreraData(null);
    setSueldoData(null);
    setShowPopUp(false);
  }, []);

  const asociarCarrera = async (userId, carreraId) => {
    const { asociarCarreraUsuario } = await import("@/api/usuariosCarrerasApi");
    return await asociarCarreraUsuario({
      id_usuario: userId,
      id_carrera: carreraId,
    });
  };

  const registrarSueldo = async (userId, sueldoData) => {
    const sueldoPayload = {
      id_usuario: userId,
      cbu: sueldoData.cbu,
      sueldo_adicional: parseFloat(sueldoData.sueldo_adicional) || 0,
      observaciones: sueldoData.observaciones || "",
    };
    return await altaSueldo(sueldoPayload);
  };
  const handleSubmit = async (formData, validationErrors) => {
    if (validationErrors) {
      setError(validationErrors);
      setShowPopUp(true);
      return;
    }

    setLoadingSubmit(true);

    try {
      const usuarioData = {
        ...formData.datosPersonales,
        id_rol: formData.rolSeleccionado,
      };

      const response = await altaUsuario(usuarioData);
      const userId = response.id_usuario || response.user?.id_usuario;
      setUserData(response);

      if (
        formData.categoriaSeleccionada === "ALUMNO" &&
        formData.carreraSeleccionada
      ) {
        const carreraResponse = await asociarCarrera(
          userId,
          formData.carreraSeleccionada
        );
        const carreraEncontrada = CARRERAS_MOCK.find(
          (c) => c.id === formData.carreraSeleccionada
        );
        setCarreraData({
          id_carrera: formData.carreraSeleccionada,
          nombre_carrera: carreraEncontrada?.nombre || "Carrera desconocida",
          ...carreraResponse,
        });
      } else if (
        formData.categoriaSeleccionada !== "ALUMNO" &&
        formData.sueldoForm
      ) {
        const sueldoResponse = await registrarSueldo(
          userId,
          formData.sueldoForm
        );
        setSueldoData(sueldoResponse);
      }

      setCompleted(true);
      setShowPopUp(true);
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Error al crear el usuario"
      );
      setShowPopUp(true);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-2xl p-6">
        <h1 className="font-bold text-center text-2xl mb-4">
          Alta de Usuario
        </h1>
        <span className="block w-full h-[3px] bg-sky-950 mb-8"></span>

        {!completed && (
          <FormUsuarios
            initialForm={INITIAL_FORM_STATE}
            initialRolSeleccionado=""
            initialCarreraSeleccionada=""
            initialSueldoForm={INITIAL_SUELDO_STATE}
            rolesOptions={rolesOptions}
            carrerasMock={CARRERAS_MOCK}
            loadingRoles={loadingRoles}
            loadingSubmit={loadingSubmit}
            onSubmit={handleSubmit}
            onCancel={cleanForm}
            
          />
        )}
      </div>

      {completed && showPopUp && !error && (
        <CardUsuario
          title="Se ha dado de alta exitosamente"
          user={userData.user || userData}
          password={userData.password}
          carreraData={carreraData}
          sueldoData={sueldoData}
          onClose={cleanForm}
        />
      )}

      {error && showPopUp && (
        <PopUp
          title="Error al dar de alta al usuario"
          message={error}
          onClose={() => {
            setShowPopUp(false);
            setError(null);
          }}
        />
      )}
    </div>
  );
}
