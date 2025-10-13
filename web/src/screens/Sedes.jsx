import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table.jsx';
import { Button } from '@/components/ui/button.jsx';
import { useState } from 'react';
import Sede from './Sede';

export default function Sedes() {
  const initialSedes = [
    { name: "Montserrat", address: "Lima 757, CABA" },
    { name: "Recoleta", address: "Libertad 1340, CABA" },
    { name: "Campus Costa", address: "Av. Intermédanos 776, Bs.As" },
    { name: "Belgrano", address: "11 de Septiembre de 1888 1990, CABA" }
  ];

  const [sedes, setSedes] = useState(initialSedes);
  const [add, setAdd] = useState(false);
  const [selectedSede, setSelectedSede] = useState(null);

  const handleClose = () => {
    setAdd(false);
    setSelectedSede(null);
  }

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
                  <Button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded"
                    onClick={() => setSelectedSede(sede)}
                  >
                    Ver / Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-6"
          onClick={() => setAdd(true)}
        >
          Agregar Sede
        </Button>

        {add && <Sede action="Agregar" onClose={handleClose} />}
        {selectedSede && <Sede action="Editar" Sede={{ sede: selectedSede }} onClose={handleClose} />}
      </div>
    </div>
  );
}
