import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  validateCBU,
  validatePorcentaje,
  validateMaxLength,
} from "@/utils/validations";
import { obtenerCarreras } from "@/api/carrerasApi";

const RolSelector = ({
  rolesOptions,
  rolSeleccionado,
  loadingRoles,
  onSelect,
}) => (
  <Field>
    <FieldLabel>
      Rol de Usuario <span className="text-red-500">*</span>
    </FieldLabel>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full sm:w-[80%] md:w-[70%] justify-start"
        >
          {rolesOptions.find((r) => r.id === rolSeleccionado)?.label ||
            "Seleccioná un rol"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-2 max-h-[300px] overflow-y-auto">
        {loadingRoles ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">
              Cargando roles...
            </span>
          </div>
        ) : rolesOptions.length === 0 ? (
          <div className="text-center py-4 text-sm text-gray-500">
            No hay roles disponibles
          </div>
        ) : (
          rolesOptions.map((rol) => (
            <div
              key={rol.id}
              className="flex items-center space-x-2 py-1 cursor-pointer hover:bg-gray-100"
              onClick={() => onSelect(rol.id)}
            >
              <Checkbox checked={rolSeleccionado === rol.id} readOnly />
              <label className="cursor-pointer">{rol.label}</label>
            </div>
          ))
        )}
      </PopoverContent>
    </Popover>
  </Field>
);

const CarreraSelector = ({ carreraSeleccionada, onSelect }) => {
  const [carreras, setCarreras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCarreras = async () => {
      setLoading(true);
      try {
        const data = await obtenerCarreras();
        setCarreras(data);
      } catch (error) {
        console.error("Error al cargar carreras:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCarreras();
  }, []);

  const carrerasFiltradas = carreras.filter((carrera) =>
    carrera.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const carreraSeleccionadaObj = carreras.find(
    (c) => c.uuid === carreraSeleccionada
  );

  return (
    <Field>
      <FieldLabel>
        Carrera <span className="text-red-500">*</span>
      </FieldLabel>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full sm:w-[80%] md:w-[70%] justify-start"
          >
            {carreraSeleccionadaObj?.name || "Seleccioná una carrera"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-2 max-h-[300px] overflow-y-auto">
          <div className="mb-2">
            <Input
              placeholder="Buscar carrera..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-600">
                Cargando carreras...
              </span>
            </div>
          ) : carrerasFiltradas.length === 0 ? (
            <div className="text-center py-4 text-sm text-gray-500">
              {searchTerm
                ? "No se encontraron carreras"
                : "No hay carreras disponibles"}
            </div>
          ) : (
            carrerasFiltradas.map((carrera) => (
              <div
                key={carrera.uuid}
                className="flex items-center space-x-2 py-1 cursor-pointer hover:bg-gray-100 rounded px-2"
                onClick={() => onSelect(carrera.uuid)}
              >
                <Checkbox
                  checked={carreraSeleccionada === carrera.uuid}
                  readOnly
                />
                <label className="cursor-pointer">{carrera.name}</label>
              </div>
            ))
          )}
        </PopoverContent>
      </Popover>
    </Field>
  );
};

const DatosPersonales = ({ form, setForm, isModificacion = false }) => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Field>
        <FieldLabel>
          Nombre/s <span className="text-red-500">*</span>
        </FieldLabel>
        <Input
          id="nombre"
          value={form.nombre}
          onChange={(e) => {
            const value = e.target.value
              .split(" ")
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join(" ");
            setForm({ ...form, nombre: value });
          }}
        />
      </Field>

      <Field>
        <FieldLabel>
          Apellido/s <span className="text-red-500">*</span>
        </FieldLabel>
        <Input
          id="apellido"
          value={form.apellido}
          onChange={(e) => {
            const value = e.target.value
              .split(" ")
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join(" ");
            setForm({ ...form, apellido: value });
          }}
        />
      </Field>
    </div>

    <Field>
      <FieldLabel>
        N° Documento (DNI) <span className="text-red-500">*</span>
      </FieldLabel>
      <Input
        id="dni"
        value={form.dni}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, "");
          setForm({ ...form, dni: value });
        }}
        maxLength={8}
        minLength={8}
      />
      <p className="text-gray-500 text-xs mt-1">
        {form.dni.length}/8 caracteres
      </p>
    </Field>

    <Field>
      <FieldLabel>
        Correo Electrónico Personal <span className="text-red-500">*</span>
      </FieldLabel>
      <Input
        id="email_personal"
        type="email"
        value={form.email_personal}
        onChange={(e) => setForm({ ...form, email_personal: e.target.value })}
      />
    </Field>

    <Field>
      <FieldLabel>
        Teléfono/Celular <span className="text-red-500">*</span>
      </FieldLabel>
      <Input
        id="telefono_personal"
        value={form.telefono_personal}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, "");
          setForm({ ...form, telefono_personal: value });
        }}
        maxLength={15}
      />
    </Field>

    {isModificacion && (
      <>
        <div className="pt-4 pb-2">
          <h3 className="font-bold text-lg text-sky-950">Cambiar Contraseña</h3>
          <span className="block w-full h-[1px] bg-sky-950 mt-2"></span>
          <p className="text-xs text-gray-500 mt-2">
            Dejá este campo vacío si no deseas cambiar la contraseña
          </p>
        </div>

        <Field>
          <FieldLabel>Nueva Contraseña</FieldLabel>
          <div className="relative">
            <Input
              id="contraseña"
              type={form.showPassword ? "text" : "password"}
              value={form.contraseña || ""}
              onChange={(e) => setForm({ ...form, contraseña: e.target.value })}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() =>
                setForm({ ...form, showPassword: !form.showPassword })
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {form.showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>
        </Field>
      </>
    )}
  </>
);

