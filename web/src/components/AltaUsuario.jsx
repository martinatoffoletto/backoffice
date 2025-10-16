import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox";
import PopUp from "@/components/PopUp";
import CardUsuario from "./CardUsuario";
import SueldoForm from "./SueldosForm";
import { useState } from "react";

export default function AltaUsuario() {
  const [form, setForm] = useState({
    tipoUsuario: [],
    nombre: "",
    apellido: "",
    nroDocumento: "",
    correoElectronico: "",
    telefonoPersonal: "",
    telefonoLaboral: "",
    carrera: "",
  });
  const [selectedValues, setSelectedValues] = useState([]);
  const [showPopUp, setShowPopUp] = useState(false);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [userData, setUserData] = useState(null);

  const options = ["Administrador", "Docente", "Alumno"];

  const toggleValue = (value) => {
    setSelectedValues((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const cleanForm = () => {
    setForm({
      tipoUsuario: [],
      nombre: "",
      apellido: "",
      nroDocumento: "",
      correoElectronico: "",
      telefonoPersonal: "",
      telefonoLaboral: "",
      carrera: "",
    });
    setSelectedValues([]);
    setError(null);
    setCompleted(false);
    setShowPopUp(false);
    setUserData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.apellido || !form.nroDocumento || !form.correoElectronico || !form.telefonoPersonal) {
      setError("Por favor, completá todos los campos obligatorios.")
      return
    }
    try {
      // const response = await altaUsuario(form);
      // setUserData(response);
      setCompleted(true);
      setShowPopUp(true);
    } catch (err) {
      console.error("Error al dar de alta el usuario:", err);
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-start bg-gray-50 mt-4">
      {!completed && (
        <div className="w-full min-w-2xl bg-white p-8 rounded-xl shadow-md">
          <h1 className="font-bold text-start text-xl mb-4">Alta de Usuario</h1>
          <span className="block w-full h-[2px] bg-sky-950"></span>

          <form onSubmit={handleSubmit} className="space-y-5 mt-8">
            <FieldSet>
              <FieldGroup className="space-y-5">
                <Field>
                  <FieldLabel>Tipo de Usuario <span className="text-red-500">*</span></FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
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

                <Field>
                  <FieldLabel htmlFor="nombre">Nombre/s <span className="text-red-500">*</span></FieldLabel>
                  <Input
                    id="nombre"
                    placeholder="Nombre/s"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="apellido">Apellido/s <span className="text-red-500">*</span></FieldLabel>
                  <Input
                    id="apellido"
                    placeholder="Apellido/s"
                    value={form.apellido}
                    onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="documento">N° Documento <span className="text-red-500">*</span></FieldLabel>
                  <Input
                    id="documento"
                    placeholder="Documento"
                    value={form.nroDocumento}
                    onChange={(e) => setForm({ ...form, nroDocumento: e.target.value })}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="correo">Correo Electrónico <span className="text-red-500">*</span></FieldLabel>
                  <Input
                    id="correo"
                    placeholder="Correo Electrónico"
                    value={form.correoElectronico}
                    onChange={(e) => setForm({ ...form, correoElectronico: e.target.value })}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-5">
                  <Field>
                    <FieldLabel>Teléfono Personal <span className="text-red-500">*</span></FieldLabel>
                    <Input
                      id="telefonoPersonal"
                      placeholder="Teléfono/Celular"
                      value={form.telefonoPersonal}
                      onChange={(e) =>
                        setForm({ ...form, telefonoPersonal: e.target.value })
                      }
                    />
                  </Field>

                  <Field>
                    <FieldLabel>Teléfono Laboral</FieldLabel>
                    <Input
                      id="telefonoLaboral"
                      placeholder="Teléfono/Celular"
                      value={form.telefonoLaboral}
                      onChange={(e) =>
                        setForm({ ...form, telefonoLaboral: e.target.value })
                      }
                    />
                  </Field>
                </div>

                {selectedValues.includes("Alumno") && (
                  <Field>
                    <FieldLabel>Carrera</FieldLabel>
                    <Input
                      id="carrera"
                      placeholder="Carrera"
                      value={form.carrera}
                      onChange={(e) => setForm({ ...form, carrera: e.target.value })}
                    />
                  </Field>
                )}

                {/* {error && (
                  <p className="text-red-500 text-sm text-center mt-2">{error}</p>
                )} */}

                <div className="flex justify-center pt-4">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md"
                  >
                    Guardar
                  </Button>
                  <Button
                    type="button"
                    onClick={cleanForm}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-2 rounded-md ml-4"
                  >
                    Cancelar
                  </Button>
                </div>
              </FieldGroup>
            </FieldSet>

          </form>
        </div>
      )}

      {completed && selectedValues.includes("Alumno") && (
        <CardUsuario
          title="Se ha dado de alta exitosamente"
          user={userData}
          onClose={cleanForm}
        />
      )}

      {completed &&
        (selectedValues.includes("Administrador") ||
          selectedValues.includes("Docente")) && <SueldoForm onClose={cleanForm} />}

      {error && (
        <PopUp
          title="Error al dar de alta al usuario"
          message={error}
          onClose={cleanForm}
        />
      )}
    </div>
  );
}
