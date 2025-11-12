export default function CardCurso({title, curso}) {
    return(
        <div className="w-full max-w-sm p-6 ">
            <h2 className="font-bold text-center text-xl mb-6">{title}</h2>
            <p className="mb-4"><span className="font-semibold">Número de Curso:</span> {curso.id_curso}</p>
            <p className="mb-4"><span className="font-semibold">Materia:</span> {curso.uuid_materia}</p>
        </div>
    )   
}