const DatosSueldo = ({ sueldoForm, onChange, errors = {} }) => (
  <>
    <div className="pt-6 pb-2">
      <h3 className="font-bold text-lg text-sky-950">Datos de Sueldo</h3>
      <span className="block w-full h-[1px] bg-sky-950 mt-2"></span>
    </div>

    <Field>
      <FieldLabel htmlFor="cbu">
        CBU <span className="text-red-500">*</span>
      </FieldLabel>
      <Input
        id="cbu"
        value={sueldoForm.cbu}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, "");
          onChange("cbu", value);
        }}
        maxLength={22}
        className={errors.cbu ? "border-red-500" : ""}
      />
      {errors.cbu && <p className="text-red-500 text-xs mt-1">{errors.cbu}</p>}
      <p className="text-gray-500 text-xs mt-1">
        {sueldoForm.cbu.length}/22 caracteres
      </p>
    </Field>

    <Field>
      <FieldLabel htmlFor="sueldo_fijo">Sueldo Base (del rol)</FieldLabel>
      <Input
        id="sueldo_fijo"
        type="text"
        value={`$ ${sueldoForm.sueldo_fijo}`}
        readOnly
        disabled
        className="bg-gray-100 cursor-not-allowed"
      />
      <p className="text-gray-500 text-xs mt-1">
        Este valor proviene del rol seleccionado
      </p>
    </Field>

    <Field>
      <FieldLabel htmlFor="sueldo_adicional">
        Porcentaje Adicional (%)
      </FieldLabel>
      <Input
        id="sueldo_adicional"
        type="number"
        value={sueldoForm.sueldo_adicional}
        onChange={(e) => onChange("sueldo_adicional", e.target.value)}
        min={0}
        max={100}
        step="0.01"
        className={errors.sueldo_adicional ? "border-red-500" : ""}
      />
      {errors.sueldo_adicional && (
        <p className="text-red-500 text-xs mt-1">{errors.sueldo_adicional}</p>
      )}
    </Field>

    <Field>
      <FieldLabel htmlFor="observaciones">Observaciones</FieldLabel>
      <Textarea
        id="observaciones"
        value={sueldoForm.observaciones}
        onChange={(e) => onChange("observaciones", e.target.value)}
        maxLength={500}
        className={errors.observaciones ? "border-red-500" : ""}
      />
      {errors.observaciones && (
        <p className="text-red-500 text-xs mt-1">{errors.observaciones}</p>
      )}
      <p className="text-gray-500 text-xs mt-1">
        {sueldoForm.observaciones.length}/500 caracteres
      </p>
    </Field>
  </>
);

