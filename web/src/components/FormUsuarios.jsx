import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

export default function FormUsuarios({
  form,
  setForm,
  selectedValues,
  setSelectedValues,
  handleSubmit,
  cleanForm,
}) {
  const options = ["Administrador", "Administrativo IT", "Docente", "Alumno", "Administrativo Docente", "Administrativo Biblioteca", "Chef", "Cajero", "Administrativo Academico", "Administrativo Financiero"];

  const toggleValue = (value) => {
    setSelectedValues((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
    setForm({ ...form, tipoUsuario: selectedValues });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FieldSet>
        <FieldGroup className="space-y-5">
          {/* Tipo de usuario */}
          <Field>
            <FieldLabel>
              Tipo de Usuario <span className="text-red-500">*</span>
            </FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-[80%] md:w-[70%] justify-start"
                >
                  {selectedValues.length > 0
                    ? selectedValues.join(", ")
                    : "Seleccioná tipo(s) de usuario"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[250px] p-2">
                {options.map((opt) => (
                  <div
                    key={opt}
                    className="flex items-center space-x-2 py-1 cursor-pointer"
                    onClick={() => toggleValue(opt)}
                  >
                    <Checkbox checked={selectedValues.includes(opt)} />
                    <label>{opt}</label>
                  </div>
                ))}
              </PopoverContent>
            </Popover>
          </Field>

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
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
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
                onChange={(e) => setForm({ ...form, apellido: e.target.value })}
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
              onChange={(e) => setForm({ ...form, nroDocumento: e.target.value })}
            />
          </Field>

          <Field>
            <FieldLabel>
              Correo Electrónico <span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              id="correo"
              placeholder="Correo Electrónico"
              value={form.correoElectronico}
              onChange={(e) => setForm({ ...form, correoElectronico: e.target.value })}
            />
          </Field>

          
            <Field>
              <FieldLabel>
                Teléfono/Celular <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                id="telefono_Celular"
                placeholder="Teléfono/Celular"
                value={form.telefono_Celular}
                onChange={(e) => setForm({ ...form, telefono_Celular: e.target.value })}
              />
            </Field>
          

          {selectedValues.includes("Alumno") && (
            <Field>
            <FieldLabel>
              Carrera <span className="text-red-500">*</span>
            </FieldLabel>
            <Input
              id="carrera"
              placeholder="Carrera"
              value={form.carrera}
              onChange={(e) => setForm({ ...form, carrera: e.target.value })}
            />
          </Field>
          )}

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
  );
}
