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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import PopUp from "@/components/PopUp";
import { useState, useEffect } from "react";
import { altaClase, obtenerClasesPorCurso, modificarClase, bajaClase, cambiarEstadoClase } from "@/api/clasesApi";

export default function GestionClases({ id_curso }) {
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    fecha_clase: null,
    tipo: "regular",
    estado: "programada",
    observaciones: "",
  });
  const [clases, setClases] = useState([]);
  const [editingClase, setEditingClase] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id_curso) {
      cargarClases();
    }
  }, [id_curso]);

  const cargarClases = async () => {
    setLoading(true);
    try {
      const response = await obtenerClasesPorCurso(id_curso, true);
      setClases(response);
    } catch (err) {
      console.error("Error al cargar clases:", err);
      setError("Error al cargar las clases del curso.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo || !form.fecha_clase) {
      setError("Por favor, completá todos los campos obligatorios.");
      return;
    }

    try {
      if (editingClase) {
        await modificarClase(editingClase.id_clase, {
          titulo: form.titulo.trim(),
          descripcion: form.descripcion || null,
          fecha_clase: form.fecha_clase,
          tipo: form.tipo,
          estado: form.estado,
          observaciones: form.observaciones || null,
        });
      } else {
        await altaClase({
          id_curso: id_curso,
          titulo: form.titulo.trim(),
          descripcion: form.descripcion || null,
          fecha_clase: form.fecha_clase,
          tipo: form.tipo,
          estado: form.estado,
          observaciones: form.observaciones || null,
        });
      }
      await cargarClases();
      cleanForm();
    } catch (err) {
      console.error("Error al guardar clase:", err);
      const errorMessage = err.response?.data?.detail || err.message || "Error al guardar la clase";
      setError(errorMessage);
    }
  };

  const handleEdit = (clase) => {
    setEditingClase(clase);
    setForm({
      titulo: clase.titulo || "",
      descripcion: clase.descripcion || "",
      fecha_clase: clase.fecha_clase ? new Date(clase.fecha_clase) : null,
      tipo: clase.tipo || "regular",
      estado: clase.estado || "programada",
      observaciones: clase.observaciones || "",
    });
  };

  const handleDelete = async (id_clase) => {
    if (!confirm("¿Estás seguro de que querés eliminar esta clase?")) return;
    try {
      await bajaClase(id_clase);
      await cargarClases();
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Error al eliminar la clase");
    }
  };

  const handleCambiarEstado = async (id_clase, nuevo_estado) => {
    try {
      await cambiarEstadoClase(id_clase, nuevo_estado);
      await cargarClases();
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Error al cambiar el estado");
    }
  };

  const cleanForm = () => {
    setForm({
      titulo: "",
      descripcion: "",
      fecha_clase: null,
      tipo: "regular",
      estado: "programada",
      observaciones: "",
    });
    setEditingClase(null);
  };

  return (
    <div className="flex flex-col w-full items-start justify-start mt-6 py-4">
      <div className="w-full max-w-4xl">
        <h1 className="font-bold text-start text-xl mb-4 text-black">
          Gestión de Clases del Curso
        </h1>
        <span className="block w-full h-[2px] bg-sky-950 mb-6"></span>

        {/* Formulario de clase */}
        <form onSubmit={handleSubmit} className="mb-6">
          <FieldSet>
            <FieldGroup className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field>
                  <FieldLabel>
                    Título <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="titulo"
                    placeholder="Título de la clase"
                    value={form.titulo}
                    onChange={(e) =>
                      setForm({ ...form, titulo: e.target.value })
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel>
                    Fecha <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {form.fecha_clase ? (
                          format(form.fecha_clase, "PPP")
                        ) : (
                          <span>Seleccioná una fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={form.fecha_clase}
                        onSelect={(date) => setForm({ ...form, fecha_clase: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field>
                  <FieldLabel>Tipo</FieldLabel>
                  <Select
                    value={form.tipo}
                    onValueChange={(value) =>
                      setForm({ ...form, tipo: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="parcial">Parcial</SelectItem>
                      <SelectItem value="final">Final</SelectItem>
                      <SelectItem value="trabajo_practico">Trabajo Práctico</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Estado</FieldLabel>
                  <Select
                    value={form.estado}
                    onValueChange={(value) =>
                      setForm({ ...form, estado: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="programada">Programada</SelectItem>
                      <SelectItem value="dictada">Dictada</SelectItem>
                      <SelectItem value="reprogramada">Reprogramada</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field>
                <FieldLabel>Descripción</FieldLabel>
                <Input
                  id="descripcion"
                  placeholder="Descripción de la clase (opcional)"
                  value={form.descripcion}
                  onChange={(e) =>
                    setForm({ ...form, descripcion: e.target.value })
                  }
                />
              </Field>

              <Field>
                <FieldLabel>Observaciones</FieldLabel>
                <Input
                  id="observaciones"
                  placeholder="Observaciones (opcional)"
                  value={form.observaciones}
                  onChange={(e) =>
                    setForm({ ...form, observaciones: e.target.value })
                  }
                />
              </Field>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md"
                >
                  {editingClase ? "Actualizar Clase" : "Agregar Clase"}
                </Button>
                {editingClase && (
                  <Button
                    type="button"
                    onClick={cleanForm}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-2 rounded-md"
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </FieldGroup>
          </FieldSet>
        </form>

        {/* Lista de clases */}
        {loading ? (
          <p className="text-gray-500">Cargando clases...</p>
        ) : clases.length > 0 ? (
          <div className="mt-6 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clases.map((clase) => (
                  <TableRow key={clase.id_clase}>
                    <TableCell>{clase.titulo}</TableCell>
                    <TableCell>
                      {clase.fecha_clase ? format(new Date(clase.fecha_clase), "dd/MM/yyyy") : "-"}
                    </TableCell>
                    <TableCell>{clase.tipo}</TableCell>
                    <TableCell>
                      <Select
                        value={clase.estado}
                        onValueChange={(nuevo_estado) =>
                          handleCambiarEstado(clase.id_clase, nuevo_estado)
                        }
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="programada">Programada</SelectItem>
                          <SelectItem value="dictada">Dictada</SelectItem>
                          <SelectItem value="reprogramada">Reprogramada</SelectItem>
                          <SelectItem value="cancelada">Cancelada</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(clase)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                        >
                          Editar
                        </Button>
                        <Button
                          onClick={() => handleDelete(clase.id_clase)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
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
        ) : (
          <p className="mt-4 text-gray-500">No hay clases registradas para este curso.</p>
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

