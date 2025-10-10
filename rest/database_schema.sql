-- ===================================================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS - BACKOFFICE
-- ===================================================================
-- Base de datos: backoffice_db
-- Descripción: Sistema de gestión académica y administrativa
-- ===================================================================

-- Crear la base de datos (ejecutar solo si no existe)
-- CREATE DATABASE backoffice_db;
-- USE backoffice_db;

-- ===================================================================
-- TABLA: ROLES
-- ===================================================================
-- Define los diferentes perfiles de usuario dentro del sistema
CREATE TABLE roles (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    status BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===================================================================
-- TABLA: SEDES
-- ===================================================================
-- Representa cada sede o edificio principal de la institución
CREATE TABLE sedes (
    id_sede SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    ubicacion TEXT,
    status BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===================================================================
-- TABLA: USUARIOS
-- ===================================================================
-- Representa a todas las personas registradas en el sistema
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    legajo VARCHAR(20) UNIQUE NOT NULL,
    dni VARCHAR(10) UNIQUE NOT NULL,
    correo_institucional VARCHAR(150),
    correo_personal VARCHAR(150) NOT NULL,
    telefono_laboral VARCHAR(20),
    telefono_personal VARCHAR(20) NOT NULL,
    fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status BOOLEAN DEFAULT TRUE,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===================================================================
-- TABLA: USUARIO_ROLES (Relación N:M)
-- ===================================================================
-- Tabla de relación muchos a muchos entre usuarios y roles
CREATE TABLE usuario_roles (
    id_usuario INTEGER NOT NULL,
    id_rol INTEGER NOT NULL,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (id_usuario, id_rol),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE CASCADE
);

-- ===================================================================
-- TABLA: PARÁMETROS
-- ===================================================================
-- Tabla de configuración general del sistema
CREATE TABLE parametros (
    id_parametro SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- multa, reserva, sancion, general, etc.
    valor_numerico DECIMAL(10,2),
    valor_texto TEXT,
    descripcion TEXT,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status BOOLEAN DEFAULT TRUE
);

-- ===================================================================
-- TABLA: ESPACIOS
-- ===================================================================
-- Representa las aulas, laboratorios, oficinas o espacios comunes
CREATE TABLE espacios (
    id_espacio SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- aula, laboratorio, espacio_comun, oficina, otros
    capacidad INTEGER NOT NULL DEFAULT 0,
    ubicacion TEXT,
    estado VARCHAR(50) DEFAULT 'disponible', -- disponible, ocupado, en_mantenimiento
    id_sede INTEGER NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_sede) REFERENCES sedes(id_sede) ON DELETE CASCADE,
    UNIQUE(nombre, id_sede) -- Nombre único por sede
);

-- ===================================================================
-- TABLA: SUELDOS
-- ===================================================================
-- Registra los pagos mensuales asociados a cada usuario y rol
CREATE TABLE sueldos (
    id_sueldo SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    id_rol INTEGER,
    cbu VARCHAR(22) NOT NULL,
    sueldo_fijo DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    sueldo_adicional DECIMAL(12,2) DEFAULT 0.00,
    sueldo_total DECIMAL(12,2) GENERATED ALWAYS AS (sueldo_fijo + sueldo_adicional) STORED,
    observaciones TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE SET NULL
);

-- ===================================================================
-- TABLA: CRONOGRAMAS
-- ===================================================================
-- Representa la planificación general de un curso académico
CREATE TABLE cronogramas (
    id_cronograma SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL, -- ID del curso proveniente del módulo CORE
    course_name VARCHAR(200) NOT NULL, -- Nombre del curso (cacheado localmente)
    total_classes INTEGER DEFAULT 0,
    fecha_inicio DATE,
    fecha_fin DATE,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status BOOLEAN DEFAULT TRUE
);

-- ===================================================================
-- TABLA: CLASES_INDIVIDUALES
-- ===================================================================
-- Descompone el cronograma en sesiones o clases específicas
CREATE TABLE clases_individuales (
    id_clase SERIAL PRIMARY KEY,
    id_cronograma INTEGER NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    fecha_clase DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    estado VARCHAR(50) DEFAULT 'programada', -- programada, dictada, reprogramada, cancelada
    observaciones TEXT,
    status BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cronograma) REFERENCES cronogramas(id_cronograma) ON DELETE CASCADE
);

