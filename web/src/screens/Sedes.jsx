import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table.jsx';
import { Button } from '@/components/ui/button.jsx';
import { useState } from 'react';

export default function Sedes() {
  const initialSedes = [
    { name: "Montserrat", address: "Lima 757, CABA" },
    { name: "Recoleta", address: "Libertad 1340, CABA" },
    { name: "Campus Costa", address: "Av. Intermédanos 776, Bs.As" },
    { name: "Belgrano", address: "11 de Septiembre de 1888 1990, CABA" }
  ];

  const [sedes, setSedes] = useState(initialSedes);
  const [editingSede, setEditingSede] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', cantidadAulas: '', tieneComedor: '', tieneBiblioteca: '' });

  const handleEdit = (sede) => {
    setEditingSede(sede);
    setForm({
      name: sede.name,
      address: sede.address,
      cantidadAulas: sede.cantidadAulas || '',
      tieneComedor: sede.tieneComedor || '',
      tieneBiblioteca: sede.tieneBiblioteca || ''
    });
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingSede(null);
    setForm({ name: '', address: '', cantidadAulas: '', tieneComedor: '', tieneBiblioteca: '' });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSede(null);
    setForm({ name: '', address: '', cantidadAulas: '', tieneComedor: '', tieneBiblioteca: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSede) {
      setSedes(sedes.map(s => s.name === editingSede.name ? { ...s, ...form } : s));
    } else {
      setSedes([...sedes, form]);
    }
    handleCancel();
  };

  return (
    <div className="min-h-screen w-full bg-white shadow-lg rounded-2xl flex flex-col items-center p-4 mt-4">
      <div className="w-full max-w-4xl">
        <h1 className="font-bold text-center text-2xl mb-6">Sedes</h1>

        <div className="overflow-x-auto">
          <Table className="min-w-full border rounded-lg shadow-sm">
            <TableHeader>
              <TableRow>
                <TableHead>Sede</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sedes.map((sede) => (
                <TableRow key={sede.name} className="hover:bg-gray-50">
                  <TableCell>{sede.name}</TableCell>
                  <TableCell>{sede.address}</TableCell>
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
                <InputField label="Denominación" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                <InputField label="Dirección" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
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
                  {editingSede ? 'Actualizar' : 'Agregar'}
                </Button>
                <Button type="button" variant="outline" className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" onClick={handleCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// Componentes auxiliares
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
