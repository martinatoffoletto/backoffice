import { Button } from "./ui/button";

export default function CardUsuario({title, user, onClose}) {
    return(
        <div className="w-full max-w-sm p-6 ">
            <h2 className="font-bold text-center text-xl mb-6">{title}</h2>
            {/* <p className="mb-4"><span className="font-semibold">Legajo:</span> {user.legajo}</p>
            <p className="mb-4"><span className="font-semibold">Usuario:</span> {user.username}</p>
            <p className="mb-4"><span className="font-semibold">Nombre/s:</span> {user.name}</p>   
            <p className="mb-4"><span className="font-semibold">Apellido/s:</span>{user.surname}</p> */}
            
        </div>
    )   
}