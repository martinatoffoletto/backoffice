import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import PopUp from "@/components/PopUp";
import { obtenerRoles } from "@/api/rolesApi";

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const normalizeResponse = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.roles)) return data.roles;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerRoles();
      const normalized = normalizeResponse(data);
      setRoles(normalized);
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        "Ocurrió un error al cargar los roles.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "0";
    // value may come as string/number
    const num = typeof value === "string" ? Number(value) : value;
    if (Number.isNaN(num)) return String(value);
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="min-h-screen w-full bg-white shadow-lg rounded-2xl flex flex-col items-center p-4 mt-4">
      <div className="w-full max-w-6xl">
        <h1 className="font-bold text-center text-2xl mb-4">Roles</h1>
        <span className="block w-full h-[3px] bg-sky-950"></span>

        <div className="overflow-x-auto mt-8">
          <Table className="min-w-full border rounded-lg shadow-sm ">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Subcategoría</TableHead>
                <TableHead>Sueldo base</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading && roles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    No hay roles disponibles.
                  </TableCell>
                </TableRow>
              )}

              {loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Cargando roles...
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                roles.map((rol) => (
                  <TableRow
                    key={rol.id_rol || rol.id}
                    className="hover:bg-gray-50"
                  >
                    <TableCell className="font-mono text-sm">
                      {rol.id_rol ?? rol.id ?? "-"}
                    </TableCell>
                    <TableCell>{rol.descripcion ?? "-"}</TableCell>
                    <TableCell>{rol.categoria ?? "-"}</TableCell>
                    <TableCell>{rol.subcategoria ?? "-"}</TableCell>
                    <TableCell>{formatCurrency(rol.sueldo_base)}</TableCell>
                    <TableCell>
                      {rol.status !== false ? (
                        <span className="text-green-600">Activo</span>
                      ) : (
                        <span className="text-red-600">Inactivo</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Small refresh button */}
        <div className="flex justify-end mt-4">
          <Button
            className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded"
            onClick={fetchRoles}
          >
            Refrescar
          </Button>
        </div>

        {error && (
          <PopUp
            title={"Error"}
            message={String(error)}
            onClose={() => setError(null)}
          />
        )}
      </div>
    </div>
  );
}
