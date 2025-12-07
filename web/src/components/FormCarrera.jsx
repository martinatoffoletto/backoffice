import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function FormCarrera({
  form,
  setForm,
  onSubmit,
  onCancel,
  showCancel = false,
}) {
  return (
    <form onSubmit={onSubmit} className="mt-8">
      <FieldSet>
        <FieldGroup>
          {/* Primera fila - 2 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field>
              <FieldLabel htmlFor="name">
                Nombre de Carrera<span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="name"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="code">
                Código<span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="code"
                value={form.code}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, code: e.target.value }))
                }
              />
            </Field>
          </div>

          {/* Segunda fila - 2 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field>
              <FieldLabel htmlFor="degree_title">
                Título<span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="degree_title"
                value={form.degree_title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, degree_title: e.target.value }))
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="faculty">
                Facultad<span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="faculty"
                value={form.faculty}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, faculty: e.target.value }))
                }
              />
            </Field>
          </div>

          {/* Tercera fila - Descripción completa */}
          <div>
            <Field>
              <FieldLabel htmlFor="description">
                Descripción<span className="text-red-500">*</span>
              </FieldLabel>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={3}
              />
            </Field>
          </div>

          {/* Cuarta fila - 3 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field>
              <FieldLabel htmlFor="modality">
                Modalidad<span className="text-red-500">*</span>
              </FieldLabel>
              <Select
                value={form.modality}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, modality: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione modalidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="virtual">Virtual</SelectItem>
                  <SelectItem value="mixta">Mixta</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="duration_hours">
                Duración en Horas
              </FieldLabel>
              <Input
                type="number"
                id="duration_hours"
                value={form.duration_hours}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    duration_hours: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="duration_years">Duración en Años</FieldLabel>
              <Input
                type="number"
                id="duration_years"
                value={form.duration_years}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    duration_years: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </Field>
          </div>

          {/* Botones */}
          <div className="flex justify-center gap-4 mt-5">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md"
            >
              Guardar
            </Button>
            {showCancel && (
              <Button
                type="button"
                onClick={onCancel}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold px-6 py-2 rounded-md"
              >
                Cancelar
              </Button>
            )}
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
