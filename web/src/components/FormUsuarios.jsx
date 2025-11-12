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

const CarreraSelector = ({ carreras, carreraSeleccionada, onSelect }) => (
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
          {carreras.find((c) => c.id === carreraSeleccionada)?.nombre ||
            "Seleccioná una carrera"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-2 max-h-[300px] overflow-y-auto">
        {carreras.map((carrera) => (
          <div
            key={carrera.id}
            className="flex items-center space-x-2 py-1 cursor-pointer hover:bg-gray-100"
            onClick={() => onSelect(carrera.id)}
          >
            <Checkbox checked={carreraSeleccionada === carrera.id} readOnly />
            <label className="cursor-pointer">{carrera.nombre}</label>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  </Field>
);

const DatosPersonales = ({ form, setForm }) => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <Field>
        <FieldLabel>
          Nombre/s <span className="text-red-500">*</span>
        </FieldLabel>
        <Input
          id="nombre"
          placeholder="Nombre/s"
          value={form.nombre}
          onChange={(e) => {
            const value = e.target.value
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ');
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
          placeholder="Apellido/s"
          value={form.apellido}
          onChange={(e) => {
            const value = e.target.value
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ');
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
        placeholder="DNI sin puntos"
        value={form.dni}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, "");
          setForm({ ...form, dni: value });
        }}
        maxLength={10}
      />
      <p className="text-gray-500 text-xs mt-1">
        {form.dni.length}/10 caracteres
      </p>
    </Field>

    <Field>
      <FieldLabel>
        Correo Electrónico Personal <span className="text-red-500">*</span>
      </FieldLabel>
      <Input
        id="email_personal"
        type="email"
        placeholder="correo@ejemplo.com"
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
        placeholder="Ej: 1234567890"
        value={form.telefono_personal}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, "");
          setForm({ ...form, telefono_personal: value });
        }}
        maxLength={15}
      />
    </Field>
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
        placeholder="Número de CBU (22 dígitos)"
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
        placeholder="Porcentaje adicional (0-100%)"
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
        placeholder="Notas adicionales..."
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
    const { nombre, apellido, dni, email_personal, telefono_personal } = form;

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

    const validationError = validateForm();
    if (validationError) {
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
              carreras={carrerasMock}
              carreraSeleccionada={carreraSeleccionada}
              onSelect={setCarreraSeleccionada}
            />
          )}

          <DatosPersonales form={form} setForm={setForm} />

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
