export default function CardCarrera({title,  carrera}) {
    return(
        <div className="w-full max-w-sm p-6 ">
            <h2 className="font-bold text-center text-xl mb-6">{title}</h2>
            
            <p className="mb-4"><span className="font-semibold">Nombre de Carrera:</span> {carrera?.nombre || "Carrera inexistente"}</p>
            <p className="mb-4"><span className="font-semibold">ID Carrera:</span> {carrera?.id_carrera || "Carrera inexistente"}</p>
        </div>
    )   
}