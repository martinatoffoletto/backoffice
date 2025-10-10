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

export default function Precios() {
  const params = [
    { title: "Reserva Comedor", price: 5000 },
    { title: "Multa por Pérdida", price: 20000 },
    { title: "Multa por Entrega Tardía", price: 5000 },
    { title: "Multa por Daño", price: 10000 },
  ]

  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-50 mt-4">
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-md">
        <h1 className="font-bold text-center text-2xl mb-6">Listado de Precios</h1>

        <Table className="w-full text-left border border-gray-200">
          <TableCaption className="text-gray-500 text-sm mt-2">
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
                  <Button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded">
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
