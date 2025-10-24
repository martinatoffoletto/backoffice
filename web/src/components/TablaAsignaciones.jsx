import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function TablaAsignaciones() {
  const [estado, setEstado] = useState("pendientes");

  const asignaciones = [
    { id: 1, profesor: "Juan Pérez", estado: "pendiente" },
    { id: 2, profesor: "Laura Gómez", estado: "aprobada" },
    { id: 3, profesor: "Martín Díaz", estado: "rechazada" },
    { id: 4, profesor: "Ana Torres", estado: "pendiente" },
  ];

  const filtrarPorEstado = (estado) =>
    asignaciones.filter((a) => a.estado === estado);

  const handleAccion = (id, accion) => {
    console.log(`Asignación ${id} ${accion === "aprobar" ? "aprobada" : "rechazada"}`);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-6 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          Solicitudes de Asignación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={estado} onValueChange={setEstado} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
            <TabsTrigger value="aprobadas">Aprobadas</TabsTrigger>
            <TabsTrigger value="rechazadas">Rechazadas</TabsTrigger>
          </TabsList>

          {/* Pendientes */}
          <TabsContent value="pendientes">
            <TablaDatos
              datos={filtrarPorEstado("pendiente")}
              handleAccion={handleAccion}
              mostrarAcciones
            />
          </TabsContent>

          {/* Aprobadas */}
          <TabsContent value="aprobadas">
            <TablaDatos datos={filtrarPorEstado("aprobada")} />
          </TabsContent>

          {/* Rechazadas */}
          <TabsContent value="rechazadas">
            <TablaDatos datos={filtrarPorEstado("rechazada")} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function TablaDatos({ datos, handleAccion, mostrarAcciones = false }) {
  if (datos.length === 0) {
    return <p className="text-center text-gray-500 py-6">No hay registros.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Profesor</TableHead>
          <TableHead>Estado</TableHead>
          {mostrarAcciones && <TableHead className="text-right">Acción</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {datos.map((a) => (
          <TableRow key={a.id}>
            <TableCell>{a.id}</TableCell>
            <TableCell>{a.profesor}</TableCell>
            <TableCell className="capitalize">{a.estado}</TableCell>
            {mostrarAcciones && (
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-600 hover:bg-green-500 hover:text-white"
                  onClick={() => handleAccion(a.id, "aprobar")}
                >
                  Aceptar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-600 hover:bg-red-500 hover:text-white"
                  onClick={() => handleAccion(a.id, "rechazar")}
                >
                  Rechazar
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
