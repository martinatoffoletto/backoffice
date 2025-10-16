import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldSet,
} from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

export default function SueldoForm() {
  const [form, setForm] = useState({
    cbu: "",
    sueldo_fijo: "",
    sueldo_adicional: 0,
    sueldo_total: 0,
    observaciones: "",
  })

  const [error, setError] = useState("")

  const handleChange = (field, value) => {
    let updated = { ...form, [field]: value }

    // Calcular sueldo_total automáticamente
    if (field === "sueldo_fijo" || field === "sueldo_adicional") {
      const fijo = parseFloat(updated.sueldo_fijo) || 0
      const adicional = parseFloat(updated.sueldo_adicional) || 0
      updated.sueldo_total = fijo + adicional
    }

    setForm(updated)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validación de campos obligatorios
    if (!form.id_usuario || !form.cbu || !form.sueldo_fijo) {
      setError("Por favor, completá todos los campos obligatorios.")
      return
    }

    setError("")
    console.log("Formulario enviado:", form)
    alert("Sueldo registrado con éxito")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full min-w-2xl bg-white p-6 rounded-xl shadow-md"
      >
        <h1 className="font-bold text-center text-2xl mb-6">
          Registrar Sueldo
        </h1>

        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="cbu">
                CBU <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="cbu"
                placeholder="Número de CBU"
                value={form.cbu}
                onChange={(e) => handleChange("cbu", e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="sueldo_fijo">
                Sueldo Fijo <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="sueldo_fijo"
                type="number"
                placeholder="Monto base"
                value={form.sueldo_fijo}
                onChange={(e) => handleChange("sueldo_fijo", e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="sueldo_adicional">Sueldo Adicional</FieldLabel>
              <Input
                id="sueldo_adicional"
                type="number"
                placeholder="Bonos o plus (opcional)"
                value={form.sueldo_adicional}
                onChange={(e) => handleChange("sueldo_adicional", e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="sueldo_total">Sueldo Total</FieldLabel>
              <Input
                id="sueldo_total"
                type="number"
                readOnly
                value={form.sueldo_total}
                className="bg-gray-100"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="observaciones">Observaciones</FieldLabel>
              <Textarea
                id="observaciones"
                placeholder="Notas adicionales..."
                value={form.observaciones}
                onChange={(e) => handleChange("observaciones", e.target.value)}
              />
            </Field>


            {error && (
              <p className="text-red-500 text-sm text-center mt-2">{error}</p>
            )}

            <div className="flex justify-center mt-6">
              <Button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold">
                Guardar Sueldo
              </Button>
            </div>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  )
}
