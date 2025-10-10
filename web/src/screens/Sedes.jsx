import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Link } from 'react-router-dom';

export default function Sedes() {
  const sedes = [
    { name: "Montserrat", address: "Lima 757, CABA" },
    { name: "Recoleta", address: "Libertad 1340, CABA" },
    { name: "Campus Costa", address: "Av. Intermédanos 776, Bs.As" },
    { name: "Belgrano", address: "11 de Septiembre de 1888 1990, CABA" }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-start items-center p-6 mt-4">
      <div className="w-full max-w-3xl">
        <h1 className="font-bold text-center text-2xl mb-6">Sedes</h1>

        <Table className="w-full border rounded-lg shadow-sm">
          <TableHeader>
            <TableRow>
              <TableHead>Sede</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sedes.map((sede) => (
              <TableRow key={sede.name}>
                <TableCell>{sede.name}</TableCell>
                <TableCell>{sede.address}</TableCell>
                <TableCell>
                  <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded">
                    <Link to="/sede">Ver</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
