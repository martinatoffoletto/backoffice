export default function CardCurso({title, curso}) {
    return(
        <div className="w-full max-w-sm p-6 ">
            <h2 className="font-bold text-center text-xl mb-6">{title}</h2>
            <p className="mb-4"><span className="font-semibold">Número de Curso:</span> {curso.id_materia}</p>
            <p className="mb-4"><span className="font-semibold">Materia:</span> {curso.nombre}</p>
            {/* <p className="mb-4"><span className="font-semibold">Día de Cursada:</span> Curso básico para aprender los fundamentos de la programación.</p>    */}
            {/* <p className="mb-4"><span className="font-semibold">Turno:</span> Lunes y Miércoles de 10:00 a 12:00</p> */}
        </div>
    )   
}