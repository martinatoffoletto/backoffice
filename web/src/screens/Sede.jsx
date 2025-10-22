import PopUp from "@/components/PopUp"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"

import { useState } from "react"

export default function Sede({ action, Sede, onClose }) {
  const actionType = action || "Agregar";
  const { sede } = Sede || {};
  const [form, setForm] = useState({
    denominacion: sede ? sede.name : "",
    direccion: sede ? sede.address : "",
    cantidadAulas: sede ? sede.cantidadAulas : "",
    tieneComedor: sede ? sede.tieneComedor : "",
    tieneBiblioteca: sede ? sede.tieneBiblioteca : ""
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/sedes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error('Error en la solicitud');
      const data = await response.json();
      alert("Sede creada con éxito");
      if (onClose) onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
        <h1 className="font-bold text-center text-xl mb-6">{actionType} Sede</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Campos alineados en columna por defecto, fila en md */}
          <div className="flex flex-col md:flex-row gap-4">
            <InputField label="Denominación" value={form.denominacion} onChange={(v) => setForm({ ...form, denominacion: v })} />
            <InputField label="Dirección" value={form.direccion} onChange={(v) => setForm({ ...form, direccion: v })} />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <InputField label="Cantidad de aulas" type="number" value={form.cantidadAulas} onChange={(v) => setForm({ ...form, cantidadAulas: v })} />

            <RadioGroupField
              label="¿Tiene comedor?"
              value={form.tieneComedor}
              options={[{ label: "Sí", value: "si" }, { label: "No", value: "no" }]}
              onChange={(v) => setForm({ ...form, tieneComedor: v })}
            />

            <RadioGroupField
              label="¿Tiene biblioteca?"
              value={form.tieneBiblioteca}
              options={[{ label: "Sí", value: "si" }, { label: "No", value: "no" }]}
              onChange={(v) => setForm({ ...form, tieneBiblioteca: v })}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
            <Button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Guardar
            </Button>
            <Button type="button" variant="outline" className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>

        {error && <PopUp title="Error" message={error} onClose={() => setError(null)} />}
      </div>
    </div>
  );
}

// Componentes auxiliares para inputs y radios
function InputField({ label, value, onChange, type = "text" }) {
  return (
    <div className="flex-1 flex flex-col">
      <label className="text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label key={opt.value} className="flex items-center gap-1">
            <input
              type="radio"
              value={opt.value}
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