export const validateCBU = (value) => {
  if (!value) return "Este campo es obligatorio";
  if (value.length !== 22) return "El CBU debe tener exactamente 22 dígitos";
  if (!/^\d{22}$/.test(value)) return "El CBU solo debe contener números";
  return null;
};

export const validatePorcentaje = (value) => {
  if (!value) return "Este campo es obligatorio";
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return "Debe ser un número válido";
  if (numValue < 0) return "El valor mínimo es 0%";
  if (numValue > 100) return "El valor máximo es 100%";
  return null;
};

export const validateMaxLength = (value, maxLength) => {
  if (value && value.length > maxLength) {
    return `Máximo ${maxLength} caracteres`;
  }
  return null;
};
