import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import PopUp from "@/components/PopUp";
import { bajaPrecio } from "@/api/preciosApi";

export default function Precios() {
  const params = [
    { title: "Reserva Comedor", price: 5000 },
    { title: "Multa por Pérdida", price: 20000 },
    { title: "Multa por Entrega Tardía", price: 5000 },
    { title: "Multa por Daño", price: 10000 },
  ]

  const[add, setAdd]=useState(false);
  const [editing, setEditing]= useState(false); // <--- nuevo estado para distinguir entre agregar y editar
  const [form, setForm]= useState({
    title: "",
    price: 0
  });
  const[error, setError]= useState(null);
  
const savePrice = async () => {
  if(!form.title || !form.price){
    setError("Por favor, completá todos los campos obligatorios.")
    return
  }
  try {
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/precios/${encodeURIComponent(form.title)}` : '/api/precios';
    console.log("Guardando precio con metodo:", method, "en URL:", url);
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: form.title, price: form.price })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(editing ? "Precio actualizado:" : "Precio agregado:", data);

    // Limpiar formulario y cerrar panel
    setForm({ title: "", price: 0 });
    setAdd(false);
    setEditing(false);
  } catch (err) {
    console.error("Error al guardar el precio:", err);
    setError(err.message || "Error desconocido");
  }
};


const deletePrice = async (title) => {
  try {
    const response = await bajaPrecio(title)
    console.log(`Precio ${title} eliminado`);
  } catch (err) {
    console.error("Error al eliminar el precio:", err);
    setError(err.message || "Error desconocido")
  }
};




  // useEffect(() => {
  //   const fetchPrices = async () => {
  //     const response = await fetch('/api/precios');
  //     const data = await response.json();
  //     setParams(data);
  //   }
  //   fetchPrices()
  // }, [])

  return (
    <div className="flex min-h-screen items-start justify-start mt-4">
      <div className="w-full max-w-3xl p-8 ">
        <h1 className="font-bold text-2xl mb-6">Listado de Precios</h1>

        <Table className="w-full text-left border border-gray-200 my-2">
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
            {params.map((param) => (
              <TableRow key={param.title} className="hover:bg-gray-50">
                <TableCell>{param.title}</TableCell>
                <TableCell>${param.price.toLocaleString()}</TableCell>
                <TableCell className="text-center">
                <Button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-3 mx-2 rounded"
                  onClick={() => {
                    setForm({ title: param.title, price: param.price });
                    setAdd(true);
                    setEditing(true); // <--- estamos editando
                  }}
                >
                  Editar
                </Button>
                  <Button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 mx-2 rounded" onClick={()=> deletePrice(param.title)}>
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-6"
          onClick={() => {
            setForm({ title: "", price: 0 });
            setAdd(true);
            setEditing(false); // <--- agregando nuevo precio
          }}
        >
          Agregar Nuevo Precio
        </Button>

        {add && (
          <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
            <h2 className="text-lg font-semibold mb-4">
              {editing ? "Editar Precio" : "Agregar Nuevo Precio"}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="title">
                Concepto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingrese el concepto"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })
                  }
                />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" htmlFor="price">
              Precio <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingrese el precio"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <Button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
              onClick={savePrice}
            >
              {editing ? "Actualizar" : "Guardar"}
            </Button>

            <Button
              variant="outline"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              onClick={() => setAdd(false)}
            >
              Cancelar
            </Button>
          </div>
        )}
      </div>
      {
        error!==null && (
          <PopUp title="Error" message={error} onClose={() => setError(null)} />
        )
      }

    </div>
  )
}
