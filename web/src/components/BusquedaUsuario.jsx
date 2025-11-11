import { buscarUsuarios, obtenerUsuarios } from "@/api/usuariosApi";
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
import { useState } from "react";
import PopUp from "./PopUp";

export default function BusquedaUsuario() {
    const [param, setParam] = useState("id");
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
            const response = await buscarUsuarios(param, value, 0, 100, status_filter);
            setResultados(response);
        } catch (err) {
            setError(err.response?.data?.detail || err.message || "Error al buscar usuarios");
            setResultados([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadAll = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await obtenerUsuarios(0, 100, status_filter);
            setResultados(response);
        } catch (err) {
            setError(err.response?.data?.detail || err.message || "Error al cargar usuarios");
            setResultados([]);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flex flex-col w-full min-h-screen items-start justify-start mt-6 py-4 sm:px-8">
            <div className="w-full max-w-4xl">
                <h1 className="font-bold text-start text-xl mb-4 text-black">
                    Búsqueda de Usuarios
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
                                        <SelectItem value="id">ID</SelectItem>
                                        <SelectItem value="legajo">Legajo</SelectItem>
                                        <SelectItem value="dni">DNI</SelectItem>
                                        <SelectItem value="nombre">Nombre</SelectItem>
                                        <SelectItem value="email_institucional">Email Institucional</SelectItem>
                                        <SelectItem value="email_personal">Email Personal</SelectItem>
                                        <SelectItem value="status">Estado</SelectItem>
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
                                    <TableHead>ID</TableHead>
                                    <TableHead>Legajo</TableHead>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Apellido</TableHead>
                                    <TableHead>DNI</TableHead>
                                    <TableHead>Email Institucional</TableHead>
                                    <TableHead>Email Personal</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead>Subcategoría</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {resultados.map((usuario) => (
                                    <TableRow key={usuario.id_usuario}>
                                        <TableCell>{usuario.id_usuario}</TableCell>
                                        <TableCell>{usuario.legajo || "-"}</TableCell>
                                        <TableCell>{usuario.nombre}</TableCell>
                                        <TableCell>{usuario.apellido}</TableCell>
                                        <TableCell>{usuario.dni || "-"}</TableCell>
                                        <TableCell>{usuario.email_institucional || "-"}</TableCell>
                                        <TableCell>{usuario.email_personal || "-"}</TableCell>
                                        <TableCell>{usuario.rol?.categoria || "-"}</TableCell>
                                        <TableCell>{usuario.rol?.subcategoria || "-"}</TableCell>
                                        <TableCell>
                                            {usuario.status !== false ? (
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