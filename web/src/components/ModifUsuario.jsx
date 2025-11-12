import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import PopUp from "@/components/PopUp";
import FormUsuarios from "./FormUsuarios";
import { modificarUsuario, obtenerUsuarios } from "@/api/usuariosApi";
import { modificarSueldo } from "@/api/sueldosApi";
import {
  asociarCarreraUsuario,
  obtenerUsuariosCarreras,
  modificarCarreraUsuario,
} from "@/api/usuariosCarrerasApi";
import {
  CARRERAS_MOCK,
  INITIAL_FORM_STATE,
  INITIAL_SUELDO_STATE,
} from "@/constants/formConstants";

export default function ModifUsuario() {
  const [param, setParam] = useState("legajo");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [initialForm, setInitialForm] = useState(INITIAL_FORM_STATE);
  const [initialCarreraSeleccionada, setInitialCarreraSeleccionada] =
    useState("");
  const [initialSueldoForm, setInitialSueldoForm] =
    useState(INITIAL_SUELDO_STATE);
  const [activarUsuario, setActivarUsuario] = useState(false);

  const handleSearch = async () => {
    if (!value.trim()) {
      setError("Por favor, ingresá un valor para buscar.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await obtenerUsuarios(0, 100, param, value.trim(), null);

      if (response && response.length > 0) {
        const usuario = response[0];
        setUserData(usuario);

        setInitialForm({
          nombre: usuario.nombre || "",
          apellido: usuario.apellido || "",
          dni: usuario.dni || "",
          email_personal: usuario.email_personal || "",
          telefono_personal: usuario.telefono_personal || "",
        });

        setInitialCarreraSeleccionada(usuario.carrera?.id_carrera || "");

        setInitialSueldoForm({
          cbu: usuario.sueldo?.cbu || "",
          sueldo_fijo: usuario.rol?.sueldo_base?.toString() || "0.00",
          sueldo_adicional: usuario.sueldo?.sueldo_adicional?.toString() || "",
          observaciones: usuario.sueldo?.observaciones || "",
        });

        setActivarUsuario(false);
        setShowForm(true);
      } else {
        setError("Usuario no encontrado");
      }
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          error.message ||
          "Error al buscar usuario"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleActivarUsuario = async () => {
    if (!userData?.id_usuario) {
      setError("No hay usuario seleccionado");
      return;
    }

    setLoadingSubmit(true);
    setError(null);

    try {
      await modificarUsuario(userData.id_usuario, {
        status: true,
      });

      // Mostrar mensaje de éxito temporal
      setShowForm(false);
      setCompleted(true);

      // Resetear después de 2 segundos
      setTimeout(() => {
        resetForm();
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Error al activar usuario"
      );
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleSubmit = async (formData, validationError) => {
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!userData?.id_usuario) {
      setError("No hay usuario seleccionado para modificar");
      return;
    }

    setLoadingSubmit(true);
    setError(null);

    try {
      // Actualizar datos personales del usuario
      const updateData = { ...formData.datosPersonales };

      const response = await modificarUsuario(userData.id_usuario, updateData);

      // Si es ALUMNO y tiene carrera, actualizar o crear carrera
      if (
        formData.categoriaSeleccionada === "ALUMNO" &&
        formData.carreraSeleccionada
      ) {
        try {
          // Buscar carrera activa del usuario
          const carreras = await obtenerUsuariosCarreras(
            0,
            100,
            "id_usuario",
            userData.id_usuario,
            true
          );
          const carreraActual = carreras.length > 0 ? carreras[0] : null;

          if (!carreraActual) {
            // No tiene carrera, crear nueva
            await asociarCarreraUsuario({
              id_usuario: userData.id_usuario,
              id_carrera: formData.carreraSeleccionada,
            });
          } else if (
            carreraActual.id_carrera !== formData.carreraSeleccionada
          ) {
            // Tiene carrera pero es diferente, modificar
            await modificarCarreraUsuario(
              userData.id_usuario,
              carreraActual.id_carrera,
              formData.carreraSeleccionada
            );
          }
          // Si tiene la misma carrera, no hacer nada
        } catch (carreraError) {
          console.error("Error al actualizar carrera:", carreraError);
        }
      }

      // Si NO es ALUMNO y tiene sueldo, actualizar sueldo
      if (
        formData.categoriaSeleccionada !== "ALUMNO" &&
        formData.sueldoForm &&
        userData.sueldo?.id_sueldo
      ) {
        try {
          await modificarSueldo(userData.sueldo.id_sueldo, {
            cbu: formData.sueldoForm.cbu,
            sueldo_adicional:
              parseFloat(formData.sueldoForm.sueldo_adicional) || 0,
            observaciones: formData.sueldoForm.observaciones || "",
          });
        } catch (sueldoError) {
          console.error("Error al actualizar sueldo:", sueldoError);
        }
      }

      // Mostrar mensaje de éxito temporal
      setShowForm(false);
      setCompleted(true);

      // Resetear después de 2 segundos
      setTimeout(() => {
        resetForm();
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Error al modificar usuario"
      );
    } finally {
      setLoadingSubmit(false);
    }
  };

  const resetForm = () => {
    setCompleted(false);
    setShowForm(false);
    setUserData(null);
    setValue("");
    setParam("legajo");
    setInitialForm(INITIAL_FORM_STATE);
    setInitialCarreraSeleccionada("");
    setInitialSueldoForm(INITIAL_SUELDO_STATE);
    setActivarUsuario(false);
  };

  return (
    <div className="flex flex-col w-full min-h-screen items-start justify-start mt-6 py-4 sm:px-8">
      <div className="w-full max-w-4xl">
        {!completed && !showForm && (
          <div>
            <h1 className="font-bold text-start text-xl mb-4 text-black">
              Modificación de Usuario
            </h1>
            <span className="block w-full h-[2px] bg-sky-950 mb-6" />

            <FieldSet>
              <FieldGroup className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field>
                    <FieldLabel>Buscar por</FieldLabel>
                    <Select value={param} onValueChange={setParam}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="legajo">Legajo</SelectItem>
                        <SelectItem value="email_institucional">
                          Email Institucional
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel>Valor</FieldLabel>
                    <Input
                      placeholder={`Ingresá el ${
                        param === "legajo" ? "legajo" : "email institucional"
                      }`}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                  </Field>
                </div>

                <div className="flex gap-4">
                  <Button
                    disabled={loading || !value.trim()}
                    onClick={handleSearch}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md"
                  >
                    {loading ? "Buscando..." : "Buscar Usuario"}
                  </Button>
                </div>
              </FieldGroup>
            </FieldSet>
          </div>
        )}

        {/* Formulario de modificación */}
        {showForm && userData && (
          <div>
            <h1 className="font-bold text-start text-xl mb-4 text-black">
              Modificar Usuario - {userData.legajo}
            </h1>
            <span className="block w-full h-[2px] bg-sky-950 mb-6" />

            {!userData.status ? (
              // Usuario inactivo - Solo mostrar opción de activar
              <div className="bg-red-50 border-2 border-red-200 p-6 rounded-lg">
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-semibold">Usuario:</span>{" "}
                      {userData.nombre} {userData.apellido} (
                      {userData.email_institucional})
                    </p>
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-semibold">Legajo:</span>{" "}
                      {userData.legajo}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Rol:</span>{" "}
                      {userData.rol?.categoria}
                      {userData.rol?.subcategoria &&
                        ` - ${userData.rol.subcategoria}`}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-red-300">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-block px-3 py-1 rounded text-sm font-semibold bg-red-100 text-red-800">
                        ⚠️ Usuario Inactivo
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Este usuario está desactivado. No se pueden modificar sus
                      datos mientras esté inactivo.
                    </p>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleActivarUsuario}
                        disabled={loadingSubmit}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded"
                      >
                        {loadingSubmit ? "Activando..." : "Activar Usuario"}
                      </Button>
                      <Button
                        onClick={resetForm}
                        disabled={loadingSubmit}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded"
                      >
                        Cancelar
                      </Button>
                    </div>
                    <p className="text-xs text-gray-600 mt-3">
                      Una vez activado, podrás modificar sus datos normalmente.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Usuario activo - Mostrar formulario de modificación
              <>
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Usuario actual:</span>{" "}
                    {userData.nombre} {userData.apellido} (
                    {userData.email_institucional})
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Modificá los campos que desees actualizar y presioná
                    "Guardar"
                  </p>
                  <p className="text-xs text-blue-600 mt-1 font-medium">
                    <span className="font-semibold">Rol:</span>{" "}
                    {userData.rol?.categoria}
                    {userData.rol?.subcategoria &&
                      ` - ${userData.rol.subcategoria}`}{" "}
                    (no modificable) |{" "}
                    <span className="font-semibold">Estado:</span>{" "}
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Activo
                    </span>
                  </p>
                </div>

                <FormUsuarios
                  key={userData.id_usuario}
                  initialForm={initialForm}
                  initialCarreraSeleccionada={initialCarreraSeleccionada}
                  initialSueldoForm={initialSueldoForm}
                  categoriaRol={userData.rol?.categoria}
                  carrerasMock={CARRERAS_MOCK}
                  loadingSubmit={loadingSubmit}
                  onSubmit={handleSubmit}
                  onCancel={resetForm}
                  isModificacion={true}
                />
              </>
            )}
          </div>
        )}

        {/* Operación exitosa */}
        {completed && (
          <div className="w-full bg-green-50 border-2 border-green-500 p-8 rounded-xl shadow-lg animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-3xl font-bold">✓</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-green-700 text-center mb-2">
              Operación Exitosa
            </h2>
            <p className="text-center text-gray-600 text-sm">
              Redirigiendo a búsqueda...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <PopUp title="Error" message={error} onClose={() => setError(null)} />
        )}
      </div>
    </div>
  );
}
