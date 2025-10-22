// import axiosInstance from "./axiosInstance";

// export const altaUsuario = async (userData) => {
//   try {
//     const response = await axiosInstance.post("/users/", userData);
//     return response.data; 
//   } catch (error) {
//     console.error("Error al crear usuario:", error);
//     throw error; 
//   }
// };

// export const bajaUsuario = async (id) => {
//   try {
//     const response = await axiosInstance.delete(`/users/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error al eliminar usuario:", error);
//     throw error;
//   }
// };

// export const modificarUsuario = async (id, userData) => {
//   try {
//     const response = await axiosInstance.put(`/users/${id}`, userData);
//     return response.data; 
//   } catch (err) {
//     console.error("Error al modificar el usuario:", err);
//     throw err; 
// }
// };

// export const usuarioPorId=async(id)=>{
//     try{
//         const response= await axiosInstance.get(`/users/${id}`)       
//         return response.data
//     }catch(err){
//         console.error("Error al buscar usuario:", err)
//         throw err;
//     }
// }

// mockUsuariosService.js
import { usuarios } from "@/data/mockData"; // importá tus datos locales

// Copia local mutable (para simular alta, baja, etc.)
let mockUsuarios = [...usuarios];

export const altaUsuario = async (userData) => {
  try {
    const nuevoUsuario = {
      id: mockUsuarios.length + 1, // simulamos autoincremental
      ...userData,
    };
    mockUsuarios.push(nuevoUsuario);
    return Promise.resolve(nuevoUsuario); // simula respuesta de API
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
};

export const bajaUsuario = async (id) => {
  try {
    mockUsuarios = mockUsuarios.filter((u) => u.id !== id);
    return Promise.resolve({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
};

export const modificarUsuario = async (id, userData) => {
  try {
    const index = mockUsuarios.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("Usuario no encontrado");

    mockUsuarios[index] = { ...mockUsuarios[index], ...userData };
    return Promise.resolve(mockUsuarios[index]);
  } catch (error) {
    console.error("Error al modificar el usuario:", error);
    throw error;
  }
};

export const usuarioPorId = async (id) => {
  try {
    const usuario = mockUsuarios.find((u) => u.id === id);
    if (!usuario) throw new Error("Usuario no encontrado");
    return Promise.resolve(usuario);
  } catch (error) {
    console.error("Error al buscar usuario:", error);
    throw error;
  }
};

export const obtenerUsuarios = async () => {
  try {
    return Promise.resolve(mockUsuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};
