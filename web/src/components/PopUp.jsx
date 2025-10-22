export default function PopUp({title, message, onClose}) {
    return(

        <div className="fixed inset-0 bg-gray-50 bg-opacity-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <p className="mb-4">{message}</p>
            <div className="flex justify-end">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        </div>

    )
}