import {Calendar} from '@/components/ui/calendar.jsx';
import { useState } from 'react';
import Link from '../components/Link';

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
                        <Link to="/usuarios" title="Gestión de Usuarios" className='font-bold m-2' />
                        <ul className='list-disc list-inside'>
                            <li className='mb-2'>Alta de Usuario</li>
                            <li className='mb-2'>Baja de Usuario</li>
                            <li className='mb-2'>Modificación de Usuario</li>
                            <li className='mb-2'>Búsqueda de Usuario</li>

                        </ul>
                        <Link to="/precios" title="Listado de Precios" className='font-bold m-2'/>
                        <Link to="/cursos" title="Gestión de Cursos" className='font-bold m-2'/>
                        <Link href="/sedes" title="Sedes" className='font-bold m-2'/>
                    </div>
                </div>
                
            </div>
        </div>
    )
}