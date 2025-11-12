import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PopUp from "@/components/PopUp";
import { obtenerRoles, altaRol, modificarRol, bajaRol } from "@/api/rolesApi";

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("activo");
  const [showForm, setShowForm] = useState(false);
  const [editingRol, setEditingRol] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    categoria: "",
    subcategoria: "",
    sueldo_base: "",
    descripcion: "",
  });

  const normalizeResponse = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.roles)) return data.roles;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filter =
        statusFilter === "todos" ? null : statusFilter === "activo";
      const data = await obtenerRoles(filter);
      const normalized = normalizeResponse(data);
      setRoles(normalized);
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        "Ocurrió un error al cargar los roles.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "0";
    const num = typeof value === "string" ? Number(value) : value;
    if (Number.isNaN(num)) return String(value);
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleEdit = (rol) => {
    setEditingRol(rol);
    setForm({
      categoria: rol.categoria || "",
      subcategoria: rol.subcategoria || "",
      sueldo_base: rol.sueldo_base || "",
      descripcion: rol.descripcion || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (rol) => {
    if (!window.confirm(`¿Está seguro de eliminar el rol ${rol.categoria}?`)) {
      return;
    }
    try {
      await bajaRol(rol.id_rol);
      await fetchRoles();
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        "Error al eliminar el rol.";
      setError(message);
    }
  };

  const handleCreate = () => {
    setEditingRol(null);
    setForm({
      categoria: "",
      subcategoria: "",
      sueldo_base: "",
      descripcion: "",
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRol(null);
    setForm({
      categoria: "",
      subcategoria: "",
      sueldo_base: "",
      descripcion: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        categoria: form.categoria,
        subcategoria: form.subcategoria || null,
        sueldo_base: parseFloat(form.sueldo_base) || 0,
        descripcion: form.descripcion || null,
      };

      if (editingRol) {
        await modificarRol(editingRol.id_rol, payload);
      } else {
        await altaRol(payload);
      }

      await fetchRoles();
      handleCancel();
    } catch (err) {
      const message =
        err.response?.data?.detail || err.message || "Error al guardar el rol.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white shadow-lg rounded-2xl flex flex-col items-center p-4 mt-4">
      <div className="w-full max-w-6xl">
        <h1 className="font-bold text-center text-2xl mb-4">Roles</h1>
        <span className="block w-full h-[3px] bg-sky-950"></span>

        {/* Status Filter Dropdown */}
        <div className="flex items-center gap-4 mt-6 mb-4">
          <Field>
            <FieldLabel>Estado</FieldLabel>
            <Select
              value={statusFilter}
              onValueChange={(val) => setStatusFilter(val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
                <SelectItem value="todos">Todos</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="overflow-x-auto mt-4">
          <Table className="min-w-full border rounded-lg shadow-sm ">
            <TableHeader>
              <TableRow>
                <TableHead>Categoría</TableHead>
                <TableHead>Subcategoría</TableHead>
                <TableHead>Sueldo base</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading && roles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    No hay roles disponibles.
                  </TableCell>
                </TableRow>
              )}

              {loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Cargando roles...
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                roles.map((rol, idx) => (
                  <TableRow
                    key={
                      rol.id_rol ??
                      `${rol.categoria}-${rol.subcategoria ?? "-"}-${idx}`
                    }
                    className="hover:bg-gray-50"
                  >
                    <TableCell>{rol.categoria ?? "-"}</TableCell>
                    <TableCell>{rol.subcategoria ?? "-"}</TableCell>
                    <TableCell>{formatCurrency(rol.sueldo_base)}</TableCell>
                    <TableCell>{rol.descripcion ?? "-"}</TableCell>
                    <TableCell>
                      {rol.status !== false ? (
                        <span className="text-green-600">Activo</span>
                      ) : (
                        <span className="text-red-600">Inactivo</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2 justify-center">
                        <Button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                          onClick={() => handleEdit(rol)}
                        >
                          Editar
                        </Button>
                        <Button
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                          onClick={() => handleDelete(rol)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Crear Button */}
        {!showForm && (
          <Button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-6"
            onClick={handleCreate}
          >
            Crear
          </Button>
        )}

        {/* Form for Create/Edit */}
        {showForm && (
          <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
            <h2 className="font-bold text-xl mb-4">
              {editingRol ? "Editar Rol" : "Agregar Rol"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <Field className="flex-1">
                  <FieldLabel>
                    Categoría <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select
                    value={form.categoria}
                    onValueChange={(val) =>
                      setForm({ ...form, categoria: val })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMINISTRADOR">
                        ADMINISTRADOR
                      </SelectItem>
                      <SelectItem value="DOCENTE">DOCENTE</SelectItem>
                      <SelectItem value="ALUMNO">ALUMNO</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field className="flex-1">
                  <FieldLabel>Subcategoría</FieldLabel>
                  <Input
                    type="text"
                    value={form.subcategoria}
                    onChange={(e) =>
                      setForm({ ...form, subcategoria: e.target.value })
                    }
                    placeholder="Subcategoría (opcional)"
                  />
                </Field>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <Field className="flex-1">
                  <FieldLabel>
                    Sueldo Base <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    type="number"
                    step="0.01"
                    value={form.sueldo_base}
                    onChange={(e) =>
                      setForm({ ...form, sueldo_base: e.target.value })
                    }
                    placeholder="0.00"
                    required
                  />
                </Field>

                <Field className="flex-1">
                  <FieldLabel>Descripción</FieldLabel>
                  <Input
                    type="text"
                    value={form.descripcion}
                    onChange={(e) =>
                      setForm({ ...form, descripcion: e.target.value })
                    }
                    placeholder="Descripción (opcional)"
                  />
                </Field>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-70"
                >
                  {isSubmitting
                    ? "Guardando..."
                    : editingRol
                    ? "Actualizar"
                    : "Agregar"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}

        {error && (
          <PopUp
            title={"Error"}
            message={String(error)}
            onClose={() => setError(null)}
          />
        )}
      </div>
    </div>
  );
}
