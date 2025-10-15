import axiosInstance from "./axiosInstance";

export const altaCurso = async (cursoData) => {
  try {
    const response = await axiosInstance.post("/cursos/", cursoData);
    return response.data; 
  } catch (error) {
    console.error("Error al crear curso:", error);
    throw error; 
  }
};

export const bajaCurso = async (id) => {
  try {
    const response = await axiosInstance.delete(`/cursos/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar curso:", error);
    throw error;
  }
};

export const modificarCurso = async (id, cursoData) => {
  try {
    const response = await axiosInstance.put(`/cursos/${id}`, cursoData);
    return response.data; 
  } catch (err) {
    console.error("Error al modificar el curso:", err);
    throw err; 
}
};

export const cursoPorId=async(id)=>{
    try{
        const response= await axiosInstance.get(`/cursos/${id}`)       
        return response.data
    }catch(err){
        console.error("Error al buscar curso:", err)
        throw err;
    }
}

