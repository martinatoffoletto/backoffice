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
import CardUsuario from "./CardUsuario"

export default function SueldoForm() {
  const [form, setForm] = useState({
    cbu: "",
    sueldo_fijo: "",
    sueldo_adicional: 0,
    sueldo_total: 0,
    observaciones: "",
  })

  const [error, setError] = useState(null)
  const [completed, setCompleted]=useState(false)

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
    if ( !form.cbu || !form.sueldo_fijo) {
      setError("Por favor, completá todos los campos obligatorios.")
      return
    }
    try{
      setCompleted(true)

    }catch(err){
      setError(err)
    }
  }

  const clearForm=()=>{
    setForm({
      cbu: "",
      sueldo_fijo: "",
      sueldo_adicional: 0,
      sueldo_total: 0,
      observaciones: "",
    })
  }

  return (
    <div className="flex min-h-screen max-w-2xl items-center justify-center ">

      {!completed &&(<form
        onSubmit={handleSubmit}
        className="w-full min-w-2xl py-6 "
      >
        <h1 className="font-bold text-xl mb-6">
          Registrar Sueldo
        </h1>
        <span className="block w-full h-[3px] bg-sky-950 mb-6"></span>

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
              <Button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold" >
                Guardar Sueldo
              </Button>
            </div>
          </FieldGroup>
        </FieldSet>
      </form>)}
      {
        completed && (
          <div className="flex flex-col justify-center items-center border border-green-500 p-4 rounded-md shadow-sm gap-4 w-full max-w-md mx-auto my-4 bg-white">
              <CardUsuario title={"Sueldo dado de alta exitosamente"} />
              <Button
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-md"
              onClick={()=>{setCompleted(false); clearForm()}}>
                OK
              </Button>
          </div>
          
        )
      }
    </div>
  )
}
