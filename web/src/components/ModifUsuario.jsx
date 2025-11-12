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
import { Checkbox } from "@/components/ui/checkbox";
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

      // Si se marcó activar usuario y está inactivo, agregamos status: true
      if (activarUsuario && !userData.status) {
        updateData.status = true;
      }

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

      setUserData(response);
      setCompleted(true);
      setShowForm(false);
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
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-2xl p-6">
        {!completed && !showForm && (
          <div>
            <h1 className="font-bold text-center text-2xl mb-4">
              Modificación de Usuario
            </h1>
            <span className="block w-full h-[3px] bg-sky-950 mb-6" />

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
            <h1 className="font-bold text-center text-2xl mb-4">
              Modificar Usuario - {userData.legajo}
            </h1>
            <span className="block w-full h-[3px] bg-sky-950 mb-6" />

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Usuario actual:</span>{" "}
                {userData.nombre} {userData.apellido} (
                {userData.email_institucional})
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Modificá los campos que desees actualizar y presioná "Guardar"
              </p>
              <p className="text-xs text-blue-600 mt-1 font-medium">
                <span className="font-semibold">Rol:</span>{" "}
                {userData.rol?.categoria}
                {userData.rol?.subcategoria &&
                  ` - ${userData.rol.subcategoria}`}{" "}
                (no modificable) |{" "}
                <span className="font-semibold">Estado:</span>{" "}
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                    userData.status
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {userData.status ? "Activo" : "Inactivo"}
                </span>
              </p>

              {!userData.status && (
                <div className="mt-4 pt-3 border-t border-blue-200">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="activar"
                      checked={activarUsuario}
                      onChange={(checked) => setActivarUsuario(checked)}
                    />
                    <label
                      htmlFor="activar"
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      Activar usuario
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-6">
                    Marcá esta opción si querés reactivar este usuario
                  </p>
                </div>
              )}
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
          </div>
        )}

        {/* Usuario modificado exitosamente */}
        {completed && userData && (
          <div className="w-full max-w-2xl p-6">
            <div className="w-full bg-white border-2 border-green-500 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold text-green-600 mb-4">
              ✓ Usuario Modificado Exitosamente
            </h2>
            <span className="block w-full h-[2px] bg-green-500 mb-4"></span>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-3 text-gray-800">
                Datos Actualizados:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Legajo:</span>
                  <p className="text-gray-900">{userData.legajo}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">DNI:</span>
                  <p className="text-gray-900">{userData.dni}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Nombre:</span>
                  <p className="text-gray-900">
                    {userData.nombre} {userData.apellido}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Email Institucional:
                  </span>
                  <p className="text-gray-900 bg-blue-50 px-2 py-1 rounded">
                    {userData.email_institucional}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Email Personal:
                  </span>
                  <p className="text-gray-900">{userData.email_personal}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Teléfono:</span>
                  <p className="text-gray-900">{userData.telefono_personal}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Categoría:</span>
                  <p className="text-gray-900">
                    {userData.rol?.categoria || "-"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Estado:</span>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      userData.status
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {userData.status ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={resetForm}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded"
            >
              Nueva Modificación
            </Button>
            </div>
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
