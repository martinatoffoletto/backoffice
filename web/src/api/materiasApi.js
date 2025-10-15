import axiosInstance from "./axiosInstance";

export const altaMateria = async (materiaData) => {
  try {
    const response = await axiosInstance.post("/materias/", materiaData);
    return response.data; 
  } catch (error) {
    console.error("Error al crear materia:", error);
    throw error; 
  }
};

export const bajaMateria = async (id) => {
  try {
    const response = await axiosInstance.delete(`/materias/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar materia:", error);
    throw error;
  }
};

export const modificarMateria = async (id, materiaData) => {
  try {
    const response = await axiosInstance.put(`/materias/${id}`, materiaData);
    return response.data; 
  } catch (err) {
    console.error("Error al modificar el materia:", err);
    throw err; 
}
};

export const materiaPorId=async(id)=>{
    try{
        const response= await axiosInstance.get(`/materias/${id}`)       
        return response.data
    }catch(err){
        console.error("Error al buscar materia:", err)
        throw err;
    }
}