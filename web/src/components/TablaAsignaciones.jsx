import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { actualizarEstadoDisponibilidad } from "@/api/docentesApi";

const mockPropuestas = [
  {
    propuesta_id: "prop-001",
    uuid_docente: "e9d03ceb-564c-4c95-b6a8-7e851d40994b",
    profesor: "Juan Pérez",
    uuid_materia: "4e581607-2aab-4db0-9874-214f039866d6",
    materia: "Cálculo II",
    dia: "LUNES",
    estado: "pendiente",
  },
  {
    propuesta_id: "prop-002",
    uuid_docente: "a1b2c3d4-564c-4c95-b6a8-111111111111",
    profesor: "María García",
    uuid_materia: "4e581607-2aab-4db0-9874-214f039866d6",
    materia: "Programación I",
    dia: "MARTES",
    estado: "aceptado",
  },
  {
    propuesta_id: "prop-003",
    uuid_docente: "e9d03ceb-564c-4c95-b6a8-7e851d40114b",
    profesor: "Carlos López",
    uuid_materia: "4e581607-2aab-4db0-9874-214f039866d6",
    materia: "Cálculo I",
    dia: "MIERCOLES",
    estado: "rechazado",
  },
  {
    propuesta_id: "prop-004",
    uuid_docente: "b2c3d4e5-564c-4c95-b6a8-222222222222",
    profesor: "Ana Rodríguez",
    uuid_materia: "4e581607-2aab-4db0-9874-214f039866d6",
    materia: "Ciencia de Datos",
    dia: "JUEVES",
    estado: "pendiente",
  },
];

export default function TablaAsignaciones() {
  const [estado, setEstado] = useState("pendientes");
  const [propuestas, setPropuestas] = useState(mockPropuestas);
  const [loading, setLoading] = useState(false);

  const filtrarPendientes = () =>
    propuestas.filter((p) => p.estado === "pendiente");

  const filtrarCompletados = () =>
    propuestas.filter((p) => p.estado !== "pendiente");

  const handleAccion = async (propuesta, accion) => {
    const nuevoEstado = accion === "aprobar" ? "aceptado" : "rechazado";

    try {
      setLoading(true);
      await actualizarEstadoDisponibilidad(
        propuesta.uuid_docente,
        propuesta.uuid_materia,
        propuesta.dia,
        nuevoEstado
      );

      setPropuestas((prev) =>
        prev.map((p) =>
          p.propuesta_id === propuesta.propuesta_id
            ? { ...p, estado: nuevoEstado }
            : p
        )
      );

      console.log(`Propuesta ${propuesta.propuesta_id} ${nuevoEstado}`);
    } catch (error) {
      console.error("Error al actualizar la asignación:", error);
    } finally {
      setLoading(false);
    }
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
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
            <TabsTrigger value="completados">Completados</TabsTrigger>
          </TabsList>

          <TabsContent value="pendientes">
            <TablaDatos
              datos={filtrarPendientes()}
              handleAccion={handleAccion}
              mostrarAcciones
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="completados">
            <TablaDatos datos={filtrarCompletados()} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function TablaDatos({
  datos,
  handleAccion,
  mostrarAcciones = false,
  loading = false,
}) {
  if (datos.length === 0) {
    return <p className="text-center text-gray-500 py-6">No hay registros.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Propuesta ID</TableHead>
          <TableHead>Profesor</TableHead>
          <TableHead>Materia</TableHead>
          <TableHead>Día</TableHead>
          <TableHead>Estado</TableHead>
          {mostrarAcciones && (
            <TableHead className="text-right">Acción</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {datos.map((p) => (
          <TableRow key={p.propuesta_id}>
            <TableCell className="font-mono text-xs">
              {p.propuesta_id}
            </TableCell>
            <TableCell>{p.profesor}</TableCell>
            <TableCell>{p.materia}</TableCell>
            <TableCell>{p.dia}</TableCell>
            <TableCell className="capitalize">{p.estado}</TableCell>
            {mostrarAcciones && (
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-600 hover:bg-green-500 hover:text-white"
                  onClick={() => handleAccion(p, "aprobar")}
                  disabled={loading}
                >
                  Aceptar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-600 hover:bg-red-500 hover:text-white"
                  onClick={() => handleAccion(p, "rechazar")}
                  disabled={loading}
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
