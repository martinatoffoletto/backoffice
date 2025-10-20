import axiosInstance from "./axiosInstance"

export const getEventos=async()=>{
    try{
        const response= await axiosInstance.get("/events")
        console.log("Evemtos obtenidos:", response)
        return response.data
    }catch(err){
       console.error("Error al obtener eventos:", err);
        throw err; 
    }
}