export default function CardMateria({title,  materia}) {
    return(
        <div className="w-full max-w-sm p-6 ">
            <h2 className="font-bold text-center text-xl mb-6">{title}</h2>
            <div className="space-y-3">
                <p className="mb-4"><span className="font-semibold">Nombre:</span> {materia?.nombre}</p>
                <p className="mb-4"><span className="font-semibold">Descripción:</span> {materia?.description}</p>
                <p className="mb-4"><span className="font-semibold">Tipo de Aprobación:</span> {materia?.approval_method}</p>
                <p className="mb-4"><span className="font-semibold">¿Es Optativa?:</span> {materia?.is_elective ? "Sí" : "No"}</p>
            </div>
        </div>
    )   
}