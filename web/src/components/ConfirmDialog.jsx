import { Button } from "@/components/ui/button";

export default function ConfirmDialog({
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  loading = false,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <p className="mt-3 text-sm text-gray-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Procesando..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

