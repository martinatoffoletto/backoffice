export const usuarios = [
  {
    id:1,
    tipoUsuario: ["Alumno"],
    nombre: "Valentina",
    apellido: "Gómez",
    nroDocumento: "45123987",
    correoElectronico: "valentina.gomez@univdemo.edu",
    telefonoPersonal: "+54 9 11 6423-1984",
    telefonoLaboral: "",
    carrera: "Ingeniería en Sistemas",
  },
  {
    id:2,
    tipoUsuario: ["Alumno"],
    nombre: "Lucas",
    apellido: "Martínez",
    nroDocumento: "46987215",
    correoElectronico: "lucas.martinez@univdemo.edu",
    telefonoPersonal: "+54 9 11 5832-7720",
    telefonoLaboral: "",
    carrera: "Licenciatura en Administración",
  },
  {
    id:3,
    tipoUsuario: ["Alumno"],
    nombre: "Julieta",
    apellido: "Ramos",
    nroDocumento: "47892110",
    correoElectronico: "julieta.ramos@univdemo.edu",
    telefonoPersonal: "+54 9 351 682-0042",
    telefonoLaboral: "",
    carrera: "Arquitectura",
  },
  {
    id:4,
    tipoUsuario: ["Profesor"],
    nombre: "Martín",
    apellido: "Pereyra",
    nroDocumento: "32115489",
    correoElectronico: "martin.pereyra@univdemo.edu",
    telefonoPersonal: "+54 9 11 6291-3375",
    telefonoLaboral: "+54 11 4578-2300 int. 221",
    carrera: "",
  },
  {
    id:5,
    tipoUsuario: ["Profesor"],
    nombre: "Carolina",
    apellido: "Vega",
    nroDocumento: "29873122",
    correoElectronico: "carolina.vega@univdemo.edu",
    telefonoPersonal: "+54 9 381 556-8912",
    telefonoLaboral: "+54 381 431-2200 int. 104",
    carrera: "",
  },
  {
    id:6,
    tipoUsuario: ["Administrativo"],
    nombre: "Roberto",
    apellido: "López",
    nroDocumento: "27655109",
    correoElectronico: "roberto.lopez@univdemo.edu",
    telefonoPersonal: "+54 9 11 6003-9121",
    telefonoLaboral: "+54 11 4578-2300 int. 103",
    carrera: "",
  },
  {
    id:7,
    tipoUsuario: ["Administrativo"],
    nombre: "Sofía",
    apellido: "Fernández",
    nroDocumento: "30999821",
    correoElectronico: "sofia.fernandez@univdemo.edu",
    telefonoPersonal: "+54 9 223 512-8890",
    telefonoLaboral: "+54 223 489-3311 int. 115",
    carrera: "",
  },
  {
    id:8,
    tipoUsuario: ["Alumno"],
    nombre: "Agustín",
    apellido: "Navarro",
    nroDocumento: "49012211",
    correoElectronico: "agustin.navarro@univdemo.edu",
    telefonoPersonal: "+54 9 341 688-9098",
    telefonoLaboral: "",
    carrera: "Diseño Gráfico",
  },
];


// 📁 mockData.js

// 🧩 PARÁMETROS
export const parametros = [
  {
    id:1,
    nombre: "multa_dia_retraso",
    tipo: "multa",
    valor_numerico: 5000,
    valor_texto: "",
    fecha_modificacion: "2025-10-01T10:45:00",
    status: "activo",
  },
  {
    id:2,
    nombre: "limite_dias_reserva",
    tipo: "reserva",
    valor_numerico: 10000,
    valor_texto: "",
    fecha_modificacion: "2025-09-20T08:20:00",
    status: "activo",
  },
  {
    id:3,
    nombre: "mensaje_suspension",
    tipo: "sancion",
    valor_numerico: 20000,
    valor_texto: "Usuario suspendido por exceso de retrasos",
    fecha_modificacion: "2025-08-12T11:00:00",
    status: "activo",
  },
  {
    id:4,
    nombre: "modo_mantenimiento",
    tipo: "general",
    valor_numerico: 5000,
    valor_texto: "inactivo",
    fecha_modificacion: "2025-10-10T09:15:00",
    status: "inactivo",
  },
];

// 🏢 SEDES
export const sedes = [
  {
    id:1,
    nombre: "Sede Central",
    ubicacion: "Av. Rivadavia 1234, CABA",
    cantidadAulas:500,
    tieneComedor:false,
    tieneBiblioteca:true,
    status: "activo",
  },
  {
    id:2,
    nombre: "Sede Norte",
    ubicacion: "Panamericana km 42, Pilar",
    cantidadAulas:350,
    tieneComedor:true,
    tieneBiblioteca:false,
    status: "activo",
  },
  {
    id:3,
    nombre: "Sede Sur",
    ubicacion: "Calle Mitre 845, Lomas de Zamora",
    cantidadAulas:650,
    tieneComedor:true,
    tieneBiblioteca:true,
    status: "inactivo",
  },
];

