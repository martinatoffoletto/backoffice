import TablaAsignaciones from "@/components/TablaAsignaciones";
import TablaAsignaciones2 from "@/components/TablaAsignaciones2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function Asignacion() {

    const [value, setValue]=useState("")

    const handleSelectAsignacion = (value) => {
        setValue(value);
        console.log(`Se seleccionó: ${value}`); // Para verificar en consola
    };

    return(
        <div className="min-h-screen w-full bg-white shadow-lg rounded-2xl flex flex-col items-center p-4 mt-4">
            <div className="w-full ">
                {/* Título: Mayor tamaño, más peso visual y color corporativo */}
                <h1 className="font-bold text-center text-xl mb-4">Asignación de Profesores</h1>
                <span className="block w-full h-[3px] bg-sky-950"></span>
            </div>

            {/* Contenedor de las tarjetas: Grid para un mejor control de layout y espacio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full pt-4 mb-4">
                
                {/* Tarjeta 1: Estilos de hover, centrado claro, borde interactivo */}
                <Card 
                    className="flex flex-col items-center justify-center p-6 text-center transition duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg border border-gray-200 hover:border-blue-500 cursor-pointer"
                    onClick={()=>handleSelectAsignacion("materias")}>
                    
                    <CardContent className="p-0 mb-4 flex flex-col items-center justify-center">
                        {/* 🌟 Icono Heroicon: Usa el componente importado. Se ve más grande y con color */}
                        <BookOpenIcon className="h-16 w-16 text-blue-500" aria-hidden="true" />
                    </CardContent>
                    
                    <CardHeader className="p-0 flex justify-center text-center w-full">
                        <CardTitle className="text-xl text-gray-800 text-center w-full">Asignación a Materias</CardTitle>
                    </CardHeader>
                </Card>

                {/* Tarjeta 2: Mismos estilos para consistencia */}
                <Card 
                    className="flex flex-col items-center justify-center p-6 text-center transition duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg border border-gray-200 hover:border-green-500 cursor-pointer"
                     onClick={()=>handleSelectAsignacion("cursos")}>
                    
                    <CardContent className="p-0 mb-4 flex flex-col items-center justify-center">
                        {/* 🌟 Icono Heroicon: Usa el componente importado. Se ve más grande y con color diferente */}
                        <UsersIcon className="h-16 w-16 text-green-500" aria-hidden="true" />
                    </CardContent>
                    
                    <CardHeader className="p-0 flex justify-center text-center w-full">
                        <CardTitle className="text-xl text-gray-800 text-center w-full">Asignación a Cursos</CardTitle>
                    </CardHeader>
                </Card>

                
                
            </div>
            { value === "materias" && (
                    <div className="w-full mt-4">
                        
                        <h1 className="font-bold text-xl mb-4">Asignación a Materias</h1>
                        <span className="block w-full h-[3px] bg-sky-950"></span>

                        <TablaAsignaciones/>
                    </div>
                )}
                { value === "cursos" && (
                    <div className="w-full mt-4">
                       
                        <h1 className="font-bold text-xl mb-4">Asignación a Cursos</h1>
                        <span className="block w-full h-[3px] bg-sky-950"></span>

                        <TablaAsignaciones2/>
                    </div>
                )}
        </div>
    )
}