-- ===================================================================
-- TABLA: EVALUACIONES
-- ===================================================================
-- Registra las evaluaciones planificadas dentro de un cronograma
CREATE TABLE evaluaciones (
    id_evaluacion SERIAL PRIMARY KEY,
    id_cronograma INTEGER NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- parcial, final, trabajo_practico, otro
    ponderacion DECIMAL(5,2) DEFAULT 0.00, -- Porcentaje en la nota final (0-100)
    observaciones TEXT,
    status BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cronograma) REFERENCES cronogramas(id_cronograma) ON DELETE CASCADE
);

-- ===================================================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- ===================================================================

-- Índices para mejorar performance en consultas frecuentes
CREATE INDEX idx_usuarios_legajo ON usuarios(legajo);
CREATE INDEX idx_usuarios_dni ON usuarios(dni);
CREATE INDEX idx_usuarios_status ON usuarios(status);
CREATE INDEX idx_usuario_roles_usuario ON usuario_roles(id_usuario);
CREATE INDEX idx_usuario_roles_rol ON usuario_roles(id_rol);
CREATE INDEX idx_espacios_sede ON espacios(id_sede);
CREATE INDEX idx_espacios_tipo ON espacios(tipo);
CREATE INDEX idx_espacios_estado ON espacios(estado);
CREATE INDEX idx_sueldos_usuario ON sueldos(id_usuario);
CREATE INDEX idx_sueldos_activo ON sueldos(activo);
CREATE INDEX idx_cronogramas_course ON cronogramas(course_id);
CREATE INDEX idx_clases_cronograma ON clases_individuales(id_cronograma);
CREATE INDEX idx_clases_fecha ON clases_individuales(fecha_clase);
CREATE INDEX idx_evaluaciones_cronograma ON evaluaciones(id_cronograma);
CREATE INDEX idx_evaluaciones_fecha ON evaluaciones(fecha);

-- ===================================================================
-- DATOS INICIALES (SEEDS)
-- ===================================================================

-- Insertar roles básicos del sistema
INSERT INTO roles (nombre_rol, descripcion) VALUES
('administrador', 'Acceso total al sistema'),
('docente', 'Profesor de la institución'),
('alumno', 'Estudiante registrado'),
('administrativo', 'Personal de gestión y soporte'),
('invitado', 'Acceso limitado temporal');

-- Insertar sede principal
INSERT INTO sedes (nombre, ubicacion) VALUES
('Sede Central', 'Av. Principal 1234, Ciudad'),
('Sede Norte', 'Calle Norte 567, Zona Norte'),
('Campus Virtual', 'Plataforma Online');

-- Insertar parámetros básicos del sistema
INSERT INTO parametros (nombre, tipo, valor_numerico, descripcion) VALUES
('multa_dia_retraso', 'multa', 150.00, 'Multa por día de retraso en devolución'),
('max_reservas_usuario', 'reserva', 3, 'Máximo de reservas simultáneas por usuario'),
('dias_anticipacion_reserva', 'reserva', 7, 'Días de anticipación para reservar'),
('duracion_maxima_clase', 'general', 4, 'Duración máxima de clase en horas');

-- Insertar algunos espacios de ejemplo
INSERT INTO espacios (nombre, tipo, capacidad, ubicacion, id_sede) VALUES
('Aula 101', 'aula', 30, 'Planta Baja, Ala Este', 1),
('Aula 102', 'aula', 25, 'Planta Baja, Ala Este', 1),
('Laboratorio Informática 1', 'laboratorio', 20, 'Primer Piso, Ala Oeste', 1),
('Laboratorio Informática 2', 'laboratorio', 20, 'Primer Piso, Ala Oeste', 1),
('Biblioteca', 'espacio_comun', 50, 'Segundo Piso, Central', 1),
('Auditorio', 'aula', 100, 'Planta Baja, Central', 1);

-- ===================================================================
-- COMENTARIOS FINALES
-- ===================================================================
-- 
-- Este script crea la estructura completa del sistema BackOffice incluyendo:
-- 
-- 1. Tablas principales con sus relaciones
-- 2. Constraints e índices para integridad y performance
-- 3. Datos iniciales básicos para comenzar a usar el sistema
-- 
-- Para ejecutar:
-- 1. Crear la base de datos: CREATE DATABASE backoffice_db;
-- 2. Conectarse a la base: \c backoffice_db;
-- 3. Ejecutar este script completo
-- 
-- Relaciones implementadas:
-- - usuarios ↔ roles (N:M) a través de usuario_roles
-- - usuarios ↔ sueldos (1:N)
-- - sedes ↔ espacios (1:N)
-- - cronogramas ↔ clases_individuales (1:N)
-- - cronogramas ↔ evaluaciones (1:N)
-- 
-- ===================================================================