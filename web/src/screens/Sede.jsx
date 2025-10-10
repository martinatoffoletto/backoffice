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
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import { Radio } from "lucide-react"

export default function Sede(second) {
    return(
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
                <h1 className="font-bold text-center text-xl mb-6">Sede</h1>

                <FieldSet>
                <FieldGroup>
                    <Field>
                    <FieldLabel htmlFor="name">Denominación</FieldLabel>
                    <Input id="name" placeholder="Denominación" />
                    </Field>

                    <Field>
                    <FieldLabel htmlFor="address">Dirección</FieldLabel>
                    <Input id="address" placeholder="Dirección" />
                    </Field>

                    <Field>
                    <FieldLabel htmlFor="aulas">Cantidad de aulas</FieldLabel>
                    <Input id="aulas" placeholder="500" />
                    </Field>

                    <Field>
                    <FieldLabel htmlFor="comedor">¿Tiene comedor?</FieldLabel>
                    <RadioGroup className="flex flex-row gap-4" defaultValue="no" id="comedor">
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="si" id="comedor-si" />
                        <label htmlFor="comedor-si">Sí</label>
                        </div>
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="comedor-no" />
                        <label htmlFor="comedor-no">No</label>
                        </div>
                    </RadioGroup>
                    </Field>

                    <Field>
                    <FieldLabel htmlFor="biblioteca">¿Tiene biblioteca?</FieldLabel>
                    <RadioGroup className="flex flex-row gap-4" defaultValue="no" id="biblioteca">
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="si" id="biblioteca-si" />
                        <label htmlFor="biblioteca-si">Sí</label>
                        </div>
                        <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="biblioteca-no" />
                        <label htmlFor="biblioteca-no">No</label>
                        </div>
                    </RadioGroup>
                    </Field>

                    <div className="flex justify-center">
                    <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded mt-4">
                        Guardar
                    </Button>
                    </div>
                </FieldGroup>
                </FieldSet>
            </div>
            </div>
    )
}