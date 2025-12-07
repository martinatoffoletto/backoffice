import CardUsuario from "@/components/CardUsuario";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select.jsx";
import PopUp from "@/components/PopUp";
import { useState } from "react";
import { bajaUsuario, obtenerUsuarios } from "@/api/usuariosApi";

export default function BajaUsuario() {
  const [param, setParam] = useState("legajo");
  const [value, setValue] = useState("");
  const [found, setFound] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!value.trim()) {
      setError("Por favor, ingresá un valor para buscar.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const searchValue = String(value).trim();

      // Buscar usuario por el parámetro seleccionado
      const response = await obtenerUsuarios(0, 100, param, searchValue, null);

      if (response && response.length > 0) {
        // Si hay múltiples resultados, tomar el primero
        setUser(response[0]);
        setFound(true);
      } else {
        setError("Usuario no encontrado");
      }
    } catch (error) {
      console.error("Error al buscar usuario:", error);
      setError(
        error.response?.data?.detail ||
          error.message ||
          "Error al buscar usuario"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBaja = async () => {
    if (!user || !user.id_usuario) {
      setError("No hay usuario seleccionado para dar de baja");
      return;
    }

    setLoading(true);
    try {
      await bajaUsuario(user.id_usuario);
      console.log("Usuario dado de baja exitosamente");
      setDeleted(true);
      setFound(false);
    } catch (err) {
      console.error("Error al dar de baja usuario:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Error al dar de baja usuario"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-6xl p-6">
        {!deleted && (
          <div>
            <h1 className="font-bold text-center text-2xl mb-4">
              Baja de Usuario
            </h1>
            <span className="block w-full h-[3px] bg-sky-950 mb-6" />

            <FieldSet>
              <FieldGroup className="space-y-5">
                <div className="flex gap-3 items-end">
                  <Field className="w-1/4">
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

                  <Field className="flex-1">
                    <FieldLabel>Valor</FieldLabel>
                    <Input
                      placeholder={`Ingresá el ${
                        param === "legajo" ? "legajo" : "email institucional"
                      }`}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                  </Field>

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

        {/* Usuario encontrado - Confirmación */}
        {found && user && (
          <div className="w-full max-w-6xl p-6">
            <div className="w-full bg-white border-2 border-red-500 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-red-600 mb-4">
                ⚠️ Confirmar Baja de Usuario
              </h2>
              <span className="block w-full h-[2px] bg-red-500 mb-4"></span>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-3 text-gray-800">
                  Datos del Usuario:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Legajo:</span>
                    <p className="text-gray-900">{user.legajo}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">DNI:</span>
                    <p className="text-gray-900">{user.dni}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Nombre:</span>
                    <p className="text-gray-900">
                      {user.nombre} {user.apellido}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Email Institucional:
                    </span>
                    <p className="text-gray-900 bg-blue-50 px-2 py-1 rounded">
                      {user.email_institucional}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Categoría:
                    </span>
                    <p className="text-gray-900">
                      {user.rol?.categoria || "-"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Estado:</span>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        user.status
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-red-600 font-medium mb-6">
                ¿Estás seguro que deseas dar de baja este usuario? Esta acción
                cambiará su estado a Inactivo.
              </p>

              <div className="flex gap-4">
                <Button
                  disabled={loading}
                  onClick={handleBaja}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded"
                >
                  {loading ? "Procesando..." : "Confirmar Baja"}
                </Button>
                <Button
                  onClick={() => {
                    setFound(false);
                    setUser(null);
                    setValue("");
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-2 rounded"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Usuario dado de baja exitosamente */}
        {deleted && (
          <div className="w-full max-w-6xl p-6">
            <div className="w-full bg-white border-2 border-green-500 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-green-600 mb-4">
                ✓ Usuario Dado de Baja Exitosamente
              </h2>
              <span className="block w-full h-[2px] bg-green-500 mb-4"></span>

              <p className="text-gray-700 mb-6">
                El usuario <span className="font-semibold">{user?.legajo}</span>{" "}
                ha sido dado de baja correctamente.
              </p>

              <Button
                onClick={() => {
                  setDeleted(false);
                  setUser(null);
                  setValue("");
                  setParam("legajo");
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded"
              >
                Nueva Baja
              </Button>
            </div>
          </div>
        )}

        {error !== null && (
          <PopUp
            title={"Error"}
            message={error}
            onClose={() => setError(null)}
          />
        )}
      </div>
    </div>
  );
}
