import { Calendar } from "@/components/ui/calendar.jsx";
import { useState, useEffect } from "react";
import Link from "../components/Link";
import { getEventos } from "@/api/eventosApi";

export default function Inicio() {
  const [date, setDate] = useState(new Date());
  const [eventos, setEventos] = useState([]);

  // useEffect(() => {
  //   const getEventosData = async () => {
  //     const response = await getEventos();
  //     setEventos(response);
  //   };
  //   getEventosData();
  // }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="font-extrabold text-2xl sm:text-3xl text-sky-950 mb-8 text-center">
        ¡Hola, Usuario!
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        {/* Panel Izquierdo - Calendario */}
        <div className="flex-1 bg-white shadow-lg rounded-2xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-sky-900 mb-2">
            Calendario Académico
          </h2>
          <div className="w-full h-[2px] bg-sky-900 mb-4" />

          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-lg border border-gray-200 p-4 w-full max-w-sm"
            />
          </div>

          <div className="py-5 rounded-xl text-black mt-6">
            <h3 className="text-lg sm:text-xl font-bold text-sky-900 mb-2">
              Próximos eventos
            </h3>
            <span className="block w-full h-[3px] bg-sky-950"></span>
            <ul className="space-y-3 mt-4 text-sm sm:text-base">
              <li>Comienzo 2do Cuatrimestre</li>
              <li>Evento en Sede</li>
              <li>Reunión de equipo</li>
              <li className="cursor-pointer hover:underline text-sky-900">
                Agregar evento
              </li>
            </ul>
          </div>
        </div>

        {/* Panel Derecho - Herramientas */}
        <div className="flex-1 bg-white shadow-lg rounded-2xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-sky-900 mb-2">
            Herramientas de Gestión
          </h2>
          <div className="w-full h-[2px] bg-sky-900 mb-4" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <Link
              to="/usuarios"
              title="Gestión de Usuarios"
              className="p-3 text-center rounded-lg border border-gray-200 hover:bg-sky-100 transition font-semibold"
            />
            <Link
              to="/precios"
              title="Listado de Precios"
              className="p-3 text-center rounded-lg border border-gray-200 hover:bg-sky-100 transition font-semibold"
            />
            <Link
              to="/cursos"
              title="Gestión de Cursos"
              className="p-3 text-center rounded-lg border border-gray-200 hover:bg-sky-100 transition font-semibold"
            />
            <Link
              to="/sedes"
              title="Sedes"
              className="p-3 text-center rounded-lg border border-gray-200 hover:bg-sky-100 transition font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
