import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select.jsx";
import {
  Command,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react";
import PopUp from "@/components/PopUp";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { 
  materiaPorId, 
  materiaPorNombre, 
  modificarMateria, 
  obtenerMaterias 
} from "@/api/materiasApi";
import CardMateria from "./CardMateria";


export default function ModifMateria({ materia_inicial = null }) {

  // -----------------------------
  // ESTADOS
  // -----------------------------
  const [form, setForm] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    metodo_aprobacion: "",
    curricular: true,
    status: "activo"
  });

  const [value, setValue] = useState("");
  const [completed, setCompleted] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [addError, setAddError] = useState(null);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [allMaterias, setAllMaterias] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingCarreras, setLoadingCarreras] = useState(false);
  const [carreraSearch, setCarreraSearch] = useState("");
  const [carreras, setCarreras] = useState([]);

  const filteredCarreras = carreras.filter((carrera) =>
    carrera.nombre.toLowerCase().includes(carreraSearch.toLowerCase())
  );

  // Necesarios para buscar y mostrar info
  const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
  const [materiaData, setMateriaData] = useState(null);
  const [loadingState, setLoadingState] = useState(false);
  const [found, setFound] = useState(false);


  // -----------------------------------------------
  // CARGAR TODAS LAS MATERIAS PARA EL AUTOCOMPLETADO
  // -----------------------------------------------
  useEffect(() => {
    const loadMaterias = async () => {
      try {
        const data = await obtenerMaterias();
        setAllMaterias(data);
      } catch (err) {
        console.error("Error al cargar materias", err);
      }
    };
    loadMaterias();
  }, []);


  // -----------------------------------------------
  // SI VIENE UNA MATERIA INICIAL DESDE AFUERA
  // -----------------------------------------------
  useEffect(() => {
    if (materia_inicial) {
      setValue(materia_inicial.nombre);
      setForm({
        id: materia_inicial.id_materia,
        nombre: materia_inicial.nombre,
        carrera: materia_inicial.carrera,
        descripcion: materia_inicial.descripcion || "",
        metodo_aprobacion: materia_inicial.metodo_aprobacion || "",
        curricular: materia_inicial.curricular,
        status: materia_inicial.status
      });
      setShowForm(true);
    }
  }, [materia_inicial]);


  // -----------------------------
  // BUSCAR MANUALMENTE (BOTÓN)
  // -----------------------------
  const handleSearch = async () => {
    setLoadingState(true);
    const nombre = value.trim();

    try {
      const response = await materiaPorNombre(nombre);

      if (response) {
        setMateriaData(response);
        setFound(true);
        setShowForm(true);

        setForm({
          id: response.id_materia,
          nombre: response.nombre,
          carrera: response.carrera,
          descripcion: response.descripcion || "",
          metodo_aprobacion: response.metodo_aprobacion || "",
          curricular: response.curricular,
          status: response.status,
        });

      } else {
        setFound(false);
        setMateriaData(null);
      }

    } catch (err) {
      setError(err.message || "Error al buscar la materia");
    }

    setLoadingState(false);
  };


  // -----------------------------
  // GUARDAR CAMBIOS
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await modificarMateria(form.id, form);
      setCompleted(true);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };


  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-6xl p-6">

        <h1 className="font-bold text-center text-2xl mb-4">Modificación de Materia</h1>
        <span className="block w-full h-[3px] bg-sky-950"></span>

        <h3 className="text-sm mb-2 mt-8 text-center">
          Ingrese el nombre de la materia a modificar
        </h3>

        <div className="relative w-full max-w-6xl">

          {/* INPUT AUTOCOMPLETE */}
          <Input
            className="mb-4 flex-1 w-full"
            type="text"
            placeholder="Ingrese nombre"
            value={value}
            onChange={(e) => {
              const texto = e.target.value;
              setValue(texto);

              if (texto.trim() === "") {
                setSuggestions([]);
                setShowDropdown(false);
                return;
              }

              const sugerencias = allMaterias.filter(m =>
                m.nombre.toLowerCase().includes(texto.toLowerCase())
              );

              setSuggestions(sugerencias);
              setShowDropdown(true);
            }}
          />

          {/* DROPDOWN */}
          {showDropdown && suggestions.length > 0 && (
            <Command className="absolute left-0 right-0 bg-white border rounded-md shadow-md mt-1 z-50 min-h-fit max-h-60 overflow-y-auto">
              <CommandGroup heading="Coincidencias">
                {suggestions.map(materia => (
                  <CommandItem
                    key={materia.id_materia}
                    onSelect={() => {
                      setValue(materia.nombre); 
                      setMateriaSeleccionada(materia);
                      setMateriaData(materia);
                      setShowDropdown(false);
                      setShowForm(true);

                      setForm({
                        id: materia.id_materia,
                        nombre: materia.nombre,
                        descripcion: materia.descripcion || "",
                        metodo_aprobacion: materia.metodo_aprobacion || "",
                        curricular: materia.curricular,
                        status: materia.status
                      });
                    }}
                  >
                    {materia.nombre}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          )}

          {searchError && <p className="text-red-500 mt-2 text-center">{searchError}</p>}

        </div>


        {/* FORMULARIO */}
        {showForm && (
          <div className="w-full max-w-6xl p-6">
            <h1 className="font-bold text-center text-2xl mb-4">Modificación de Materia</h1>
            <span className="block w-full h-[3px] bg-sky-950"></span>

            <FieldSet className="my-4">
              <FieldGroup>

                <Field>
                  <FieldLabel>Nombre Materia</FieldLabel>
                  <Input 
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="carrera">
                    Carrera<span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select
                    value={form.carrera}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, carrera: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          loadingCarreras ? "Cargando carreras..." : "Seleccione carrera"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2">
                        <Input
                          placeholder="Buscar carrera..."
                          value={carreraSearch}
                          onChange={(e) => setCarreraSearch(e.target.value)}
                          className="mb-2"
                        />
                      </div>
                      <SelectGroup>
                        <SelectLabel>Carreras</SelectLabel>
                        {filteredCarreras.length > 0 ? (
                          filteredCarreras.map((carrera) => (
                            <SelectItem key={carrera.nombre} value={carrera.nombre}>
                              {carrera.nombre}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-2 py-1.5 text-sm text-gray-500">
                            {loadingCarreras
                              ? "Cargando..."
                              : "No se encontraron carreras"}
                          </div>
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Descripción</FieldLabel>
                  <Input
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  />
                </Field>

                <Field>
                  <FieldLabel>Tipo de Aprobación</FieldLabel>
                  <Select
                    value={form.metodo_aprobacion}
                    onValueChange={(value) => setForm({ ...form, metodo_aprobacion: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione tipo de aprobación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="final">Final Obligatorio</SelectItem>
                      <SelectItem value="promocion">Promoción</SelectItem>
                      <SelectItem value="trabajo_practico">Trabajo Práctico Obligatorio</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>¿Es curricular?</FieldLabel>
                  <RadioGroup
                    value={form.curricular ? "si" : "no"}
                    onValueChange={(value) =>
                      setForm({ ...form, curricular: value === "si" })
                    }
                    className="flex gap-4 mt-2"
                  >
                    <label className="flex items-center gap-2">
                      <RadioGroupItem value="si" />
                      <span>Si</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <RadioGroupItem value="no" />
                      <span>No</span>
                    </label>
                  </RadioGroup>
                </Field>

                <div className="flex justify-center">
                  <Button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded mt-4"
                    onClick={handleSubmit}
                  >
                    Guardar
                  </Button>

                  <Button 
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded mt-4 ml-4"
                    onClick={() => setShowForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>

              </FieldGroup>
            </FieldSet>
          </div>
        )}


        {/* ÉXITO */}
        {completed && (
          <div className="w-full max-w-6xl p-6">
            <div className="flex flex-col justify-center items-center border border-green-500 p-4 rounded-md shadow-sm gap-4 bg-white">
              <CardMateria title="Información modificada exitosamente" materia={form} />
              <Button
                onClick={() => { setCompleted(false); setValue(""); }}
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-md"
              >
                OK
              </Button>
            </div>
          </div>
        )}


        {/* ERRORES POPUP */}
        {addError && (
          <PopUp title="Error" message={addError} onClose={() => setAddError(null)} />
        )}

        {error !== null && (
          <PopUp title="Error" message={error} onClose={() => setError(null)} />
        )}

      </div>
    </div>
  );
}