export default function FormUsuarios({
  initialForm,
  initialRolSeleccionado,
  initialCarreraSeleccionada,
  initialSueldoForm,
  rolesOptions,
  carrerasMock,
  loadingRoles,
  loadingSubmit = false,
  onSubmit,
  onCancel,
  isModificacion = false,
  categoriaRol = null,
}) {
  const [form, setForm] = useState(initialForm);
  const [rolSeleccionado, setRolSeleccionado] = useState(
    initialRolSeleccionado
  );
  const [carreraSeleccionada, setCarreraSeleccionada] = useState(
    initialCarreraSeleccionada
  );
  const [sueldoForm, setSueldoForm] = useState(initialSueldoForm);
  const [sueldoErrors, setSueldoErrors] = useState({});
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  useEffect(
    () => setRolSeleccionado(initialRolSeleccionado),
    [initialRolSeleccionado]
  );
  useEffect(
    () => setCarreraSeleccionada(initialCarreraSeleccionada),
    [initialCarreraSeleccionada]
  );
  useEffect(() => setForm(initialForm), [initialForm]);
  useEffect(() => setSueldoForm(initialSueldoForm), [initialSueldoForm]);

  useEffect(() => {
    if (isModificacion && categoriaRol) {
      setCategoriaSeleccionada(categoriaRol);
      return;
    }

    if (rolSeleccionado && rolesOptions) {
      const rolEncontrado = rolesOptions.find((r) => r.id === rolSeleccionado);
      if (rolEncontrado) {
        setCategoriaSeleccionada(rolEncontrado.categoria);
        if (rolEncontrado.categoria !== "ALUMNO") {
          setCarreraSeleccionada("");
          setSueldoForm((prev) => ({
            ...prev,
            sueldo_fijo: rolEncontrado.sueldo_base || "0.00",
          }));
        }
      }
    } else {
      setCategoriaSeleccionada("");
      setCarreraSeleccionada("");
    }
  }, [rolSeleccionado, rolesOptions, isModificacion, categoriaRol]);

  const validateSueldoForm = () => {
    const newErrors = {};

    const cbuError = validateCBU(sueldoForm.cbu);
    if (cbuError) newErrors.cbu = cbuError;

    const sueldoAdicionalError = validatePorcentaje(
      sueldoForm.sueldo_adicional
    );
    if (sueldoAdicionalError) newErrors.sueldo_adicional = sueldoAdicionalError;

    const observacionesError = validateMaxLength(sueldoForm.observaciones, 500);
    if (observacionesError) newErrors.observaciones = observacionesError;

    setSueldoErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const {
      nombre,
      apellido,
      dni,
      email_personal,
      telefono_personal,
      contraseña,
    } = form;

    if (
      !nombre ||
      !apellido ||
      !dni ||
      !email_personal ||
      !telefono_personal ||
      (!isModificacion && !rolSeleccionado)
    ) {
      return "Por favor, completá todos los campos obligatorios.";
    }

    // Validar DNI (8 dígitos) - limpiar espacios y validar
    const dniLimpio = dni.toString().trim();
    if (dniLimpio.length !== 8) {
      return "El DNI debe tener exactamente 8 dígitos.";
    }

    if (isModificacion && contraseña && contraseña.trim()) {
      if (contraseña.length < 8) {
        return "La contraseña debe tener al menos 8 caracteres.";
      }
    }

    if (categoriaSeleccionada === "ALUMNO" && !carreraSeleccionada) {
      return "Por favor, seleccioná una carrera para el alumno.";
    }

    if (categoriaSeleccionada !== "ALUMNO" && !validateSueldoForm()) {
      return "Por favor, corregí los errores en los datos de sueldo.";
    }

    return null;
  };

  const handleSueldoChange = (field, value) => {
    setSueldoForm({ ...sueldoForm, [field]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    console.log("Form data:", form);
    console.log("DNI value:", form.dni, "Length:", form.dni?.length);
    console.log("Categoria:", categoriaSeleccionada);

    const validationError = validateForm();
    if (validationError) {
      console.log("Validation error:", validationError);
      onSubmit(null, validationError);
      return;
    }

    onSubmit(
      {
        datosPersonales: form,
        rolSeleccionado,
        categoriaSeleccionada,
        carreraSeleccionada,
        sueldoForm: categoriaSeleccionada !== "ALUMNO" ? sueldoForm : null,
      },
      null
    );
  };

  const esAlumno = categoriaSeleccionada === "ALUMNO";
  const mostrarSueldo = categoriaSeleccionada && !esAlumno;

  if (loadingSubmit) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        <p className="text-lg font-semibold text-gray-700">
          Guardando usuario...
        </p>
        <p className="text-sm text-gray-500">Por favor, esperá un momento</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <FieldSet>
        <FieldGroup className="space-y-5">
          {!isModificacion && (
            <RolSelector
              rolesOptions={rolesOptions || []}
              rolSeleccionado={rolSeleccionado}
              loadingRoles={loadingRoles}
              onSelect={setRolSeleccionado}
            />
          )}

          {esAlumno && (
            <CarreraSelector
              carreraSeleccionada={carreraSeleccionada}
              onSelect={setCarreraSeleccionada}
            />
          )}

          <DatosPersonales
            form={form}
            setForm={setForm}
            isModificacion={isModificacion}
          />

          {mostrarSueldo && (
            <DatosSueldo
              sueldoForm={sueldoForm}
              onChange={handleSueldoChange}
              errors={sueldoErrors}
            />
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md w-full sm:w-auto"
            >
              Guardar
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-2 rounded-md w-full sm:w-auto"
            >
              Cancelar
            </Button>
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
