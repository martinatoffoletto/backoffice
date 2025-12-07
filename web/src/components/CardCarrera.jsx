export default function CardCarrera({ title, carrera }) {
  return (
    <div className="w-full max-w-sm p-6 ">
      <h2 className="font-bold text-center text-xl mb-6">{title}</h2>
      <p className="mb-2">
        <span className="font-semibold">Nombre:</span> {carrera?.name || "N/A"}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Título:</span>{" "}
        {carrera?.degree_title || "N/A"}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Descripción:</span>{" "}
        {carrera?.description || "N/A"}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Facultad:</span>{" "}
        {carrera?.faculty || "N/A"}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Modalidad:</span>{" "}
        {carrera?.modality || "N/A"}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Duración:</span>{" "}
        {carrera?.duration_years || 0} años / {carrera?.duration_hours || 0}{" "}
        horas
      </p>
    </div>
  );
}
