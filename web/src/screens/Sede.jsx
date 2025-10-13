import PopUp from "@/components/PopUp"
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

import { useState } from "react"

export default function Sede({action, Sede, onClose}) {

    const actionType = action || "Agregar"; // "create" o "view"
    const {sede} = Sede || {}; // Datos de la sede si action es "view"
    const[form, setForm] = useState({
        denominacion: sede ? sede.name : "",
        direccion: sede ? sede.address : "",
        cantidadAulas: sede ? sede.cantidadAulas : "",
        tieneComedor: sede ? sede.tieneComedor : "",
        tieneBiblioteca: sede ? sede.tieneBiblioteca : ""
    });
    const [error, setError] = useState(null);
    
    const handleSubmit = async(e) => {
        try{
            e.preventDefault();
            const response = await fetch('/api/sedes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            const data = await response.json();
            console.log('Éxito:', data);
            alert("Sede creada con éxito");

        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        }
    }

    return(
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
                <h1 className="font-bold text-center text-xl mb-6">{actionType} Sede</h1>

                <FieldSet>
                <FieldGroup>
                    <Field>
                    <FieldLabel htmlFor="name">Denominación</FieldLabel>
                    <Input id="name" placeholder="Denominación" value={form.denominacion} onChange={(e)=>setForm({...form, denominacion: e.target.value})}/>
                    </Field>

                    <Field>
                    <FieldLabel htmlFor="address">Dirección</FieldLabel>
                    <Input id="address" placeholder="Dirección"  value={form.direccion} onChange={(e)=>setForm({...form, direccion: e.target.value})}/>
                    </Field>

                    <Field>
                    <FieldLabel htmlFor="aulas">Cantidad de aulas</FieldLabel>
                    <Input id="aulas" placeholder="500"  value={form.cantidadAulas} onChange={(e)=>setForm({...form, cantidadAulas: e.target.value})}/>
                    </Field>

                    <Field>
                    <FieldLabel>¿Tiene comedor?</FieldLabel>
                    <RadioGroup
                    className="flex flex-row gap-4"
                    value={form.tieneComedor}
                    onValueChange={(value) => setForm({ ...form, tieneComedor: value })}
                    >
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
                    <FieldLabel >¿Tiene biblioteca?</FieldLabel>
                    <RadioGroup
                    className="flex flex-row gap-4"
                    value={form.tieneBiblioteca}
                    onValueChange={(value) => setForm({ ...form, tieneBiblioteca: value })}
                    >
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
                    <Button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded mt-4"
                    onClick={async (e) => {
                        await handleSubmit(e);
                        if (onClose) onClose();
                    }}
                    >
                    Guardar
                    </Button>
                    <Button
                    variant="outline"
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mt-4 ml-2"
                    onClick={onClose}
                    >
                    Cancelar
                    </Button>
                    </div>
                </FieldGroup>
                </FieldSet>
            </div>
            {
                error && <PopUp title="Error" message={error} onClose={() => setError(null)}/>
            }
        </div>
    )
}