import axiosInstance from "./axiosInstance";

export const altaUsuario = async (userData) => {
  try {
    const response = await axiosInstance.post("/users/", userData);
    return response.data; 
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error; 
  }
};

export const bajaUsuario = async (id) => {
  try {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
};

export const modificarUsuario = async (id, userData) => {
  try {
    const response = await axiosInstance.put(`/users/${id}`, userData);
    return response.data; 
  } catch (err) {
    console.error("Error al modificar el usuario:", err);
    throw err; 
}
};

export const usuarioPorId=async(id)=>{
    try{
        const response= await axiosInstance.get(`/users/${id}`)       
        return response.data
    }catch(err){
        console.error("Error al buscar usuario:", err)
        throw err;
    }
}