import { obtenerUsuarios } from "@/api/usuariosApi";
import { carreraPorId } from "@/api/carrerasApi";
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
import { useState, useEffect } from "react";
import PopUp from "./PopUp";

export default function BusquedaUsuario() {
  const [param, setParam] = useState(null);
  const [value, setValue] = useState("");
  const [status_filter, setStatusFilter] = useState(null);
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [nombreCarrera, setNombreCarrera] = useState(null);
  const [cargandoCarrera, setCargandoCarrera] = useState(false);

  useEffect(() => {
    if (usuarioSeleccionado?.carrera?.id_carrera) {
      setCargandoCarrera(true);
      carreraPorId(usuarioSeleccionado.carrera.id_carrera)
        .then((response) => {
          const data = response.data || response;
          setNombreCarrera(data.name);
        })
        .catch((error) => {
          console.error("Error al obtener nombre de carrera:", error);
          setNombreCarrera("No encontrada");
        })
        .finally(() => setCargandoCarrera(false));
    }
  }, [usuarioSeleccionado?.carrera?.id_carrera]);

  const handleSearch = async () => {
    if (param && !value.trim()) {
      setError("Por favor, ingresá un valor para buscar.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const searchParam = param;
      const searchValue = param ? String(value).trim() : null;

      console.log("Buscando con:", {
        param: searchParam,
        value: searchValue,
        tipo: typeof searchValue,
      });

      const response = await obtenerUsuarios(
        0,
        100,
        searchParam,
        searchValue,
        status_filter
      );
      setResultados(response || []);
    } catch (err) {
      setError(
        err.response?.data?.detail || err.message || "Error al buscar usuarios"
      );
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-6xl p-6">
        <h1 className="font-bold text-center text-2xl mb-4">
          Búsqueda de Usuarios
        </h1>
        <span className="block w-full h-[3px] bg-sky-950 mb-6" />

        <FieldSet>
          <FieldGroup className="space-y-5">
            <div className="flex gap-3 items-end">
              <Field className="w-1/5">
                <FieldLabel>Buscar por</FieldLabel>
                <Select
                  value={param || "ninguno"}
                  onValueChange={(val) => {
                    const newParam = val === "ninguno" ? null : val;
                    setParam(newParam);
                    if (!newParam) setValue("");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccioná un criterio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ninguno">Todos los usuarios</SelectItem>
                    <SelectItem value="legajo">Legajo</SelectItem>
                    <SelectItem value="dni">DNI</SelectItem>
                    <SelectItem value="nombre">Nombre</SelectItem>
                    <SelectItem value="email_institucional">
                      Email Institucional
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              {param && (
                <Field className="flex-1">
                  <FieldLabel>Valor</FieldLabel>
                  <Input
                    placeholder="Ingresá el valor a buscar"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </Field>
              )}

              <Field className="w-1/6">
                <FieldLabel>Estado</FieldLabel>
                <Select
                  value={
                    status_filter === null
                      ? "todos"
                      : status_filter
                      ? "activo"
                      : "inactivo"
                  }
                  onValueChange={(val) => {
                    if (val === "todos") setStatusFilter(null);
                    else setStatusFilter(val === "activo");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Button
                onClick={handleSearch}
                disabled={loading || (param && !value.trim())}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md"
              >
                {loading ? "Buscando..." : "Buscar"}
              </Button>
            </div>
          </FieldGroup>
        </FieldSet>

        <div className="mt-6">
          {resultados.length === 0 && !loading && !error && (
            <p className="mt-4 text-gray-500 text-center">
              No se encontraron resultados.
            </p>
          )}

          {resultados.length > 0 && (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                <thead className="bg-sky-950 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Legajo
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Nombre
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Apellido
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      DNI
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Email Institucional
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Categoría
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Subcategoría
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.map((usuario, i) => (
                    <tr
                      key={usuario.id_usuario}
                      onClick={() => setUsuarioSeleccionado(usuario)}
                      className={`border-t hover:bg-blue-100 cursor-pointer transition-colors ${
                        i % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-4 py-3 text-sm">{usuario.legajo}</td>
                      <td className="px-4 py-3 text-sm">{usuario.nombre}</td>
                      <td className="px-4 py-3 text-sm">{usuario.apellido}</td>
                      <td className="px-4 py-3 text-sm">{usuario.dni}</td>
                      <td className="px-4 py-3 text-sm">
                        {usuario.email_institucional}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            usuario.status
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {usuario.status ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {usuario.rol?.categoria || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {usuario.rol?.subcategoria || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {error && (
            <PopUp
              title="Error"
              message={error}
              onClose={() => setError(null)}
            />
          )}
        </div>
      </div>

      {usuarioSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-sky-950 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                Información del Usuario - {usuarioSeleccionado.legajo}
              </h2>
              <button
                onClick={() => setUsuarioSeleccionado(null)}
                className="text-white hover:text-gray-300 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <h3 className="text-lg font-semibold mb-4 text-sky-950 border-b pb-2">
                    Datos Personales
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Legajo
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {usuarioSeleccionado.legajo}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        DNI
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {usuarioSeleccionado.dni}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nombre
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {usuarioSeleccionado.nombre}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Apellido
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {usuarioSeleccionado.apellido}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email Personal
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {usuarioSeleccionado.email_personal}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email Institucional
                      </label>
                      <p className="mt-1 text-sm text-gray-900 bg-blue-50 px-2 py-1 rounded">
                        {usuarioSeleccionado.email_institucional}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Teléfono
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {usuarioSeleccionado.telefono_personal}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Fecha de Alta
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {usuarioSeleccionado.fecha_alta
                          ? new Date(
                              usuarioSeleccionado.fecha_alta
                            ).toLocaleString("es-AR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        ID Usuario
                      </label>
                      <p className="mt-1 text-xs text-gray-600 font-mono">
                        {usuarioSeleccionado.id_usuario}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Estado del Usuario
                      </label>
                      <span
                        className={`inline-block mt-1 px-3 py-1 rounded text-xs font-medium ${
                          usuarioSeleccionado.status
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {usuarioSeleccionado.status ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>
                </div>

                {usuarioSeleccionado.rol && (
                  <div className="col-span-2">
                    <h3 className="text-lg font-semibold mb-4 text-sky-950 border-b pb-2">
                      Información del Rol
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          ID Rol
                        </label>
                        <p className="mt-1 text-sm text-gray-900 font-mono text-xs">
                          {usuarioSeleccionado.rol.id_rol}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Categoría
                        </label>
                        <p className="mt-1 text-sm text-gray-900 font-semibold">
                          {usuarioSeleccionado.rol.categoria}
                        </p>
                      </div>
                      {usuarioSeleccionado.rol.subcategoria && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Subcategoría
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            {usuarioSeleccionado.rol.subcategoria}
                          </p>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Sueldo Base
                        </label>
                        <p className="mt-1 text-sm text-gray-900 font-semibold">
                          $
                          {usuarioSeleccionado.rol.sueldo_base?.toLocaleString(
                            "es-AR"
                          ) || "0"}
                        </p>
                      </div>
                      {usuarioSeleccionado.rol.descripcion && (
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Descripción
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            {usuarioSeleccionado.rol.descripcion}
                          </p>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Estado del Rol
                        </label>
                        <span
                          className={`inline-block mt-1 px-3 py-1 rounded text-xs font-medium ${
                            usuarioSeleccionado.rol.status
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {usuarioSeleccionado.rol.status
                            ? "Activo"
                            : "Inactivo"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {usuarioSeleccionado.sueldo && (
                  <div className="col-span-2">
                    <h3 className="text-lg font-semibold mb-4 text-sky-950 border-b pb-2">
                      Información de Sueldo
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          ID Sueldo
                        </label>
                        <p className="mt-1 text-sm text-gray-900 font-mono text-xs">
                          {usuarioSeleccionado.sueldo.id_sueldo}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          CBU
                        </label>
                        <p className="mt-1 text-sm text-gray-900 font-mono">
                          {usuarioSeleccionado.sueldo.cbu}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Porcentaje Adicional
                        </label>
                        <p className="mt-1 text-sm text-gray-900 font-semibold">
                          {usuarioSeleccionado.sueldo.sueldo_adicional}%
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Estado del Sueldo
                        </label>
                        <span
                          className={`inline-block mt-1 px-3 py-1 rounded text-xs font-medium ${
                            usuarioSeleccionado.sueldo.status
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {usuarioSeleccionado.sueldo.status
                            ? "Activo"
                            : "Inactivo"}
                        </span>
                      </div>
                      {usuarioSeleccionado.sueldo.observaciones && (
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Observaciones
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            {usuarioSeleccionado.sueldo.observaciones}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {usuarioSeleccionado.carrera && (
                  <div className="col-span-2">
                    <h3 className="text-lg font-semibold mb-4 text-sky-950 border-b pb-2">
                      Carrera Asignada
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Carrera
                        </label>
                        <p className="mt-1 text-sm text-gray-900 font-semibold">
                          {cargandoCarrera
                            ? "Cargando..."
                            : nombreCarrera || "No encontrada"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Estado de la Carrera
                        </label>
                        <span
                          className={`inline-block mt-1 px-3 py-1 rounded text-xs font-medium ${
                            usuarioSeleccionado.carrera.status
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {usuarioSeleccionado.carrera.status
                            ? "Activo"
                            : "Inactivo"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => setUsuarioSeleccionado(null)}
                  className="bg-sky-950 hover:bg-sky-900 text-white px-6 py-2"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
