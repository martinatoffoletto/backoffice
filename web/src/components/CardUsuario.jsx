import { Button } from "./ui/button";

export default function CardUsuario({
  title,
  user,
  password,
  carreraData,
  sueldoData,
  onClose,
}) {
  return (
    <div className="w-full max-w-2xl p-6 bg-white border-2 border-green-500 rounded-lg shadow-lg">
      <h2 className="font-bold text-center text-2xl mb-6 text-green-700">
        {title}
      </h2>

      {/* Datos del Usuario */}
      <div className="mb-6">
        <h3 className="font-bold text-lg text-sky-950 mb-3 border-b-2 border-sky-950 pb-2">
          Datos del Usuario
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <p className="text-sm">
            <span className="font-semibold">Legajo:</span> {user.legajo}
          </p>
          <p className="text-sm">
            <span className="font-semibold">DNI:</span> {user.dni}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Nombre:</span> {user.nombre}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Apellido:</span> {user.apellido}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Email Personal:</span>{" "}
            {user.email_personal}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Teléfono:</span>{" "}
            {user.telefono_personal}
          </p>
          <p className="text-sm col-span-1 md:col-span-2">
            <span className="font-semibold">Email Institucional:</span>{" "}
            <span className="bg-yellow-100 px-2 py-1 rounded font-mono text-blue-800">
              {user.email_institucional}
            </span>
          </p>
          {password && (
            <p className="text-sm">
              <span className="font-semibold">Contraseña:</span>{" "}
              <span className="bg-yellow-100 px-2 py-1 rounded font-mono">
                {password}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Datos de Carrera (si es alumno) */}
      {carreraData && (
        <div className="mb-6">
          <h3 className="font-bold text-lg text-sky-950 mb-3 border-b-2 border-sky-950 pb-2">
            Carrera Asignada
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {carreraData.nombre_carrera && (
              <p className="text-sm">
                <span className="font-semibold">Carrera:</span>{" "}
                {carreraData.nombre_carrera}
              </p>
            )}
            <p className="text-sm">
              <span className="font-semibold">Estado:</span>{" "}
              <span
                className={`px-2 py-1 rounded ${
                  carreraData.status
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {carreraData.status ? "Activo" : "Inactivo"}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Datos de Sueldo (si no es alumno) */}
      {sueldoData && (
        <div className="mb-6">
          <h3 className="font-bold text-lg text-sky-950 mb-3 border-b-2 border-sky-950 pb-2">
            Datos de Sueldo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <p className="text-sm">
              <span className="font-semibold">CBU:</span> {sueldoData.cbu}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Sueldo Adicional:</span>{" "}
              {sueldoData.sueldo_adicional}%
            </p>
            {sueldoData.observaciones && (
              <p className="text-sm col-span-1 md:col-span-2">
                <span className="font-semibold">Observaciones:</span>{" "}
                {sueldoData.observaciones}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Botón de Cerrar */}
      <div className="flex justify-center mt-6">
        <Button
          onClick={onClose}
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-2 rounded-md"
        >
          Aceptar
        </Button>
      </div>
    </div>
  );
}
