export default function CardCurso(second) {
    return(
        <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md">
            <h2 className="font-bold text-center text-xl mb-6">Detalles del curso seleccionado</h2>
            <p className="mb-4"><span className="font-semibold">Número de Curso:</span> 101</p>
            <p className="mb-4"><span className="font-semibold">Materia:</span> Introducción a la Programación</p>
            <p className="mb-4"><span className="font-semibold">Día de Cursada:</span> Curso básico para aprender los fundamentos de la programación.</p>   
            <p className="mb-4"><span className="font-semibold">Turno:</span> Lunes y Miércoles de 10:00 a 12:00</p>
        </div>
    )   
}