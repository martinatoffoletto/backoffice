import {Calendar} from '@/components/ui/calendar.jsx';
import { useState } from 'react';

export default function Inicio(second) {
    const [date, setDate] = useState(new Date());
    return(
        <div className="container mt-5 flex-column align-items-center">
            <h1 className='font-bold text-center text-xl'>¡Hola, Usuario!</h1>
            <div className="mt-4 flex justify-evenly">
                <div className='flex flex-col'>
                    <h2 className="m-4 font-bold">Calendario Académico</h2>
                    <Calendar 
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-lg border"
                    />
                    <div className='container-list-disc bg-sky-900 p-4 rounded-lg flex flex-col text-white px-6 mb-4 mt-4'>
                        <p className='mt-4 justify-start'>Comienzo 2do Cuatrimestre:</p>
                        <p className='mt-4 justify-start'>Evento Sede:</p>
                        <p className='mt-4 justify-start'>Reunión:</p>
                        <p className='mt-4 justify-start'>Agregar evento</p>
                    </div>
                </div>
                <div className='flex flex-col ml-10'>
                    <h2 className="m-4 font-bold">Herramientas de Gestión</h2>
                    <div className='container-list-disc bg-sky-900 p-4 rounded-lg flex flex-col text-white px-6'>
                        <a href="/usuarios" className='font-bold m-2' >Gestión de Usuarios</a>
                        <ul className='list-disc list-inside'>
                            <li className='mb-2'>Alta de Usuario</li>
                            <li className='mb-2'>Baja de Usuario</li>
                            <li className='mb-2'>Modificación de Usuario</li>
                            <li className='mb-2'>Búsqueda de Usuario</li>

                        </ul>
                        <a href="/precios"  className='font-bold m-2'>Lisatdo de Precios</a>
                        <a href="/cursos"  className='font-bold m-2'>Gestión de Cursos</a>
                        <a href="/sedes"  className='font-bold m-2' >Sedes</a>
                    </div>
                </div>
                
            </div>
        </div>
    )
}