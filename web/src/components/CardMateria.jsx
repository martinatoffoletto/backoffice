export default function CardMateria({title,  materia}) {
    return(
        <div className="w-full max-w-sm p-6 ">
            <h2 className="font-bold text-center text-xl mb-6">{title}</h2>
            <p className="mb-4"><span className="font-semibold">Número de Materia:</span> {materia?.id_materia || "Materia inexistente"}</p>
            <p className="mb-4"><span className="font-semibold">Nombre de Materia:</span> {materia?.nombre || "Materia inexistente"}</p>
            {/* <p className="mb-4"><span className="font-semibold">Día de Cursada:</span> Curso básico para aprender los fundamentos de la programación.</p>    */}
            {/* <p className="mb-4"><span className="font-semibold">Turno:</span> Lunes y Miércoles de 10:00 a 12:00</p> */}
        </div>
    )   
}