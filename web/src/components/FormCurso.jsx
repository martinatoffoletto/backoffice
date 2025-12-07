import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { buscarEspacios } from "@/api/espaciosApi";

export default function FormCurso({
  form,
  setForm,
  onSubmit,
  onCancel,
  showCancel = false,
  isModificacion = false,
  filteredMaterias = [],
  filteredSedes = [],
  camposConError = new Set(),
  setCamposConError = () => {},
  setError = () => {},
}) {
  const [aulas, setAulas] = useState([]);
  const [loadingAulas, setLoadingAulas] = useState(false);
  const [aulaSearch, setAulaSearch] = useState("");

  useEffect(() => {
    const fetchAulas = async () => {
      try {
        setLoadingAulas(true);
        const response = await buscarEspacios("tipo", "AULA", 0, 100);
        setAulas(response || []);
      } catch (error) {
        console.error("Error al cargar aulas:", error);
        setAulas([]);
      } finally {
        setLoadingAulas(false);
      }
    };
    fetchAulas();
  }, []);

  const filteredAulas = aulas.filter((aula) =>
    aula.nombre?.toLowerCase().includes(aulaSearch.toLowerCase().trim())
  );

  return (
    <form onSubmit={onSubmit} className="mt-8">
      <FieldSet>
        <FieldGroup>
          {/* Materia y Sede - Solo si NO es modificación */}
          {!isModificacion && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              {/* Materia */}
              <Field>
                <FieldLabel>
                  Materia <span className="text-red-500">*</span>
                </FieldLabel>
                <Select
                  value={form.uuid_materia}
                  onValueChange={(value) => {
                    setForm((prev) => ({ ...prev, uuid_materia: value }));
                    if (camposConError.has("uuid_materia")) {
                      const nuevosErrores = new Set(camposConError);
                      nuevosErrores.delete("uuid_materia");
                      setCamposConError(nuevosErrores);
                      if (nuevosErrores.size === 0) setError(null);
                    }
                  }}
                >
                  <SelectTrigger
                    className={`w-full ${
                      camposConError.has("uuid_materia")
                        ? "ring-2 ring-orange-500 ring-offset-2"
                        : ""
                    }`}
                  >
                    <SelectValue placeholder="Seleccione materia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Materias</SelectLabel>
                      {filteredMaterias.map((materia) => (
                        <SelectItem
                          key={
                            materia.id_materia ||
                            materia.uuid_materia ||
                            materia.id
                          }
                          value={
                            materia.id_materia ||
                            materia.uuid_materia ||
                            materia.id
                          }
                        >
                          {materia.nombre}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              {/* Sede */}
              <Field>
                <FieldLabel>
                  Sede <span className="text-red-500">*</span>
                </FieldLabel>
                <Select
                  value={form.sede}
                  onValueChange={(value) => {
                    setForm((prev) => ({ ...prev, sede: value }));
                    if (camposConError.has("sede")) {
                      const nuevosErrores = new Set(camposConError);
                      nuevosErrores.delete("sede");
                      setCamposConError(nuevosErrores);
                      if (nuevosErrores.size === 0) setError(null);
                    }
                  }}
                >
                  <SelectTrigger
                    className={`w-full ${
                      camposConError.has("sede")
                        ? "ring-2 ring-orange-500 ring-offset-2"
                        : ""
                    }`}
                  >
                    <SelectValue placeholder="Seleccione sede" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Sedes</SelectLabel>
                      {filteredSedes && filteredSedes.length > 0 ? (
                        filteredSedes.map((sede) => (
                          <SelectItem
                            key={sede.id_sede || sede.id}
                            value={sede.id_sede || sede.id}
                          >
                            {sede.nombre}
                          </SelectItem>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400 px-2">
                          No hay sedes disponibles
                        </p>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          )}

          {/* Primera fila - 2 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field>
              <FieldLabel htmlFor="examen">
                Examen<span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="examen"
                value={form.examen}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, examen: e.target.value }))
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="comision">
                Comisión<span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="comision"
                value={form.comision}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, comision: e.target.value }))
                }
              />
            </Field>
          </div>

          {/* Segunda fila - 1 columna */}
          <div className="grid grid-cols-1 gap-5 mt-2">
            <Field>
              <FieldLabel htmlFor="modalidad">
                Modalidad<span className="text-red-500">*</span>
              </FieldLabel>
              <Select
                value={form.modalidad}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, modalidad: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione modalidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Modalidad</SelectLabel>
                    <SelectItem value="PRESENCIAL">Presencial</SelectItem>
                    <SelectItem value="VIRTUAL">Virtual</SelectItem>
                    <SelectItem value="HÍBRIDA">Híbrida</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>

          {/* Tercera fila - 2 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
            <Field>
              <FieldLabel htmlFor="dia">
                Día<span className="text-red-500">*</span>
              </FieldLabel>
              <Select
                value={form.dia}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, dia: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione día" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Día de cursada</SelectLabel>
                    <SelectItem value="LUNES">Lunes</SelectItem>
                    <SelectItem value="MARTES">Martes</SelectItem>
                    <SelectItem value="MIERCOLES">Miércoles</SelectItem>
                    <SelectItem value="JUEVES">Jueves</SelectItem>
                    <SelectItem value="VIERNES">Viernes</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="aula">
                Aula<span className="text-red-500">*</span>
              </FieldLabel>
              <Select
                value={form.aula}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, aula: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingAulas ? "Cargando aulas..." : "Seleccione aula"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2">
                    <Input
                      placeholder="Buscar aula..."
                      value={aulaSearch}
                      onChange={(e) => setAulaSearch(e.target.value)}
                      className="mb-2"
                    />
                  </div>
                  <SelectGroup>
                    <SelectLabel>Aulas disponibles</SelectLabel>
                    {filteredAulas.length > 0 ? (
                      filteredAulas.map((aula) => (
                        <SelectItem key={aula.nombre} value={aula.nombre}>
                          {aula.nombre}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-gray-500">
                        {loadingAulas
                          ? "Cargando..."
                          : "No se encontraron aulas"}
                      </div>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>

          {/* Cuarta fila - 2 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
            <Field>
              <FieldLabel htmlFor="periodo">
                Período<span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="periodo"
                value={form.periodo}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, periodo: e.target.value }))
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="turno">
                Turno<span className="text-red-500">*</span>
              </FieldLabel>
              <Select
                value={form.turno}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, turno: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione turno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Turno</SelectLabel>
                    <SelectItem value="Mañana">Mañana</SelectItem>
                    <SelectItem value="Tarde">Tarde</SelectItem>
                    <SelectItem value="Noche">Noche</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>

          {/* Quinta fila - 3 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-2">
            <Field>
              <FieldLabel htmlFor="estado">
                Estado<span className="text-red-500">*</span>
              </FieldLabel>
              <Select
                value={form.estado}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, estado: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Estado</SelectLabel>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="cerrado">Cerrado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="cantidad_max">
                Cantidad Máxima<span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                type="number"
                id="cantidad_max"
                value={form.cantidad_max}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    cantidad_max: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="cantidad_min">
                Cantidad Mínima<span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                type="number"
                id="cantidad_min"
                value={form.cantidad_min}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    cantidad_min: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </Field>
          </div>

          {/* Sexta fila - 2 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
            <Field>
              <FieldLabel htmlFor="desde">
                Desde<span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                type="datetime-local"
                id="desde"
                value={form.desde}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, desde: e.target.value }))
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="hasta">
                Hasta<span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                type="datetime-local"
                id="hasta"
                value={form.hasta}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, hasta: e.target.value }))
                }
              />
            </Field>
          </div>

          {/* Botones */}
          <div className="flex justify-center gap-4 mt-5">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md"
            >
              Guardar
            </Button>
            {showCancel && (
              <Button
                type="button"
                onClick={onCancel}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold px-6 py-2 rounded-md"
              >
                Cancelar
              </Button>
            )}
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
