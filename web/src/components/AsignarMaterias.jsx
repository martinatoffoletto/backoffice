import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { obtenerCarreras } from "@/api/carrerasApi";
import { obtenerMaterias } from "@/api/materiasApi";
import { Button } from "@/components/ui/button"

export default function AsignarMaterias({value, onChange}) {
    const [carreras, setCarreras] = useState([]);
    const [search, setSearch] = useState("");
    const [sugerencias, setSugerencias] = useState([]);
    const [selectedCarrera, setSelectedCarrera] = useState(null);
    const [materias, setMaterias] = useState([]);
    const [seleccionadas, setSeleccionadas] = useState([]);
    const [completed, setCompleted] = useState(false);
    const [mensajeExito, setMensajeExito] = useState("");

    useEffect(() => {
    setSearch(value ?? "");
    }, [value]);

    useEffect(() => {
    const loadData = async () => {
      const data = await obtenerCarreras();
      setCarreras(data);
    };
    loadData();
    }, []);

     useEffect(() => {
      const texto = (search ?? "").toString();
      if (!texto.trim()) {
        setSugerencias([]);
        return;
      }
      const coincidenciaExacta = carreras.some(c => c.nombre === texto);
      if (coincidenciaExacta) {
        setSugerencias([]);
        return;
      }

      const filtro = carreras.filter((c) =>
        c.nombre.toLowerCase().includes(texto.toLowerCase())
      );

      setSugerencias(filtro);
    }, [search, carreras]);

    useEffect(() => {
    const loadMaterias = async () => {
      const data = await obtenerMaterias();
      setMaterias(data);
    };
    loadMaterias();
  }, []);

  const toggleSeleccion = (id_materia) => {
    setSeleccionadas((prev) =>
      prev.includes(id_materia)
        ? prev.filter((id) => id !== id_materia)
        : [...prev, id_materia]
    );
  };

    const handleSelect = (nombre, carrera) => {
    onChange(nombre); 
    setSearch(nombre); 
    setSugerencias([]);
    setSelectedCarrera(carrera);
    setMensajeExito("");
    setTimeout(() => setSugerencias([]), 0); 
  };

  const handleGuardar = (e) => {
    e.preventDefault();
    if (seleccionadas.length === 0) return;
    setMensajeExito(
      `Se guardaron ${seleccionadas.length} materia(s) para la carrera "${selectedCarrera.nombre}"`
    );
    setCompleted(true);
  };



  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-2xl p-6">
        <h1 className="font-bold text-center text-2xl mb-4">Asignar Materias</h1>
        <span className="block w-full h-[3px] bg-sky-950"></span>

        {!completed && (
          <form onSubmit={handleGuardar} className="space-y-5 mt-8">
            {/* Buscador de carrera */}
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Ingrese nombre de la carrera"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedCarrera(null);
                  setMensajeExito("");
                }}
              />
              {sugerencias.length > 0 && (
                <ul className="absolute w-full mt-1 bg-white border border-gray-300 rounded shadow-md z-10">
                  {sugerencias.map((carrera) => (
                    <li
                      key={carrera.id}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelect(carrera.nombre, carrera)}
                    >
                      {carrera.nombre}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Lista de materias solo si hay carrera seleccionada */}
            {selectedCarrera && (
              <>
                <div>
                  <h3 className="font-semibold mb-2">Seleccione Materias</h3>
                  <ul className="max-h-60 overflow-auto border border-gray-300 rounded p-2 space-y-1">
                    {materias.map((materia) => (
                      <li key={materia.id_materia}>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={seleccionadas.includes(materia.id_materia)}
                            onChange={() => toggleSeleccion(materia.id_materia)}
                            className="mr-2"
                          />
                          {materia.nombre}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <Button
                    type="submit"
                    disabled={seleccionadas.length === 0}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md"
                  >
                    Guardar
                  </Button>
                </div>
              </>
            )}
          </form>
        )}

        {/* Mensaje de éxito */}
        {completed && (
          <div className="flex flex-col justify-center items-center border border-green-500 p-4 rounded-md shadow-sm gap-4 w-full max-w-md mx-auto my-4 bg-white">
            <p className="text-black-600 font-semibold">{mensajeExito}</p>
            <Button
              onClick={() => {
                setCompleted(false);
                setSelectedCarrera(null);
                setSearch("");
                setSeleccionadas([]);
              }}
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-md"
            >
              OK
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}