import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select.jsx";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import SelectForm from "@/components/SelectForm";
import AltaSede from "@/components/AltaSede";
import ModifSede from "@/components/ModifSede";
import BajaSede from "@/components/BajaSede";
import BusquedaSede from "@/components/BusquedaSede";
import PopUp from "@/components/PopUp";
import { obtenerSedes } from "@/api/sedesApi";

export default function Sedes() {
  const [value, setValue] = useState("");
  const opciones = [
    { value: "alta", label: "Alta de Sede" },
    { value: "baja", label: "Baja de Sede" },
    { value: "modif", label: "Modificación de Sede" },
    { value: "busqueda", label: "Búsqueda de Sede" }
  ];

  const [sedes, setSedes] = useState([]);
  const [editingSede, setEditingSede] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: null, nombre: '', ubicacion: '', cantidadAulas: '', tieneComedor: false, capComedor: '', tieneBiblioteca: false });
  const [error, setError]=useState(null)

  const handleEdit = (sede) => {
    setEditingSede(sede);
    setForm({
      id: sede.id,
      nombre: sede.nombre,
      ubicacion: sede.ubicacion,
      cantidadAulas: sede.cantidadAulas?.toString() ?? '',
      tieneComedor: sede.tieneComedor ?? false,
      capComedor: sede.capComedor?.toString() ?? '',
      tieneBiblioteca: sede.tieneBiblioteca ?? false
    });
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingSede(null);
    setForm({ id:null, nombre: '', ubicacion: '', cantidadAulas: '', tieneComedor: '', capComedor: '', tieneBiblioteca: '' });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSede(null);
    setForm({ nombre: '', ubicacion: '', cantidadAulas: '', tieneComedor: '', capComedor: '', tieneBiblioteca: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
      const newSede = {
      ...form,
      cantidadAulas: Number(form.cantidadAulas)
    };
    if (editingSede) {
      setSedes(sedes.map(s => s.id === editingSede.id ? { ...s, ...newSede } : s));
    } else {
      
      const nextId = sedes.length ? Math.max(...sedes.map(s => s.id || 0)) + 1 : 1;
      setSedes([...sedes, { ...newSede, id: nextId }]);
    }
    handleCancel();
  };

  useEffect(() => {
    const getSedes = async () => {
      try {
        const data = await obtenerSedes(); 
        console.log("Sedes obtenidas:", data);
        setSedes(data);
      } catch (err) {
        console.error("Error al cargar las sedes:", err);
        setError(err.message);
      }
    };

    getSedes();
  }, []);



  return (
    <div className="min-h-screen w-full bg-white shadow-lg rounded-2xl flex flex-col items-center p-4 mt-4">
      <div className="w-full max-w-4xl">
        <h1 className="font-bold text-center text-2xl mb-4">Sedes</h1>
        <span className="block w-full h-[3px] bg-sky-950"></span>

        <div className="flex flex-col items-start lg:flex-row gap-4 min-w-xl mt-8">
          <h3 className="text-sm flex-shrink-0">Elija qué tipo de operación desea realizar</h3>
          <SelectForm
            title="Operaciones"
            options={opciones}
            value={value}
            onValueChange={setValue}
          />
        </div>

        <div className="overflow-x-auto mt-8">
          
          <Table className="min-w-full border rounded-lg shadow-sm ">
            <TableHeader>
              <TableRow>
                <TableHead>Sede</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sedes.map((sede) => (
                <TableRow key={sede.id} className="hover:bg-gray-50">
                  <TableCell>{sede.nombre}</TableCell>
                  <TableCell>{sede.ubicacion}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                      onClick={() => handleEdit(sede)}
                    >
                      Ver / Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Botón Agregar Sede */}
        {!showForm && (
          <Button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-6"
            onClick={handleAdd}
          >
            Agregar Sede
          </Button>
        )}

        {/* Formulario responsive */}
        {showForm && (
          <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
            <h2 className="font-bold text-xl mb-4">{editingSede ? 'Editar Sede' : 'Agregar Sede'}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <InputField label="Denominación" value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v })} />
                <InputField label="Dirección" value={form.ubicacion} onChange={(v) => setForm({ ...form, ubicacion: v })} />
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <InputField label="Cantidad de aulas" type="number" value={form.cantidadAulas} onChange={(v) => setForm({ ...form, cantidadAulas: v })} />
                <RadioGroupField
                  label="¿Tiene comedor?"
                  value={form.tieneComedor}
                  options={[{ label: "Sí", value: true }, { label: "No", value: false }]}
                  onChange={(v) => setForm({ ...form, tieneComedor:  v, capComedor: v ? form.capComedor : "",})}
                />
                <InputField
                  label="Capacidad del Comedor"
                  type="number"
                  value={form.capComedor}
                  onChange={(v) => setForm({ ...form, capComedor: v })}
                  disabled={!form.tieneComedor}
                />
                <RadioGroupField
                  label="¿Tiene biblioteca?"
                  value={form.tieneBiblioteca}
                  options={[{ label: "Sí", value: true }, { label: "No", value: false }]}
                  onChange={(v) => setForm({ ...form, tieneBiblioteca:  v})}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
                <Button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  {editingSede ? 'Actualizar' : 'Agregar'}
                </Button>
                <Button type="button" variant="outline" className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}
        {error !== null && (
          <PopUp title={"Error"} message={error.toString()} onClose={()=>setError(null)}/>
        )}

        {value === "alta" && <AltaSede />}
        {value === "baja" && <BajaSede />}
        {value === "modif" && <ModifSede />}
        {value === "busqueda" && <BusquedaSede />}
      </div>
    </div>
  );
}

// Componentes auxiliares
function InputField({ label, value, onChange, type = "text", disabled = false }) {
  return (
    <div className="flex-1 flex flex-col">
      <label className="text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 
          ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : ""
        }`}
      />
    </div>
  );
}

function RadioGroupField({ label, value, options, onChange }) {
  return (
    <div className="flex-1 flex flex-col">
      <span className="text-sm font-medium mb-1">{label}</span>
      <div className="flex flex-row gap-4">
        {options.map(opt => (
          <label key={String(opt.value)} className="flex items-center gap-1">
            <input
              type="radio"
              value={String(opt.value)}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}
