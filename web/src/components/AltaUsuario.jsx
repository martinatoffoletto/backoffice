import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import PopUp from "@/components/PopUp";
import CardUsuario from "./CardUsuario";
import { useState, useEffect } from "react";
import { altaUsuario } from "@/api/usuariosApi";
import { obtenerRoles, buscarRoles } from "@/api/rolesApi";
import { asociarCarreraUsuario } from "@/api/usuariosCarrerasApi";
import { altaSueldo } from "@/api/sueldosApi";
import { obtenerCarreras } from "@/api/cursosApi";

export default function AltaUsuario() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    nroDocumento: "",
    correoElectronico: "",
    telefonoPersonal: "",
    contraseña: "",
    id_rol: "",
  });
  const [categorias_seleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [subcategoria_seleccionada, setSubcategoriaSeleccionada] = useState("");
  const [subcategorias_disponibles, setSubcategoriasDisponibles] = useState([]);
  const [loadingSubcategorias, setLoadingSubcategorias] = useState(false);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [userData, setUserData] = useState(null);
  const [step, setStep] = useState(1); // 1: datos generales, 2: carrera/sueldo
  const [carreras, setCarreras] = useState([]);
  const [carrera_seleccionada, setCarreraSeleccionada] = useState("");
  const [sueldoForm, setSueldoForm] = useState({
    cbu: "",
    sueldo_adicional: "",
    observaciones: "",
  });

  const CATEGORIAS_DISPONIBLES = ["ADMINISTRADOR", "ALUMNO", "DOCENTE"];

  // Cargar roles y carreras al iniciar
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [rolesData, carrerasData] = await Promise.all([
          obtenerRoles(true), // Solo roles activos
          obtenerCarreras()
        ]);
        setRoles(rolesData);
        setCarreras(carrerasData);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar los datos. Por favor, recargá la página.");
      }
    };
    cargarDatos();
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

  const handleSecondStep = async (e) => {
    e.preventDefault();
    if (!userData || !userData.id_usuario) {
      setError("Error: no se encontró el usuario creado.");
      return;
    }

    const es_alumno = categorias_seleccionadas.includes("ALUMNO");

    try {
      if (es_alumno) {
        // Asociar carrera
        if (!carrera_seleccionada) {
          setError("Por favor, seleccioná una carrera.");
          return;
        }
        await asociarCarreraUsuario({
          id_usuario: userData.id_usuario,
          id_carrera: carrera_seleccionada,
        });
      } else {
        // Crear sueldo
        if (!sueldoForm.cbu) {
          setError("Por favor, completá el CBU.");
          return;
        }
        await altaSueldo({
          id_usuario: userData.id_usuario,
          cbu: sueldoForm.cbu.trim(),
          sueldo_adicional: sueldoForm.sueldo_adicional ? parseFloat(sueldoForm.sueldo_adicional) : 0,
          observaciones: sueldoForm.observaciones || null,
        });
      }
      setCompleted(true);
      setStep(3); // Paso final
    } catch (err) {
      console.error("Error en segundo paso:", err);
      const errorMessage = err.response?.data?.detail || err.message || "Error al completar el segundo paso";
      setError(errorMessage);
    }
  };

  const cleanForm = () => {
    setForm({
      nombre: "",
      apellido: "",
      nroDocumento: "",
      correoElectronico: "",
      telefonoPersonal: "",
      contraseña: "",
      id_rol: "",
    });
    setCategoriasSeleccionadas([]);
    setSubcategoriaSeleccionada("");
    setSubcategoriasDisponibles([]);
    setCarreraSeleccionada("");
    setSueldoForm({
      cbu: "",
      sueldo_adicional: "",
      observaciones: "",
    });
    setError(null);
    setCompleted(false);
    setUserData(null);
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.nombre ||
      !form.apellido ||
      !form.nroDocumento ||
      !form.correoElectronico ||
      !form.telefonoPersonal ||
      !form.contraseña ||
      categorias_seleccionadas.length === 0
    ) {
      setError("Por favor, completá todos los campos obligatorios.");
      return;
    }

    // Validar que si se seleccionó ADMINISTRADOR, se debe seleccionar una subcategoría
    if (categorias_seleccionadas.includes("ADMINISTRADOR") && !subcategoria_seleccionada) {
      setError("Si seleccionaste ADMINISTRADOR, debes seleccionar una subcategoría.");
      return;
    }

    // Validar contraseña
    if (form.contraseña.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    try {
      // Buscar el rol correspondiente
      // Si hay ADMINISTRADOR con subcategoría, buscar ese rol específico
      // Si no, buscar el primer rol que coincida con alguna de las categorías seleccionadas
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

      if (!rol_encontrado) {
        setError("No se encontró un rol válido para las categorías seleccionadas.");
        return;
      }

      // Transformar datos del formulario al formato que espera el backend
      const userDataToSend = {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        dni: form.nroDocumento.trim(),
        email_personal: form.correoElectronico.trim(),
        telefono_personal: form.telefonoPersonal.trim(),
        contraseña: form.contraseña,
        id_rol: rol_encontrado.id_rol,
      };

      const response = await altaUsuario(userDataToSend);
      setUserData(response.user || response);
      
      // Verificar si es ALUMNO para mostrar segundo paso
      const es_alumno = categorias_seleccionadas.includes("ALUMNO");
      if (es_alumno) {
        setStep(2); // Mostrar formulario de carrera
      } else {
        setStep(2); // Mostrar formulario de sueldo
      }
    } catch (err) {
      console.error("Error al dar de alta el usuario:", err);
      // Mostrar mensaje de error más descriptivo
      const errorMessage = err.response?.data?.detail || err.message || "Error al crear el usuario";
      setError(errorMessage);
    }
  };

  const es_alumno = categorias_seleccionadas.includes("ALUMNO");

  return (
    <div className="flex flex-col w-full min-h-screen items-start justify-start mt-6 py-4 sm:px-8">
      {step === 1 && (
        <div className="w-full max-w-3xl">
          <h1 className="font-bold text-start text-xl mb-4 text-black">
            Alta de Usuario
          </h1>
          <span className="block w-full h-[2px] bg-sky-950 mb-6"></span>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FieldSet>
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
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={form.correoElectronico}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        correoElectronico: e.target.value,
                      })
                    }
                  />
                </Field>

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
                  <FieldLabel>
                    Contraseña <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="contraseña"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={form.contraseña}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        contraseña: e.target.value,
                      })
                    }
                  />
                </Field>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md w-full sm:w-auto"
                  >
                    Guardar
                  </Button>
                  <Button
                    type="button"
                    onClick={cleanForm}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-2 rounded-md w-full sm:w-auto"
                  >
                    Cancelar
                  </Button>
                </div>
              </FieldGroup>
            </FieldSet>
          </form>
        </div>
      )}

      {step === 2 && userData && (
        <div className="w-full max-w-3xl">
          <h1 className="font-bold text-start text-xl mb-4 text-black">
            {es_alumno ? "Asociar Carrera" : "Registrar Sueldo"}
          </h1>
          <span className="block w-full h-[2px] bg-sky-950 mb-6"></span>

          <form onSubmit={handleSecondStep} className="space-y-6">
            <FieldSet>
              <FieldGroup className="space-y-5">
                {es_alumno ? (
                  <Field>
                    <FieldLabel>
                      Carrera <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select
                      value={carrera_seleccionada}
                      onValueChange={setCarreraSeleccionada}
                    >
                      <SelectTrigger className="w-full sm:w-[80%] md:w-[70%]">
                        <SelectValue placeholder="Seleccioná una carrera" />
                      </SelectTrigger>
                      <SelectContent>
                        {carreras.map((carrera) => (
                          <SelectItem key={carrera.id_carrera} value={carrera.id_carrera}>
                            {carrera.nombre || carrera.nombre_carrera || carrera.id_carrera}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                ) : (
                  <>
                    <Field>
                      <FieldLabel>
                        CBU <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        id="cbu"
                        placeholder="Número de CBU"
                        value={sueldoForm.cbu}
                        onChange={(e) =>
                          setSueldoForm({ ...sueldoForm, cbu: e.target.value })
                        }
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Sueldo Adicional</FieldLabel>
                      <Input
                        id="sueldo_adicional"
                        type="number"
                        step="0.01"
                        placeholder="Bonos o plus (opcional)"
                        value={sueldoForm.sueldo_adicional}
                        onChange={(e) =>
                          setSueldoForm({ ...sueldoForm, sueldo_adicional: e.target.value })
                        }
                      />
                    </Field>

                    <Field>
                      <FieldLabel>Observaciones</FieldLabel>
                      <Input
                        id="observaciones"
                        placeholder="Notas adicionales (opcional)"
                        value={sueldoForm.observaciones}
                        onChange={(e) =>
                          setSueldoForm({ ...sueldoForm, observaciones: e.target.value })
                        }
                      />
                    </Field>
                  </>
                )}

                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md w-full sm:w-auto"
                  >
                    {es_alumno ? "Asociar Carrera" : "Registrar Sueldo"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setCompleted(true);
                      setStep(3);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-2 rounded-md w-full sm:w-auto"
                  >
                    Omitir
                  </Button>
                </div>
              </FieldGroup>
            </FieldSet>
          </form>
        </div>
      )}

      {/* Resultado */}
      {step === 3 && completed && userData && (
        <CardUsuario
          title="Se ha dado de alta exitosamente"
          user={userData.user || userData}
          onClose={cleanForm}
        />
      )}

      {error && (
        <PopUp
          title="Error al dar de alta al usuario"
          message={error}
          onClose={cleanForm}
        />
      )}
    </div>
  );
}
