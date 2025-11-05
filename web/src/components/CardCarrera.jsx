export default function CardCarrera({title,  carrera}) {
    return(
        <div className="w-full max-w-sm p-6 ">
            <h2 className="font-bold text-center text-xl mb-6">{title}</h2>
            <p className="mb-4"><span className="font-semibold">Identificador de Carrera:</span> {carrera?.id_carrera || "1001"}</p>
            <p className="mb-4"><span className="font-semibold">Nombre de Carrera:</span> {carrera?.nombre || "Carrera inexistente"}</p>
        </div>
    )   
}