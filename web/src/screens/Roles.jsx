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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PopUp from "@/components/PopUp";
import ConfirmDialog from "@/components/ConfirmDialog";
import { obtenerRoles, altaRol, modificarRol, bajaRol } from "@/api/rolesApi";

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("activo");
  const [showForm, setShowForm] = useState(false);
  const [editingRol, setEditingRol] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);
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
      subcategoria: rol.subcategoria
        ? String(rol.subcategoria).toUpperCase()
        : "",
      sueldo_base: rol.sueldo_base || "",
      descripcion: rol.descripcion || "",
    });
    setShowForm(true);
  };

  const handleDelete = (rol) => {
    setConfirmDialog({
      title: "Confirmar eliminación",
      message: `¿Está seguro de eliminar el rol ${rol.categoria}${
        rol.subcategoria ? ` - ${rol.subcategoria}` : ""
      }?`,
      confirmText: "Eliminar",
      onConfirm: async () => {
        try {
          await bajaRol(rol.id_rol);
          await fetchRoles();

          // Mostrar éxito en el mismo modal
          setConfirmDialog({
            title: "Operación exitosa",
            message: "Rol eliminado correctamente.",
            confirmText: "Aceptar",
            hideCancel: true,
            onConfirm: () => {
              setConfirmDialog(null);
            },
          });

          // Cerrar el modal automáticamente después de 1.5 segundos
          setTimeout(() => {
            setConfirmDialog(null);
          }, 1500);
        } catch (err) {
          const message =
            err.response?.data?.detail ||
            err.message ||
            "Error al eliminar el rol.";
          setError(message);
          setConfirmDialog(null);
        }
      },
    });
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
      const normalize = (s) =>
        s === null || s === undefined ? "" : String(s).trim().toLowerCase();
      const newCat = normalize(form.categoria);
      const newSub = normalize(form.subcategoria || "");
      const duplicate = roles.find((r) => {
        const rc = normalize(r.categoria);
        const rs = normalize(r.subcategoria || "");
        if (editingRol) {
          return (
            r.id_rol !== editingRol.id_rol && rc === newCat && rs === newSub
          );
        }
        return rc === newCat && rs === newSub;
      });

      if (duplicate) {
        setError("Ya existe un rol con la misma categoría y subcategoría.");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        categoria: form.categoria,
        subcategoria: form.subcategoria
          ? String(form.subcategoria).toUpperCase()
          : null,
        sueldo_base: parseFloat(form.sueldo_base) || 0,
        descripcion: form.descripcion || null,
      };

      const isEdit = Boolean(editingRol);

      setConfirmDialog({
        title: isEdit ? "Confirmar actualización" : "Confirmar creación",
        message: `¿Confirmás ${isEdit ? "actualizar" : "crear"} el rol ${
          form.categoria
        }${form.subcategoria ? ` - ${form.subcategoria}` : ""}?`,
        confirmText: isEdit ? "Actualizar" : "Crear",
        onConfirm: async () => {
          try {
            if (isEdit) {
              await modificarRol(editingRol.id_rol, payload);
            } else {
              await altaRol(payload);
            }

            await fetchRoles();

            // Mostrar éxito en el mismo modal
            setConfirmDialog({
              title: "Operación exitosa",
              message: isEdit
                ? "Rol actualizado correctamente."
                : "Rol creado correctamente.",
              confirmText: "Aceptar",
              hideCancel: true,
              onConfirm: () => {
                setConfirmDialog(null);
              },
            });

            // Cerrar el modal automáticamente después de 1.5 segundos
            setTimeout(() => {
              setConfirmDialog(null);
            }, 1500);

            handleCancel();
          } catch (err) {
            const message =
              err.response?.data?.detail ||
              err.message ||
              "Error al guardar el rol.";
            setError(message);
            setConfirmDialog(null);
          }
        },
      });
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
        {/* Title centered at the top */}
        <div className="w-full text-center mb-6">
          <h1 className="font-bold text-2xl mb-2">Gestión de roles</h1>
          <span className="block w-full h-[3px] bg-sky-950"></span>
        </div>

        {/* Status Filter Dropdown aligned to the right */}
        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="statusFilter" className="text-sm font-semibold">
              Estado
            </Label>
            <Select
              value={statusFilter}
              onValueChange={(val) => setStatusFilter(val)}
            >
              <SelectTrigger id="statusFilter" className="min-w-[150px]">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
                <SelectItem value="todos">Todos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <Table className="min-w-full border rounded-lg shadow-sm ">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead>Categoría</TableHead>
                <TableHead>Subcategoría</TableHead>
                <TableHead>Sueldo base</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Estado</TableHead>
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
                    <TableCell>
                      {rol.subcategoria
                        ? String(rol.subcategoria).toUpperCase()
                        : "-"}
                    </TableCell>
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
                        {rol.status === false ? (
                          <div className="w-44">
                            <Button
                              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded w-full"
                              onClick={() => {
                                setConfirmDialog({
                                  title: "Confirmar activación",
                                  message: `¿Confirmás activar el rol ${
                                    rol.categoria
                                  }${
                                    rol.subcategoria
                                      ? ` - ${rol.subcategoria}`
                                      : ""
                                  }?`,
                                  confirmText: "Activar",
                                  onConfirm: async () => {
                                    try {
                                      const payload = {
                                        categoria: rol.categoria,
                                        subcategoria: rol.subcategoria
                                          ? String(
                                              rol.subcategoria
                                            ).toUpperCase()
                                          : null,
                                        sueldo_base:
                                          parseFloat(rol.sueldo_base) || 0,
                                        descripcion: rol.descripcion || null,
                                        status: true,
                                      };
                                      await modificarRol(rol.id_rol, payload);
                                      await fetchRoles();

                                      // Mostrar éxito en el mismo modal
                                      setConfirmDialog({
                                        title: "Operación exitosa",
                                        message: "Rol activado correctamente.",
                                        confirmText: "Aceptar",
                                        hideCancel: true,
                                        onConfirm: () => {
                                          setConfirmDialog(null);
                                        },
                                      });

                                      // Cerrar el modal automáticamente después de 1.5 segundos
                                      setTimeout(() => {
                                        setConfirmDialog(null);
                                      }, 1500);
                                    } catch (err) {
                                      const message =
                                        err.response?.data?.detail ||
                                        err.message ||
                                        "Error al activar el rol.";
                                      setError(message);
                                      setConfirmDialog(null);
                                    }
                                  },
                                });
                              }}
                            >
                              Activar
                            </Button>
                          </div>
                        ) : (
                          <div className="w-44 flex gap-2">
                            <Button
                              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded w-1/2"
                              onClick={() => handleEdit(rol)}
                            >
                              Editar
                            </Button>

                            <Button
                              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-1 px-3 rounded border border-gray-300 w-1/2"
                              onClick={() => handleDelete(rol)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        )}
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
            Agregar Rol
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
                {editingRol ? (
                  <>
                    <Field className="flex-1">
                      <FieldLabel>Categoría</FieldLabel>
                      <div className="py-2">{form.categoria || "-"}</div>
                    </Field>

                    {form.categoria === "ADMINISTRADOR" ? (
                      <Field className="flex-1">
                        <FieldLabel>Subcategoría</FieldLabel>
                        <div className="py-2">{form.subcategoria || "-"}</div>
                      </Field>
                    ) : null}
                  </>
                ) : (
                  <>
                    <Field className="flex-1">
                      <FieldLabel>
                        Categoría <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Select
                        value={form.categoria}
                        onValueChange={(val) =>
                          setForm({
                            ...form,
                            categoria: val,
                            // show subcategoria only for ADMINISTRADOR
                            subcategoria:
                              val === "ADMINISTRADOR" ? form.subcategoria : "",
                          })
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

                    {form.categoria === "ADMINISTRADOR" && (
                      <Field className="flex-1">
                        <FieldLabel>Subcategoría</FieldLabel>
                        <Input
                          type="text"
                          value={form.subcategoria}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              subcategoria: String(
                                e.target.value || ""
                              ).toUpperCase(),
                            })
                          }
                          placeholder="Subcategoría (opcional)"
                        />
                      </Field>
                    )}
                  </>
                )}
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
        {confirmDialog && (
          <ConfirmDialog
            title={confirmDialog.title}
            message={confirmDialog.message}
            confirmText={confirmDialog.confirmText}
            hideCancel={confirmDialog.hideCancel}
            onConfirm={async () => {
              const currentDialog = confirmDialog;
              if (currentDialog.hideCancel) {
                // Si es el modal de éxito, solo ejecutar el callback
                currentDialog.onConfirm?.();
                return;
              }
              setConfirmDialog((prev) =>
                prev ? { ...prev, loading: true } : prev
              );
              try {
                await currentDialog.onConfirm?.();
              } finally {
                // No cerrar aquí, el onConfirm interno lo maneja
              }
            }}
            onCancel={() => setConfirmDialog(null)}
            loading={Boolean(confirmDialog.loading)}
          />
        )}
      </div>
    </div>
  );
}
