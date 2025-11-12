import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import PopUp from "@/components/PopUp";
import { useState } from "react";
import { buscarParametros, obtenerParametros } from "@/api/preciosApi";

export default function BusquedaParametro() {
  const [param, setParam] = useState("nombre");
  const [value, setValue] = useState("");
  const [status_filter, setStatusFilter] = useState(null);
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!value.trim()) {
      setError("Por favor, ingresá un valor para buscar.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await buscarParametros(param, value);
      setResultados(response);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Error al buscar parámetros");
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await obtenerParametros(0, 100, status_filter);
      setResultados(response);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Error al cargar parámetros");
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen items-start justify-start mt-6 py-4 sm:px-8">
      <div className="w-full max-w-4xl">
        <h1 className="font-bold text-start text-xl mb-4 text-black">
          Búsqueda de Parámetros
        </h1>
        <span className="block w-full h-[2px] bg-sky-950 mb-6"></span>

        <FieldSet>
          <FieldGroup className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Field>
                <FieldLabel>Buscar por</FieldLabel>
                <Select value={param} onValueChange={setParam}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nombre">Nombre</SelectItem>
                    <SelectItem value="tipo">Tipo</SelectItem>
                    <SelectItem value="id">ID</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Valor</FieldLabel>
                <Input
                  placeholder="Ingresá el valor a buscar"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel>Estado</FieldLabel>
                <Select
                  value={status_filter === null ? "todos" : status_filter ? "activo" : "inactivo"}
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
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleSearch}
                disabled={loading || !value.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md"
              >
                {loading ? "Buscando..." : "Buscar"}
              </Button>
              <Button
                onClick={handleLoadAll}
                disabled={loading}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-6 py-2 rounded-md"
              >
                {loading ? "Cargando..." : "Cargar Todos"}
              </Button>
            </div>
          </FieldGroup>
        </FieldSet>

        {resultados.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor Numérico</TableHead>
                  <TableHead>Valor Texto</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resultados.map((parametro) => (
                  <TableRow key={parametro.id_parametro}>
                    <TableCell>{parametro.nombre}</TableCell>
                    <TableCell>{parametro.tipo}</TableCell>
                    <TableCell>{parametro.valor_numerico || "-"}</TableCell>
                    <TableCell>{parametro.valor_texto || "-"}</TableCell>
                    <TableCell>
                      {parametro.status !== false ? (
                        <span className="text-green-600">Activo</span>
                      ) : (
                        <span className="text-red-600">Inactivo</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {resultados.length === 0 && !loading && !error && (
          <p className="mt-4 text-gray-500">No se encontraron resultados.</p>
        )}
      </div>

      {error && (
        <PopUp
          title="Error"
          message={error}
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
}

