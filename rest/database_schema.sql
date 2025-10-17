CREATE DATABASE backoffice_db;
\c backoffice_db;

CREATE TABLE roles (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    status BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sedes (
    id_sede SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    ubicacion TEXT,
    status BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuarios (
    id_usuario UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    legajo VARCHAR(20) UNIQUE NOT NULL,
    dni VARCHAR(10) UNIQUE NOT NULL,
    correo_institucional VARCHAR(150) UNIQUE,
    correo_personal VARCHAR(150) UNIQUE NOT NULL,
    telefono_personal VARCHAR(20) NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    fecha_alta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status BOOLEAN DEFAULT TRUE
);

CREATE TABLE usuario_roles (
    id_usuario UUID NOT NULL,
    id_rol INTEGER NOT NULL,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (id_usuario, id_rol),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE CASCADE
);


CREATE TABLE parametros (
    id_parametro SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    valor_numerico DECIMAL(10,2),
    valor_texto TEXT,
    descripcion TEXT,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status BOOLEAN DEFAULT TRUE
);


CREATE TABLE espacios (
    id_espacio SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    capacidad INTEGER NOT NULL DEFAULT 0,
    ubicacion TEXT,
    estado VARCHAR(50) DEFAULT 'disponible',
    id_sede INTEGER NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_sede) REFERENCES sedes(id_sede) ON DELETE CASCADE,
    UNIQUE(nombre, id_sede)
);


CREATE TABLE sueldos (
    id_sueldo SERIAL PRIMARY KEY,
    id_usuario UUID NOT NULL,
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


CREATE TABLE cronogramas (
    id_cronograma SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL,
    course_name VARCHAR(200) NOT NULL,
    total_classes INTEGER DEFAULT 0,
    fecha_inicio DATE,
    fecha_fin DATE,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status BOOLEAN DEFAULT TRUE
);


CREATE TABLE clases_individuales (
    id_clase SERIAL PRIMARY KEY,
    id_cronograma INTEGER NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    fecha_clase DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    estado VARCHAR(50) DEFAULT 'programada',
    observaciones TEXT,
    status BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cronograma) REFERENCES cronogramas(id_cronograma) ON DELETE CASCADE
);

CREATE TABLE evaluaciones (
    id_evaluacion SERIAL PRIMARY KEY,
    id_cronograma INTEGER NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    ponderacion DECIMAL(5,2) DEFAULT 0.00,
    observaciones TEXT,
    status BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cronograma) REFERENCES cronogramas(id_cronograma) ON DELETE CASCADE
);

CREATE INDEX idx_usuarios_legajo ON usuarios(legajo);
CREATE INDEX idx_usuarios_dni ON usuarios(dni);
CREATE INDEX idx_usuarios_status ON usuarios(status);
CREATE INDEX idx_usuarios_correo_institucional ON usuarios(correo_institucional);
CREATE INDEX idx_usuarios_correo_personal ON usuarios(correo_personal);
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


INSERT INTO roles (nombre_rol, descripcion) VALUES
('administrador', 'Acceso total al sistema'),
('docente', 'Profesor de la institución'),
('alumno', 'Estudiante registrado'),
('administrativo', 'Personal de gestión y soporte'),
('invitado', 'Acceso limitado temporal');


INSERT INTO sedes (nombre, ubicacion) VALUES
('Sede Central', 'Av. Principal 1234, Ciudad'),
('Sede Norte', 'Calle Norte 567, Zona Norte'),
('Campus Virtual', 'Plataforma Online');


INSERT INTO parametros (nombre, tipo, valor_numerico, descripcion) VALUES
('multa_dia_retraso', 'multa', 150.00, 'Multa por día de retraso en devolución'),
('max_reservas_usuario', 'reserva', 3, 'Máximo de reservas simultáneas por usuario'),
('dias_anticipacion_reserva', 'reserva', 7, 'Días de anticipación para reservar'),
('duracion_maxima_clase', 'general', 4, 'Duración máxima de clase en horas');


INSERT INTO espacios (nombre, tipo, capacidad, ubicacion, id_sede) VALUES
('Aula 101', 'aula', 30, 'Planta Baja, Ala Este', 1),
('Aula 102', 'aula', 25, 'Planta Baja, Ala Este', 1),
('Laboratorio Informática 1', 'laboratorio', 20, 'Primer Piso, Ala Oeste', 1),
('Laboratorio Informática 2', 'laboratorio', 20, 'Primer Piso, Ala Oeste', 1),
('Biblioteca', 'espacio_comun', 50, 'Segundo Piso, Central', 1),
('Auditorio', 'aula', 100, 'Planta Baja, Central', 1);

