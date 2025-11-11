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
import { useState, useEffect } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import PopUp from "@/components/PopUp";
import { modificarUsuario, usuarioPorId } from "@/api/usuariosApi";
import CardUsuario from "./CardUsuario";
import { Checkbox } from "./ui/checkbox";
import { obtenerRoles, buscarRoles } from "@/api/rolesApi";

export default function ModifUsuario() {
    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        nroDocumento: "",
        correoElectronico: "",
        telefonoPersonal: "",
        telefonoLaboral: "",
        carrera: "",            
    });

    const [categorias_seleccionadas, setCategoriasSeleccionadas] = useState([]);
    const [subcategoria_seleccionada, setSubcategoriaSeleccionada] = useState("");
    const [subcategorias_disponibles, setSubcategoriasDisponibles] = useState([]);
    const [loadingSubcategorias, setLoadingSubcategorias] = useState(false);
    const [roles, setRoles] = useState([]);
    const [id_rol, setIdRol] = useState("");

    const [completed, setCompleted] = useState(false);
    const [error, setError] = useState(null);
    const [value, setValue] = useState("");
    const [userData, setUserData]=useState(null)
    const [showForm, setShowForm] = useState(false);

    const CATEGORIAS_DISPONIBLES = ["ADMINISTRADOR", "ALUMNO", "DOCENTE"];

    // Cargar roles al iniciar
    useEffect(() => {
        const cargarRoles = async () => {
            try {
                const rolesData = await obtenerRoles(true);
                setRoles(rolesData);
            } catch (err) {
                console.error("Error al cargar roles:", err);
            }
        };
        cargarRoles();
    }, []);

    // Cargar subcategorías cuando se selecciona ADMINISTRADOR
    useEffect(() => {
        const cargarSubcategorias = async () => {
            if (categorias_seleccionadas.includes("ADMINISTRADOR")) {
                setLoadingSubcategorias(true);
                try {
                    const rolesAdmin = await buscarRoles("categoria", "ADMINISTRADOR", true);
                    const subcategorias = rolesAdmin
                        .map((rol) => rol.subcategoria)
                        .filter((sub) => sub && sub.trim() !== "");
                    setSubcategoriasDisponibles([...new Set(subcategorias)]);
                } catch (err) {
                    console.error("Error al cargar subcategorías:", err);
                    setSubcategoriasDisponibles([]);
                } finally {
                    setLoadingSubcategorias(false);
                }
            } else {
                setSubcategoriasDisponibles([]);
                setSubcategoriaSeleccionada("");
            }
        };
        cargarSubcategorias();
    }, [categorias_seleccionadas]);

    const toggleCategoria = (categoria) => {
        setCategoriasSeleccionadas((prev) => {
            if (prev.includes(categoria)) {
                return prev.filter((c) => c !== categoria);
            } else {
                return [...prev, categoria];
            }
        });
    };


    const handleSearch = async () => {
        try {
            if (!value.trim()) return
            const response = await usuarioPorId(parseInt(value))
            console.log("Usuario encontrado exitosamente")

            // Obtener categoría y subcategoría del rol del usuario
            const rol_usuario = response.rol || response.rol_data;
            let categorias_iniciales = [];
            let subcategoria_inicial = "";

            if (rol_usuario) {
                if (rol_usuario.categoria) {
                    categorias_iniciales = [rol_usuario.categoria];
                }
                if (rol_usuario.subcategoria) {
                    subcategoria_inicial = rol_usuario.subcategoria;
                }
                if (rol_usuario.id_rol) {
                    setIdRol(rol_usuario.id_rol);
                }
            }

            setForm({
                nombre: response.nombre || "",
                apellido: response.apellido || "",
                nroDocumento: response.nroDocumento || response.dni || "",
                correoElectronico: response.correoElectronico || response.email_personal || "",
                telefonoPersonal: response.telefonoPersonal || response.telefono_personal || "",
                telefonoLaboral: response.telefonoLaboral || response.telefono_laboral || "",
                carrera: response.carrera || "",
            })
            setCategoriasSeleccionadas(categorias_iniciales);
            setSubcategoriaSeleccionada(subcategoria_inicial);
            setUserData(response)
            setShowForm(true)
        } catch (err) {
            setError(err.message)
            setShowForm(false)
        }
    }

    const handleSubmit = async () => {
        try {
            // Validar que si se seleccionó ADMINISTRADOR, se debe seleccionar una subcategoría
            if (categorias_seleccionadas.includes("ADMINISTRADOR") && !subcategoria_seleccionada) {
                setError("Si seleccionaste ADMINISTRADOR, debes seleccionar una subcategoría.");
                return;
            }

            // Buscar el rol correspondiente
            let rol_encontrado = null;
            
            if (categorias_seleccionadas.includes("ADMINISTRADOR") && subcategoria_seleccionada) {
                rol_encontrado = roles.find(
                    (rol) => 
                        rol.categoria === "ADMINISTRADOR" && 
                        rol.subcategoria === subcategoria_seleccionada
                );
            }
            
            // Si no se encontró, buscar el primer rol de las categorías seleccionadas
            if (!rol_encontrado) {
                for (const categoria of categorias_seleccionadas) {
                    rol_encontrado = roles.find(
                        (rol) => rol.categoria === categoria && !rol.subcategoria
                    );
                    if (rol_encontrado) break;
                }
            }

            // Si aún no se encontró, usar el primer rol de la primera categoría
            if (!rol_encontrado && roles.length > 0) {
                rol_encontrado = roles.find(
                    (rol) => categorias_seleccionadas.includes(rol.categoria)
                );
            }

            if (!rol_encontrado && categorias_seleccionadas.length > 0) {
                setError("No se encontró un rol válido para las categorías seleccionadas.");
                return;
            }

            const dataToSend = { 
                ...form,
                id_rol: rol_encontrado ? rol_encontrado.id_rol : id_rol
            };
            console.log(dataToSend)
            const response = await modificarUsuario(value, dataToSend)
            console.log("Usuario modificado exitosamente")
            setUserData(response)
            setCompleted(true)
        } catch (err) {
            setError(err.message)
            console.error(err.message)
        }
    }


    const cleanForm = () => {
        setForm({
            nombre: "",
            apellido: "",
            nroDocumento: "",
            correoElectronico: "",
            telefonoPersonal: "",
            telefonoLaboral: "",
            carrera: "",
        });
        setCategoriasSeleccionadas([]);
        setSubcategoriaSeleccionada("");
        setSubcategoriasDisponibles([]);
        setIdRol("");
        setError(null);
        setCompleted(false);
        setUserData(null);
    };

    return(
        <div className="flex min-h-screen min-w-2xl flex-col items-start justify-start">
            <div className="w-full max-w-md p-6">
                <h1 className="font-bold  text-xl mb-4">Modificación de Usuario</h1>
                <span className="block w-full h-[2px] bg-sky-950"></span>

                <h3 className="text-sm mb-2 mt-8">
                Ingrese el legajo del usuario a modificar
                </h3>

                <div className="flex flex-col items-start lg:flex-row gap-4 min-w-xl">
                {/* Input controlado */}
                <Input
                className="lg:mb-4"
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
            </div>
            { showForm &&( 
                <div className="w-full max-w-md px-6 my-4">
                    <h1 className="font-bold  text-xl mb-4">Modificación de Usuario</h1>
                    <span className="block w-full h-[2px] bg-sky-950"></span>

                    <FieldSet className="my-8">
                <FieldGroup className="space-y-5">
                    {/* Categoría de usuario */}
                    <Field>
                    <FieldLabel>
                        Categoría <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full sm:w-[80%] md:w-[70%] justify-start"
                        >
                            {categorias_seleccionadas.length > 0
                            ? categorias_seleccionadas.join(", ")
                            : "Seleccioná categoría(s)"}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[250px] p-2">
                        {CATEGORIAS_DISPONIBLES.map((categoria) => (
                            <div
                            key={categoria}
                            className="flex items-center space-x-2 py-1 cursor-pointer"
                            onClick={() => toggleCategoria(categoria)}
                            >
                            <Checkbox checked={categorias_seleccionadas.includes(categoria)} />
                            <label className="cursor-pointer">{categoria}</label>
                            </div>
                        ))}
                        </PopoverContent>
                    </Popover>
                    </Field>

                    {/* Subcategoría - solo aparece si ADMINISTRADOR está seleccionado */}
                    {categorias_seleccionadas.includes("ADMINISTRADOR") && (
                        <Field>
                            <FieldLabel>
                                Subcategoría <span className="text-red-500">*</span>
                            </FieldLabel>
                            {loadingSubcategorias ? (
                                <Input disabled placeholder="Cargando subcategorías..." />
                            ) : subcategorias_disponibles.length > 0 ? (
                                <Select
                                    value={subcategoria_seleccionada}
                                    onValueChange={setSubcategoriaSeleccionada}
                                >
                                    <SelectTrigger className="w-full sm:w-[80%] md:w-[70%]">
                                        <SelectValue placeholder="Seleccioná una subcategoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subcategorias_disponibles.map((subcategoria) => (
                                            <SelectItem key={subcategoria} value={subcategoria}>
                                                {subcategoria}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Input disabled placeholder="No hay subcategorías disponibles" />
                            )}
                        </Field>
                    )}

                    {/* Datos personales */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field>
                        <FieldLabel>
                        Nombre/s <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                        id="nombre"
                        placeholder="Nombre/s"
                        value={form.nombre}
                        onChange={(e) =>
                            setForm({ ...form, nombre: e.target.value })
                        }
                        />
                    </Field>

                    <Field>
                        <FieldLabel>
                        Apellido/s <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                        id="apellido"
                        placeholder="Apellido/s"
                        value={form.apellido}
                        onChange={(e) =>
                            setForm({ ...form, apellido: e.target.value })
                        }
                        />
                    </Field>
                    </div>

                    <Field>
                    <FieldLabel>
                        N° Documento <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                        id="documento"
                        placeholder="Documento"
                        value={form.nroDocumento}
                        onChange={(e) =>
                        setForm({ ...form, nroDocumento: e.target.value })
                        }
                    />
                    </Field>

                    <Field>
                    <FieldLabel>
                        Correo Electrónico <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                        id="correo"
                        placeholder="Correo Electrónico"
                        value={form.correoElectronico}
                        onChange={(e) =>
                        setForm({
                            ...form,
                            correoElectronico: e.target.value,
                        })
                        }
                    />
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field>
                        <FieldLabel>
                        Teléfono Personal <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                        id="telefonoPersonal"
                        placeholder="Teléfono/Celular"
                        value={form.telefonoPersonal}
                        onChange={(e) =>
                            setForm({
                            ...form,
                            telefonoPersonal: e.target.value,
                            })
                        }
                        />
                    </Field>

                    <Field>
                        <FieldLabel>Teléfono Laboral</FieldLabel>
                        <Input
                        id="telefonoLaboral"
                        placeholder="Teléfono/Celular"
                        value={form.telefonoLaboral}
                        onChange={(e) =>
                            setForm({
                            ...form,
                            telefonoLaboral: e.target.value,
                            })
                        }
                        />
                    </Field>
                    </div>

                    {categorias_seleccionadas.includes("ALUMNO") && (
                    <Field>
                        <FieldLabel>Carrera</FieldLabel>
                        <Input
                        id="carrera"
                        placeholder="Carrera"
                        value={form.carrera}
                        onChange={(e) =>
                            setForm({ ...form, carrera: e.target.value })
                        }
                        />
                    </Field>
                    )}

                    {/* Botones */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                    <Button
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md w-full sm:w-auto"
                    >
                        Guardar
                    </Button>
                    <Button
                        type="button"
                        onClick={() => {
                            setShowForm(false);
                            cleanForm();
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-2 rounded-md w-full sm:w-auto"
                    >
                        Cancelar
                    </Button>
                    </div>
                </FieldGroup>
                </FieldSet>
                </div>
            )}

            {completed && (
                <CardUsuario title={"Usuario modificado exitosamente"} user={userData}/>
            )}

            {error && (
                <PopUp title={"Error al modificar la información del usuario"} message={error} onClose={() => setError(null)}/>
            )}
        </div>
    )
}