// mockData.js
export const carreras = [
  {
    id_carrera: "c1",
    nombre: "Ingeniería en Sistemas",
    nivel: "grado",
    duracion_anios: 5,
    status: "activo",
  },
  {
    id_carrera: "c2",
    nombre: "Tecnicatura en Programación",
    nivel: "tecnicatura",
    duracion_anios: 3,
    status: "activo",
  },
  {
    id_carrera: "c3",
    nombre: "Licenciatura en Administración",
    nivel: "grado",
    duracion_anios: 4,
    status: "activo",
  },
];

export const materias = [
  { id_materia: "m1", nombre: "Programación I", status: "activo" },
  { id_materia: "m2", nombre: "Programación II", status: "activo" },
  { id_materia: "m3", nombre: "Base de Datos", status: "activo" },
  { id_materia: "m4", nombre: "Matemática I", status: "activo" },
  { id_materia: "m5", nombre: "Matemática II", status: "activo" },
  { id_materia: "m6", nombre: "Gestión Empresarial", status: "activo" },
  { id_materia: "m7", nombre: "Contabilidad Básica", status: "activo" },
];

// 🧾 Tabla intermedia: materias_carrera
export const materias_carrera = [
  // Ingeniería en Sistemas
  { id: "mc1", id_carrera: "c1", id_materia: "m1" },
  { id: "mc2", id_carrera: "c1", id_materia: "m2" },
  { id: "mc3", id_carrera: "c1", id_materia: "m3" },
  { id: "mc4", id_carrera: "c1", id_materia: "m4" },
  { id: "mc5", id_carrera: "c1", id_materia: "m5" },

  // Tecnicatura en Programación
  { id: "mc6", id_carrera: "c2", id_materia: "m1" },
  { id: "mc7", id_carrera: "c2", id_materia: "m3" },
  { id: "mc8", id_carrera: "c2", id_materia: "m4" },

  // Licenciatura en Administración
  { id: "mc9", id_carrera: "c3", id_materia: "m6" },
  { id: "mc10", id_carrera: "c3", id_materia: "m7" },
  { id: "mc11", id_carrera: "c3", id_materia: "m4" },
];


// 🧠 CORRELATIVAS
export const correlativas = [
  {
    id_correlativa: "corr-001",
    uuid_materia: "m4",
    uuid_materia_correlativa: "m1",
  },
  {
    id_correlativa: "corr-002",
    uuid_materia: "m3",
    uuid_materia_correlativa: "m2",
  },
];

// 🏫 CURSOS
export const cursos = [
  {
    id_curso: "cur-001",
    uuid_materia: "m1",
    comision: "A",
    modalidad: "presencial",
    sede: "Sede Central",
    aula: "Aula 101",
    horario: "Lunes y Miércoles 8:00-10:00",
    periodo: "1er cuatrimestre 2025",
    fecha_inicio: "2025-03-10",
    fecha_fin: "2025-07-10",
    capacidad_max: 35,
    capacidad_min: 10,
    fecha_creacion: "2025-01-05T09:00:00",
  },
  {
    id_curso: "cur-002",
    uuid_materia: "m2",
    comision: "B",
    modalidad: "virtual",
    sede: "Sede Norte",
    aula: "Aula Virtual 03",
    horario: "Martes y Jueves 18:00-20:00",
    periodo: "1er cuatrimestre 2025",
    fecha_inicio: "2025-03-12",
    fecha_fin: "2025-07-15",
    capacidad_max: 40,
    capacidad_min: 8,
    fecha_creacion: "2025-01-10T10:30:00",
  },
];

// 👨‍🏫 SUELDOS (asociados a usuarios docentes o administrativos)
export const sueldos = [
  {
    id_usuario: 4, // Martín Pereyra (docente)
    cbu: "2850590940098765432101",
    id_rol: "Profesor",
    sueldo_fijo: 480000,
    sueldo_adicional: 20000,
    sueldo_total: 500000,
    observaciones: "Bonificación por rendimiento",
    activo: true,
  },
  {
    id_usuario: 5, // Carolina Vega (docente)
    cbu: "2850590940012345678901",
    id_rol: "Profesor",
    sueldo_fijo: 470000,
    sueldo_adicional: 0,
    sueldo_total: 470000,
    observaciones: "",
    activo: true,
  },
  {
    id_usuario: 6, // Roberto López (administrativo)
    cbu: "2850590940023456789012",
    id_rol: "Administrativo",
    sueldo_fijo: 420000,
    sueldo_adicional: 15000,
    sueldo_total: 435000,
    observaciones: "Guardias extra",
    activo: true,
  },
  {
    id_usuario: 7, // Sofía Fernández (administrativo)
    cbu: "2850590940034567890123",
    id_rol: "Administrativo",
    sueldo_fijo: 400000,
    sueldo_adicional: 0,
    sueldo_total: 400000,
    observaciones: "",
    activo: true,
  },
];
