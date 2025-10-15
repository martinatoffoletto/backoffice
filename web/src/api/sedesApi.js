import axiosInstance from "./axiosInstance";

export const altaSede = async (sedeData) => {
  try {
    const response = await axiosInstance.post("/sedes/", sedeData);
    return response.data; 
  } catch (error) {
    console.error("Error al crear sede:", error);
    throw error; 
  }
};

export const bajaSede = async (id) => {
  try {
    const response = await axiosInstance.delete(`/sedes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar sede:", error);
    throw error;
  }
};

export const modifcarSede = async (id, sedeData) => {
  try {
    const response = await axiosInstance.put(`/sedes/${id}`, sedeData);
    return response.data; 
  } catch (err) {
    console.error("Error al modificar el sede:", err);
    throw err; 
}
};

export const sedePorId=async(id)=>{
    try{
        const response= await axiosInstance.get(`/sedes/${id}`)       
        return response.data
    }catch(err){
        console.error("Error al buscar sede:", err)
        throw err;
    }
}