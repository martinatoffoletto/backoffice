import { useState, useEffect } from "react";
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
import { actualizarEstadoPropuesta, obtenerPropuestasPendientes } from "@/api/docentesApi";
import { usePropuestasPolling } from "@/hooks/usePropuestasPolling";
import { useToast, ToastContainer } from "@/components/ui/toast";
import { RefreshCwIcon } from "lucide-react";


export default function TablaAsignaciones() {
  const [estado, setEstado] = useState("pendientes");
  const [propuestas, setPropuestas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Hook de notificaciones toast
  const { toasts, showToast, hideToast, info, success, error } = useToast();

  // Hook de polling para detectar nuevas propuestas
  const { 
    has_new_proposals, 
    new_proposals_count, 
    resetNewProposals 
  } = usePropuestasPolling(propuestas.length, true);

  // Cargar propuestas inicialmente
  useEffect(() => {
    cargarPropuestas();
  }, []);

  // Mostrar notificación cuando se detecten nuevas propuestas
  useEffect(() => {
    if (has_new_proposals && new_proposals_count > 0) {
      info(
        new_proposals_count === 1 
          ? '¡Nueva propuesta disponible!' 
          : `¡${new_proposals_count} nuevas propuestas!`,
        'Haz clic en Actualizar para verlas',
        {
          label: 'Actualizar',
          onClick: handleRefresh
        }
      );
    }
  }, [has_new_proposals, new_proposals_count]);

  const cargarPropuestas = async () => {
    try {
      setLoadingData(true);
      const datos = await obtenerPropuestasPendientes();
      setPropuestas(datos);
    } catch (error) {
      console.error("Error al cargar propuestas:", error);
      // En caso de error, mantener array vacío
    } finally {
      setLoadingData(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const datos = await obtenerPropuestasPendientes();
      setPropuestas(datos);
      resetNewProposals(); // Resetear indicador de nuevas propuestas
    } catch (error) {
      console.error("Error al actualizar propuestas:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtrarPendientes = () =>
    propuestas.filter((p) => p.estado === "pendiente");

  const filtrarCompletados = () =>
    propuestas.filter((p) => p.estado !== "pendiente");

  const handleAccion = async (propuesta, accion) => {
    const nuevoEstado = accion === "aprobar" ? "aceptado" : "rechazado";
    const accionTexto = accion === "aprobar" ? "aprobada" : "rechazada";

    try {
      setLoading(true);
      
      // Actualizar propuesta en el módulo de docentes
      await actualizarEstadoPropuesta(propuesta.propuesta_id, accion);

      // Actualizar estado local
      setPropuestas((prev) =>
        prev.map((p) =>
          p.propuesta_id === propuesta.propuesta_id
            ? { ...p, estado: nuevoEstado }
            : p
        )
      );

      // Mostrar notificación de éxito
      const mensajeDetalle = propuesta.carrera 
        ? `${propuesta.profesor} - ${propuesta.materia} (${propuesta.carrera})`
        : `${propuesta.profesor} - ${propuesta.materia}`;
      
      success(
        `Propuesta ${accionTexto}`,
        `La propuesta de ${mensajeDetalle} fue ${accionTexto} correctamente`
      );

      console.log(`✅ Propuesta ${propuesta.propuesta_id} ${nuevoEstado}`);
    } catch (err) {
      console.error("❌ Error al actualizar la propuesta:", err);
      
      // Mostrar notificación de error
      error(
        'Error al procesar propuesta',
        `No se pudo ${accion} la propuesta. Por favor, intenta nuevamente.`
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-6 shadow-lg rounded-2xl">
        <CardContent className="py-6">
          <p className="text-center text-gray-500">Cargando propuestas...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Contenedor de notificaciones toast */}
      <ToastContainer toasts={toasts} onClose={hideToast} />
      
      <Card className="w-full max-w-4xl mx-auto mt-6 shadow-lg rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              Solicitudes de Asignación
            </CardTitle>
            
            {/* Botón Actualizar con badge de nuevas propuestas */}
            <Button 
              onClick={handleRefresh} 
              disabled={loading || loadingData}
              className="relative"
              variant="outline"
              size="sm"
            >
              <RefreshCwIcon className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
              {has_new_proposals && new_proposals_count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse font-semibold">
                  {new_proposals_count}
                </span>
              )}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={estado} onValueChange={setEstado} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="pendientes">
                Pendientes
                {filtrarPendientes().length > 0 && (
                  <span className="ml-2 bg-sky-900 text-white text-xs rounded-full px-2 py-0.5">
                    {filtrarPendientes().length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="completados">
                Completados
                {filtrarCompletados().length > 0 && (
                  <span className="ml-2 bg-gray-500 text-white text-xs rounded-full px-2 py-0.5">
                    {filtrarCompletados().length}
                  </span>
                )}
              </TabsTrigger>
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
    </>
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
          <TableHead>Carrera</TableHead>
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
            <TableCell>{p.profesor || p.uuid_docente}</TableCell>
            <TableCell>{p.materia}</TableCell>
            <TableCell>{p.carrera || "-"}</TableCell>
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
