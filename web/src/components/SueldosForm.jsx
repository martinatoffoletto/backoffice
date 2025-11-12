import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup, FieldSet } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import CardUsuario from "./CardUsuario";

const INITIAL_FORM_STATE = {
  cbu: "",
  sueldo_fijo: "0.00",
  sueldo_adicional: "",
  observaciones: "",
};

const VALIDATION_RULES = {
  cbu: {
    required: true,
    minLength: 22,
    maxLength: 22,
    pattern: /^\d{22}$/,
  },
  sueldo_adicional: {
    required: false,
    min: 0,
    max: 100,
  },
  observaciones: {
    required: false,
    maxLength: 500,
  },
};

export default function SueldoForm({ userData, onClose }) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [completed, setCompleted] = useState(false);
  const [form, setForm] = useState({
    cbu: userData?.cbu || "",
    sueldo_fijo: userData?.sueldo_fijo || "0.00",
    sueldo_adicional: userData?.sueldo_adicional || "",
    observaciones: userData?.observaciones || "",
  });

  const validateField = (field, value) => {
    const rules = VALIDATION_RULES[field];
    if (!rules) return null;

    if (rules.required && !value) {
      return "Este campo es obligatorio";
    }

    if (field === "cbu") {
      if (value && value.length !== rules.maxLength) {
        return `El CBU debe tener exactamente ${rules.maxLength} dígitos`;
      }
      if (value && !rules.pattern.test(value)) {
        return "El CBU solo debe contener números";
      }
    }

    if (field === "sueldo_adicional") {
      const numValue = parseFloat(value);
      if (value && isNaN(numValue)) {
        return "Debe ser un número válido";
      }
      if (value && numValue < rules.min) {
        return `El valor mínimo es ${rules.min}%`;
      }
      if (value && numValue > rules.max) {
        return `El valor máximo es ${rules.max}%`;
      }
    }

    if (field === "observaciones" && value && value.length > rules.maxLength) {
      return `Máximo ${rules.maxLength} caracteres`;
    }

    return null;
  };

  const handleChange = (field, value) => {
    const updated = { ...form, [field]: value };
    setForm(updated);

    const error = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(VALIDATION_RULES).forEach((field) => {
      const error = validateField(field, form[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setCompleted(true);
      setErrors({});
    } catch (err) {
      setErrors({ submit: err.message || "Error al guardar el sueldo" });
    }
  };

  const handleOk = () => {
    setForm(INITIAL_FORM_STATE);
    onClose ? onClose() : navigate("/");
  };

  return (
    <div className="flex flex-col items-start justify-start w-full min-h-screen overflow-x-hidden">
      <h1 className="font-bold text-xl mb-6">Registrar Sueldo</h1>
      <span className="block w-full h-[3px] bg-sky-950 mb-6"></span>

      {!completed ? (
        <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white py-6">
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="cbu">
                  CBU <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="cbu"
                  placeholder="Número de CBU (22 dígitos)"
                  value={form.cbu}
                  onChange={(e) => handleChange("cbu", e.target.value)}
                  maxLength={22}
                  className={errors.cbu ? "border-red-500" : ""}
                />
                {errors.cbu && (
                  <p className="text-red-500 text-xs mt-1">{errors.cbu}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  {form.cbu.length}/22 caracteres
                </p>
              </Field>

              <Field>
                <FieldLabel htmlFor="sueldo_fijo">
                  Sueldo Base (del rol)
                </FieldLabel>
                <Input
                  id="sueldo_fijo"
                  type="text"
                  value={`$ ${form.sueldo_fijo}`}
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
                  value={form.sueldo_adicional}
                  onChange={(e) =>
                    handleChange("sueldo_adicional", e.target.value)
                  }
                  min={0}
                  max={100}
                  step="0.01"
                  className={errors.sueldo_adicional ? "border-red-500" : ""}
                />
                {errors.sueldo_adicional && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.sueldo_adicional}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="observaciones">Observaciones</FieldLabel>
                <Textarea
                  id="observaciones"
                  placeholder="Notas adicionales..."
                  value={form.observaciones}
                  onChange={(e) =>
                    handleChange("observaciones", e.target.value)
                  }
                  maxLength={500}
                  className={errors.observaciones ? "border-red-500" : ""}
                />
                {errors.observaciones && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.observaciones}
                  </p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  {form.observaciones.length}/500 caracteres
                </p>
              </Field>

              {errors.submit && (
                <p className="text-red-500 text-sm text-center mt-2">
                  {errors.submit}
                </p>
              )}

              <div className="flex justify-center mt-6">
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold"
                >
                  Guardar Sueldo
                </Button>
              </div>
            </FieldGroup>
          </FieldSet>
        </form>
      ) : (
        <div className="flex flex-col justify-center items-center border border-green-500 p-4 rounded-md shadow-sm gap-4 w-full max-w-md mx-auto my-4 bg-white">
          <CardUsuario title="Sueldo dado de alta exitosamente" />
          <Button
            className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-md"
            onClick={handleOk}
          >
            OK
          </Button>
        </div>
      )}
    </div>
  );
}
