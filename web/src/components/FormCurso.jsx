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
import { obtenerMaterias } from "@/api/materiasApi";
import { obtenerSedes } from "@/api/sedesApi";
import {  obtenerDocentesDisponibles } from "@/api/docentesApi";

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

  const [materias, setMaterias] = useState([]);
  const [loadingMaterias, setLoadingMaterias] = useState(false);
  const [materiaSearch, setMateriaSearch] = useState("");

  const [sedes, setSedes] = useState([]);
  const [loadingSedes, setLoadingSedes] = useState(false);
  const [sedeSearch, setSedeSearch] = useState("");

  const [docentesDisponibles, setDocentesDisponibles] = useState([]);
  const [loadingDocentes, setLoadingDocentes] = useState(false);

  const [materia, setMateria] = useState(null);
  const [dia, setDia] = useState(null);
  const [turno, setTurno] = useState(null);
  const [sede, setSede]=useState(null);
  const [modalidad, setModalidad]=useState(null);

  const filteredMateriasList = materias.filter((materia) =>
    materia.nombre?.toLowerCase().includes(materiaSearch.toLowerCase().trim())
  );

  const filteredSedesList = sedes.filter((sede) =>
    sede.nombre?.toLowerCase().includes(sedeSearch.toLowerCase().trim())
  );

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

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        setLoadingMaterias(true);
        const data = await obtenerMaterias();
        const limpias = data.filter(
          (m) => m && typeof m === "object" && m.nombre
        );
        setMaterias(limpias);
      } catch (error) {
        console.error("Error al cargar materias:", error);
        setMaterias([]);
      } finally {
        setLoadingMaterias(false);
      }
    };
    fetchMaterias();
  }, []);

  useEffect(() => {
    const fetchSedes = async () => {
      try {
        setLoadingSedes(true);
        const data = await obtenerSedes();
        const limpias = data.filter(
          (s) => s && typeof s === "object" && s.nombre
        );
        setSedes(limpias);
      } catch (error) {
        console.error("Error al cargar sedes:", error);
        setSedes([]);
      } finally {
        setLoadingSedes(false);
      }
    };
    fetchSedes();
  }, []);

  useEffect(() => {
    const fetchDocentes = async () => {
      if (materia && dia && turno && sede && modalidad) {  
        try {
          setLoadingDocentes(true);
          const data = await obtenerDocentesDisponibles({
            subjectId: materia,
            dayOfWeek: dia,
            modality: modalidad,
            shift: turno,
            campuses: sede,
          });
          setDocentesDisponibles(data);
        } catch (error) {
          console.error("Error obteniendo docentes:", error);
          setDocentesDisponibles([]);
        } finally {
          setLoadingDocentes(false);
        }
      } else {
        setDocentesDisponibles([]);
      }
    };

    fetchDocentes();
  }, [materia, dia, turno, sede, modalidad]);


  const handleMateriaSearch = (texto) => {
    setMateriaSearch(texto);
  };

  const handleSedeSearch = (texto) => {
    setSedeSearch(texto);
  };

  const filteredAulas = aulas.filter((aula) =>
    aula.nombre?.toLowerCase().includes(aulaSearch.toLowerCase().trim())
  );

  return (
    <form onSubmit={onSubmit} className="mt-8">
      <FieldSet>
        <FieldGroup>
          {!isModificacion && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <Field>
                <FieldLabel>
                  Materia <span className="text-red-500">*</span>
                </FieldLabel>
                <Select
                  value={form.uuid_materia || ""}
                  onValueChange={(value) => {
                    setMateria(value);
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
                    <SelectValue
                      placeholder={
                        loadingMaterias
                          ? "Cargando materias..."
                          : "Seleccione materia"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <Input
                        placeholder="Buscar materia..."
                        value={materiaSearch}
                        onChange={(e) => handleMateriaSearch(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                    <SelectGroup>
                      <SelectLabel>Materias</SelectLabel>
                      {filteredMateriasList.length > 0 ? (
                        filteredMateriasList.map((materia) => (
                          <SelectItem
                            key={
                              materia.uuid || materia.id_materia || materia.id
                            }
                            value={
                              materia.uuid || materia.id_materia || materia.id
                            }
                          >
                            {materia.nombre}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1.5 text-sm text-gray-500">
                          {loadingMaterias
                            ? "Cargando..."
                            : "No se encontraron materias"}
                        </div>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>
                  Sede <span className="text-red-500">*</span>
                </FieldLabel>
                <Select
                  value={form.sede || ""}
                  onValueChange={(value) => {
                    setSede(value);
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
                    <SelectValue
                      placeholder={
                        loadingSedes ? "Cargando sedes..." : "Seleccione sede"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <Input
                        placeholder="Buscar sede..."
                        value={sedeSearch}
                        onChange={(e) => handleSedeSearch(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                    <SelectGroup>
                      <SelectLabel>Sedes</SelectLabel>
                      {filteredSedesList.length > 0 ? (
                        filteredSedesList.map((sede) => (
                          <SelectItem key={sede.nombre} value={sede.nombre}>
                            {sede.nombre}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1.5 text-sm text-gray-500">
                          {loadingSedes
                            ? "Cargando..."
                            : "No se encontraron sedes"}
                        </div>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          )}

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

          <div className="grid grid-cols-1 gap-5 mt-2">
            <Field>
              <FieldLabel htmlFor="modalidad">
                Modalidad<span className="text-red-500">*</span>
              </FieldLabel>
              <Select
                value={form.modalidad}
                onValueChange={(value) =>{
                  setModalidad(value);
                  setForm((prev) => ({ ...prev, modalidad: value }))
                }
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
            <Field>
              <FieldLabel htmlFor="dia">
                Día<span className="text-red-500">*</span>
              </FieldLabel>
              <Select
                value={form.dia}
                onValueChange={(value) =>{
                  setDia(value);
                  setForm((prev) => ({ ...prev, dia: value }))
                }
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
            <Field>
              <FieldLabel htmlFor="periodo">
                Período<span className="text-red-500">*</span>
              </FieldLabel>
              <Select
                value={form.periodo}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, periodo: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Período</SelectLabel>
                    <SelectItem value="Primer cuatrimestre">
                      Primer cuatrimestre
                    </SelectItem>
                    <SelectItem value="Segundo cuatrimestre">
                      Segundo cuatrimestre
                    </SelectItem>
                    <SelectItem value="Intensiva">Intensiva</SelectItem>
                    <SelectItem value="Verano">Verano</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="turno">
                Turno<span className="text-red-500">*</span>
              </FieldLabel>
              <Select
                value={form.turno}
                onValueChange={(value) =>{
                  setTurno(value);
                  setForm((prev) => ({ ...prev, turno: value }))
                }
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione turno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Turno</SelectLabel>
                    <SelectItem value="MAÑANA">Mañana</SelectItem>
                    <SelectItem value="TARDE">Tarde</SelectItem>
                    <SelectItem value="NOCHE">Noche</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>

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
          </div>

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

          {!isModificacion && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
              <Field>
                <FieldLabel>
                  Docente Titular <span className="text-red-500">*</span>
                </FieldLabel>
                <Select
                  value={form.titular_uuid || ""}
                  onValueChange={(value) => {
                    setForm((prev) => ({ ...prev, titular_uuid: value }));
                    if (camposConError.has("inscripciones_iniciales")) {
                      const nuevosErrores = new Set(camposConError);
                      nuevosErrores.delete("inscripciones_iniciales");
                      setCamposConError(nuevosErrores);
                      if (nuevosErrores.size === 0) setError(null);
                    }
                  }}
                  disabled={!materia || !dia || !turno || !sede || !modalidad || loadingDocentes}

                >
                  <SelectTrigger
                    className={`w-full ${
                      camposConError.has("inscripciones_iniciales")
                        ? "ring-2 ring-orange-500 ring-offset-2"
                        : ""
                    }`}
                  >
                    <SelectValue
                      placeholder={
                        loadingDocentes
                          ? "Cargando docentes..."
                          : !form.uuid_materia || !form.dia
                          ? "Seleccione materia y día primero"
                          : "Seleccione titular"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Docentes Disponibles</SelectLabel>
                      {docentesDisponibles.length === 0 ? (
                        <SelectItem value="_no_disponibles" disabled>
                          No hay docentes disponibles
                        </SelectItem>
                      ) : (
                        docentesDisponibles.map((docente) => (
                          <SelectItem key={docente.uuid} value={docente.uuid}>
                            {docente.nombre} {docente.apellido}
                          </SelectItem>
                        ))
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>
                  Docente Auxiliar <span className="text-red-500">*</span>
                </FieldLabel>
                <Select
                  value={form.auxiliar_uuid || ""}
                  onValueChange={(value) => {
                    setForm((prev) => ({ ...prev, auxiliar_uuid: value }));
                    if (camposConError.has("inscripciones_iniciales")) {
                      const nuevosErrores = new Set(camposConError);
                      nuevosErrores.delete("inscripciones_iniciales");
                      setCamposConError(nuevosErrores);
                      if (nuevosErrores.size === 0) setError(null);
                    }
                  }}
                  disabled={!materia || !dia || !turno || !sede || !modalidad || loadingDocentes}

                >
                  <SelectTrigger
                    className={`w-full ${
                      camposConError.has("inscripciones_iniciales")
                        ? "ring-2 ring-orange-500 ring-offset-2"
                        : ""
                    }`}
                  >
                    <SelectValue
                      placeholder={
                        loadingDocentes
                          ? "Cargando docentes..."
                          : !form.uuid_materia || !form.dia
                          ? "Seleccione materia y día primero"
                          : "Seleccione auxiliar"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Docentes Disponibles</SelectLabel>
                      {docentesDisponibles.length === 0 ? (
                        <SelectItem value="_no_disponibles" disabled>
                          No hay docentes disponibles
                        </SelectItem>
                      ) : (
                        docentesDisponibles.map((docente) => (
                          <SelectItem key={docente.uuid} value={docente.uuid}>
                            {docente.nombre} {docente.apellido}
                          </SelectItem>
                        ))
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Debe seleccionar al menos un Titular o un Auxiliar
          </p>

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
