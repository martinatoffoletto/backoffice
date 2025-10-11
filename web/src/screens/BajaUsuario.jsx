import CardUsuario from "@/components/CardUsuario";
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator
} from "@/components/ui/select.jsx";
import PopUp from "@/components/PopUp";

export default function BajaUsuario(second) {
    const [value, setValue] = useState("");
    const [found, setFound] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const handleSearch = () => {
        // Simula búsqueda del usuario
        if (value.trim() !== "") setFound(true);
    };

    const handleBaja=()=>{
        // Lógica para confirmar la baja del usuario
        setShowPopup(true);
    }
    return(
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
                <h1 className="font-bold text-center text-xl mb-6">Baja de Usuario</h1>
                <h3 className="text-sm mb-2">
                    Ingrese el legajo del usuario para proceder a la baja
                </h3>

                {/* Input controlado */}
                <Input
                className="mb-4"
                placeholder="Legajo"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                />

                {/* Botón de búsqueda */}
                <Button
                disabled={!value.trim()}
                onClick={handleSearch}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                Buscar
                </Button>
            </div>

            {/* Resultado simulado */}
            {found && (
                <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md ml-6">
                <CardUsuario />
                <Button
                    variant="destructive"
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
                    onClick={handleBaja}
                >
                    Confirmar Baja
                </Button>
                </div>
            )}

            {/* Popup de confirmación */}
            {showPopup && (
                <PopUp title={"Se ha dado de baja al usuario solicitado"} message={"Se enviara una notificación de la misma al usuario"} onClose={() => setShowPopup(false)}/>
            )}
        </div>
    );
}