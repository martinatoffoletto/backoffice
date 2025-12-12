import TablaAsignaciones from "@/components/TablaAsignaciones";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Asignacion() {
  return (
    <div className="min-h-screen w-full bg-white shadow-lg rounded-2xl flex flex-col items-center p-4 mt-4">
      <div className="w-full">
        <h1 className="font-bold text-center text-xl mb-4">
          Asignación de Docentes a Materias
        </h1>
        <span className="block w-full h-[3px] bg-sky-950"></span>
      </div>

      <div className="w-full mt-4">
        <TablaAsignaciones />
      </div>
    </div>
  );
}
