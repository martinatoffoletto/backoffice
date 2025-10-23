import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import PopUp from "@/components/PopUp";
import {altaParametro, bajaParametro, modifcarParametro, obtenerParametros } from "@/api/preciosApi";

export default function Precios() {

  const [prices, setPrices] = useState([]);
  const [editing, setEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    id: null,
    nombre: "",
    tipo: "",
    valor_numerico: 0,
    valor_texto: "",
    fecha_modificacion: null,
    status: "activo",
  });
  const [error, setError] = useState(null);

  const handleEdit = (price) => {
    setForm({ 
      id: price.id,
      nombre: price.nombre,
      tipo: price.tipo,
      valor_numerico: price.valor_numerico ?? 0,
      valor_texto: price.valor_texto ?? "",
      fecha_modificacion: price.fecha_modificacion ?? null,
      status: price.status ?? "activo",
    });
    setEditing(true);
    setShowForm(true);
  };

  const handleAdd = () => {
    setForm({ nombre: "", valor_numerico: 0 });
    setEditing(false);
    setShowForm(true);
  };

  const handleCancel = () => {
    setForm({
      id: null,
      nombre: "",
      tipo: "",
      valor_numerico: 0,
      valor_texto: "",
      fecha_modificacion: null,
      status: "activo",
    });
    setEditing(false);
    setShowForm(false);
  };

  // const savePrice = async () => {
  //   if (!form.nombre || !form.valor) {
  //     setError("Por favor, completá todos los campos obligatorios.");
  //     return;
  //   }

  //   try {
  //     const method = editing ? "PUT" : "POST";
  //     const url = editing
  //       ? `/api/precios/${encodeURIComponent(form.nombre)}`
  //       : "/api/precios";

  //     console.log("Guardando precio con metodo:", method, "en URL:", url);

  //     const response = await fetch(url, {
  //       method,
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ title: form.nombre, price: form.valor }),
  //     });

  //     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  //     const data = await response.json();
  //     console.log(editing ? "Precio actualizado:" : "Precio agregado:", data);

  //     // Actualizar lista local
  //     if (editing) {
  //       setPrices(prices.map(p => p.title === form.nombre ? { ...p, price: form.valor } : p));
  //     } else {
  //       setPrices([...prices, { ...form }]);
  //     }

  //     handleCancel();
  //   } catch (err) {
  //     console.error("Error al guardar el precio:", err);
  //     setError(err.message || "Error desconocido");
  //   }
  // };

  const savePrice = async () => {
  if (!form.nombre || !form.valor_numerico) {
    setError("Por favor, completá todos los campos obligatorios.");
    return;
  }

  try {
    const payload = {
      ...form,
      fecha_modificacion: new Date().toISOString(), // ✅ fecha actual
    };

    if (editing) {
      await modifcarParametro(form.id, payload);
    } else {
      await altaParametro(payload);
    }

    // recargar lista o actualizar estado local
    const updatedList = await obtenerParametros();
    setPrices(updatedList);

    handleCancel();
  } catch (err) {
    console.error("Error al guardar el precio:", err);
    setError(err.message || "Error desconocido");
  }
};

const deletePrice = async (id) => {
  try {
    await bajaParametro(id);
    setPrices(prices.filter((p) => p.id !== id));
  } catch (err) {
    console.error("Error al eliminar el precio:", err);
    setError(err.message || "Error desconocido");
  }
};



  // const deletePrice = async (title) => {
  //   try {
  //     await bajaPrecio(title);
  //     setPrices(prices.filter(p => p.title !== title));
  //   } catch (err) {
  //     console.error("Error al eliminar el precio:", err);
  //     setError(err.message || "Error desconocido");
  //   }
  // };

  useEffect(()=>{
    const getParams=async()=>{
      try{
        const response= await obtenerParametros()
        setPrices(response)
        console.log("precios obtenidos:", response)
      }catch(err){
        console,log("Error al obtener precios:", err)
        setError(err.message)
      }
    }
    getParams()
  },[])

  return (
    <div className="min-h-screen w-full bg-white shadow-md rounded-2xl flex flex-col items-start p-4 mt-4">
      <div className="w-full max-w-3xl">
        <h1 className="font-bold text-2xl mb-4">Listado de Precios</h1>
        <span className="block w-full h-[3px] bg-sky-950"></span>


        <div className="overflow-x-auto mt-8">
          <Table className="min-w-full border border-gray-200 my-2">
            <TableCaption className="text-gray-500 text-sm mt-4">
              Valores actualizados al mes vigente
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead>Concepto</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prices.map((p) => (
                <TableRow key={p.nombre} className="hover:bg-gray-50">
                  <TableCell>{p.nombre}</TableCell>
                  <TableCell>${String(p.valor_numerico)}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-3 mx-2 rounded"
                      onClick={() => handleEdit(p)}
                    >
                      Editar
                    </Button>
                    <Button
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-3 mx-2 rounded"
                      onClick={() => deletePrice(p.id)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Botón Agregar Precio */}
        {!showForm && (
          <Button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-6"
            onClick={handleAdd}
          >
            Agregar Nuevo Precio
          </Button>
        )}

        {/* Formulario responsive */}
        {showForm && (
          <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
            <h2 className="text-lg font-semibold mb-4">
              {editing ? "Editar Precio" : "Agregar Nuevo Precio"}
            </h2>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <InputField
                label="Concepto"
                value={form.nombre}
                onChange={(v) => setForm({ ...form, nombre: v })}
              />
              <InputField
                label="Tipo"
                value={form.tipo}
                onChange={(v)=>setForm({...form, tipo:v})}
              />
              <InputField
                label="Precio"
                type="number"
                value={form.valor_numerico}
                onChange={(v) => setForm({ ...form, valor_numerico: parseFloat(v) || 0 })}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={savePrice}
              >
                {editing ? "Actualizar" : "Guardar"}
              </Button>
              <Button
                variant="outline"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </div>

      {error && <PopUp title="Error" message={error} onClose={() => setError(null)} />}
    </div>
  );
}

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
