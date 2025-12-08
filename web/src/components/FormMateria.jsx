import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select.jsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";
import { obtenerCarreras } from "@/api/carrerasApi";

export default function FormMateria({ 
  form, 
  setForm, 
  onSubmit, 
  submitButtonText = "Guardar",
  onCancel,
  isLoading = false 
}) {
  const [carreras, setCarreras] = useState([]);
  const [loadingCarreras, setLoadingCarreras] = useState(false);
  const [carreraSearch, setCarreraSearch] = useState("");

  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        setLoadingCarreras(true);
        const response = await obtenerCarreras();
        setCarreras(response || []);
      } catch (error) {
        console.error("Error al cargar carreras:", error);
        setCarreras([]);
      } finally {
        setLoadingCarreras(false);
      }
    };
    fetchCarreras();
  }, []);

  const filteredCarreras = carreras.filter((carrera) =>
    carrera.name?.toLowerCase().includes(carreraSearch.toLowerCase().trim())
  );

  const handleCarreraChange = (value) => {
    setForm((prev) => ({ ...prev, uuid_carrera: value }));
  };

  const handleApprovalMethodChange = (value) => {
    setForm((prev) => ({ ...prev, approval_method: value }));
  };

  const handleElectiveChange = (value) => {
    setForm((prev) => ({ ...prev, is_elective: value === "si" }));
  };

  return (
    <FieldSet>
      <FieldGroup className="space-y-5">
        <Field>
          <FieldLabel htmlFor="nombre">
            Nombre de Materia<span className="text-red-500">*</span>
          </FieldLabel>
          <Input
            id="nombre"
            placeholder="Nombre de Materia"
            value={form.nombre || ""}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, nombre: e.target.value }))
            }
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="carrera">
            Carrera<span className="text-red-500">*</span>
          </FieldLabel>
          <Select
            value={form.uuid_carrera || ""}
            onValueChange={handleCarreraChange}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  loadingCarreras ? "Cargando carreras..." : "Seleccione carrera"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <div className="p-2">
                <Input
                  placeholder="Buscar carrera..."
                  value={carreraSearch}
                  onChange={(e) => setCarreraSearch(e.target.value)}
                  className="mb-2"
                />
              </div>
              <SelectGroup>
                <SelectLabel>Carreras</SelectLabel>
                {filteredCarreras.length > 0 ? (
                  filteredCarreras.map((carrera) => (
                    <SelectItem key={carrera.uuid} value={carrera.uuid}>
                      {carrera.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-1.5 text-sm text-gray-500">
                    {loadingCarreras
                      ? "Cargando..."
                      : "No se encontraron carreras"}
                  </div>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="description">
            Descripción<span className="text-red-500">*</span>
          </FieldLabel>
          <textarea
            id="description"
            placeholder="Descripción"
            value={form.description || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="1"
          />
        </Field>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field>
            <FieldLabel htmlFor="approval_method">
              Tipo de Aprobación<span className="text-red-500">*</span>
            </FieldLabel>
            <Select
              value={form.approval_method || ""}
              onValueChange={handleApprovalMethodChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione tipo de aprobación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="final">Final Obligatorio</SelectItem>
                <SelectItem value="promocion">Promoción</SelectItem>
                <SelectItem value="trabajo_practico">
                  Trabajo Practico Obligatorio
                </SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <div>
              <FieldLabel>¿Es optativa?</FieldLabel>
              <RadioGroup
                value={form.is_elective ? "si" : "no"}
                onValueChange={handleElectiveChange}
                className="flex gap-4 mt-2"
              >
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="si" id="elective-si" />
                  <span>Si</span>
                </label>
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="no" id="elective-no" />
                  <span>No</span>
                </label>
              </RadioGroup>
            </div>
          </Field>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-md"
          >
            {isLoading ? "Procesando..." : submitButtonText}
          </Button>
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-2 rounded-md"
            >
              Cancelar
            </Button>
          )}
        </div>
      </FieldGroup>
    </FieldSet>
  );
}
