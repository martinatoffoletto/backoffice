import axiosInstance from "./axiosInstance";

export const altaPrecio = async (precioData) => {
  try {
    const response = await axiosInstance.post("/params/", precioData);
    return response.data; 
  } catch (error) {
    console.error("Error al crear precio:", error);
    throw error; 
  }
};

export const bajaPrecio = async (id) => {
  try {
    const response = await axiosInstance.delete(`/params/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar precio:", error);
    throw error;
  }
};

export const modificarPrecio = async (id, precioData) => {
  try {
    const response = await axiosInstance.put(`/params/${id}`, precioData);
    return response.data; 
  } catch (err) {
    console.error("Error al modificar el precio:", err);
    throw err; 
}
};

export const precioPorId=async(id)=>{
    try{
        const response= await axiosInstance.get(`/params/${id}`)       
        return response.data
    }catch(err){
        console.error("Error al buscar precio:", err)
        throw err;
    }
}