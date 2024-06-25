
CREATE DATABASE todo_unas_master;

CREATE TABLE roles (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR,
    status INTEGER
);

CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR,
    apellido_paterno VARCHAR,
    apellido_materno VARCHAR,
    contrasena VARCHAR,
    correo VARCHAR,
    id_rol INTEGER,
    status INTEGER,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

CREATE TABLE privilegios (
    id_privilegio SERIAL PRIMARY KEY,
    nombre VARCHAR
);

CREATE TABLE roles_privilegios (
    id_roles_privilegios SERIAL PRIMARY KEY,
    id_rol INTEGER,
    id_privilegio INTEGER,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol),
    FOREIGN KEY (id_privilegio) REFERENCES privilegios(id_privilegio)
);

CREATE TABLE sucursales (
    id_sucursal SERIAL PRIMARY KEY,
    nombre VARCHAR,
    estado VARCHAR,
    fecha_actualizacion TIMESTAMP WITHOUT TIME ZONE,
    direccion VARCHAR,
    url VARCHAR,
    usuario_creador INTEGER,
    fecha_creado TIMESTAMP WITH TIME ZONE,
    usuario_modificador INTEGER,
    fecha_modificado TIMESTAMP WITH TIME ZONE,
    usuario_eliminador INTEGER,
    fecha_eliminado TIMESTAMP WITH TIME ZONE,
    url_imagen VARCHAR,
    status INTEGER,
    FOREIGN KEY (usuario_creador) REFERENCES usuario(id_usuario),
    FOREIGN KEY (usuario_modificador) REFERENCES usuario(id_usuario),
    FOREIGN KEY (usuario_eliminador) REFERENCES usuario(id_usuario)
);

CREATE TABLE sucursales_hist (
    id_historico SERIAL PRIMARY KEY,
    id_sucursal INTEGER,
    nombre VARCHAR,
    estado VARCHAR,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE,
    direccion VARCHAR,
    url VARCHAR,
    usuario_involucrado INTEGER,
    tipo_accion VARCHAR,
    fecha TIMESTAMP WITH TIME ZONE,
    url_imagen VARCHAR,
    status INTEGER,
    FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal),
    FOREIGN KEY (usuario_involucrado) REFERENCES usuario(id_usuario)
);

CREATE TABLE catalogo_general (
    id_producto SERIAL PRIMARY KEY,
    clave VARCHAR,
    nombre VARCHAR,
    descripcion TEXT,
    cantidad_total INTEGER,
    precio NUMERIC,
    usuario_creador INTEGER,
    fecha_creado TIMESTAMP WITHOUT TIME ZONE,
    usuario_modificador INTEGER,
    fecha_modificado TIMESTAMP WITHOUT TIME ZONE,
    usuario_eliminador INTEGER,
    fecha_eliminado TIMESTAMP WITHOUT TIME ZONE,
    FOREIGN KEY (usuario_creador) REFERENCES usuario(id_usuario),
    FOREIGN KEY (usuario_modificador) REFERENCES usuario(id_usuario),
    FOREIGN KEY (usuario_eliminador) REFERENCES usuario(id_usuario)
);

CREATE TABLE catalogo_general_hist (
    id_historico SERIAL PRIMARY KEY,
    id_producto INTEGER,
    nombre VARCHAR,
    descripcion TEXT,
    cantidad_total INTEGER,
    precio NUMERIC,
    usuario_involucrado INTEGER,
    tipo_accion VARCHAR,
    fecha TIMESTAMP WITHOUT TIME ZONE,
    FOREIGN KEY (id_producto) REFERENCES catalogo_general(id_producto),
    FOREIGN KEY (usuario_involucrado) REFERENCES usuario(id_usuario)
);

CREATE TABLE sincronizacion_pendiente (
    id_sync SERIAL PRIMARY KEY,
    id_producto INTEGER,
    id_sucursal INTEGER,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR,
    mensaje_error TEXT,
    status INTEGER,
    FOREIGN KEY (id_producto) REFERENCES catalogo_general(id_producto),
    FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal)
);

CREATE TABLE inventario (
    id_sucursal INTEGER,
    id_producto INTEGER,
    cantidad INTEGER,
    PRIMARY KEY (id_sucursal, id_producto),
    FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal),
    FOREIGN KEY (id_producto) REFERENCES catalogo_general(id_producto)
);

CREATE TABLE clinicas (
    id_clinica SERIAL PRIMARY KEY,
    nombre VARCHAR,
    direccion VARCHAR,
    status INTEGER
);

CREATE TABLE catalogo_salidas (
    id_tipo_salida SERIAL PRIMARY KEY,
    tipo VARCHAR,
    status INTEGER
);

CREATE TABLE movimientos (
    id_movimiento SERIAL PRIMARY KEY,
    id_usuario INTEGER,
    tipo_movimiento VARCHAR,
    sucursal_salida INTEGER,
    sucursal_destino INTEGER,
    id_tipo_salida INTEGER,
    id_clinica INTEGER,
    fecha TIMESTAMP WITHOUT TIME ZONE,
    precio_total NUMERIC,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (sucursal_salida) REFERENCES sucursales(id_sucursal),
    FOREIGN KEY (sucursal_destino) REFERENCES sucursales(id_sucursal),
    FOREIGN KEY (id_tipo_salida) REFERENCES catalogo_salidas(id_tipo_salida),
    FOREIGN KEY (id_clinica) REFERENCES clinicas(id_clinica)
);

CREATE TABLE detalle_movimiento (
    id_detalle_mov SERIAL PRIMARY KEY,
    id_movimiento INTEGER,
    id_producto INTEGER,
    cantidad INTEGER,
    precio NUMERIC,
    FOREIGN KEY (id_movimiento) REFERENCES movimientos(id_movimiento),
    FOREIGN KEY (id_producto) REFERENCES catalogo_general(id_producto)
);

CREATE VIEW vista_usuarios_privilegios AS
SELECT dm.id_detalle_mov,
       m.id_movimiento,
       dm.id_producto,
       cg.nombre AS nombre_producto,
       dm.cantidad,
       dm.precio
FROM detalle_movimiento dm
JOIN movimientos m ON dm.id_movimiento = m.id_movimiento
LEFT JOIN catalogo_general cg ON dm.id_producto = cg.id_producto;

CREATE VIEW vista_usuario_detalle AS
SELECT u.id_usuario,
       CONCAT(u.nombre, ' ', u.apellido_paterno, ' ', u.apellido_materno) AS nombre,
       u.correo,
       r.nombre AS rol,
       u.contrasena,
       u.status
FROM usuario u
JOIN roles r ON u.id_rol = r.id_rol;

CREATE VIEW vista_sincronizacion_pendiente_reciente AS
SELECT sp.id_producto,
       sp.id_sucursal,
       s.nombre AS nombre_sucursal,
       sp.fecha_registro,
       sp.estado,
       COALESCE(i.cantidad, 0) AS cantidad_existencia,
       s.url AS url_sucursal,
       COALESCE(sp.status, 0) AS status
FROM (
    SELECT sp.id_producto,
           sp.id_sucursal,
           sp.fecha_registro,
           sp.estado,
           ROW_NUMBER() OVER (PARTITION BY sp.id_producto, sp.id_sucursal ORDER BY sp.fecha_registro DESC) AS rn,
           sp.status
    FROM sincronizacion_pendiente sp
) sp
JOIN sucursales s ON sp.id_sucursal = s.id_sucursal
LEFT JOIN inventario i ON sp.id_producto = i.id_producto AND sp.id_sucursal = i.id_sucursal
WHERE sp.rn = 1;

CREATE VIEW vista_catalogo_sincronizacion AS
SELECT cg.id_producto,
       cg.clave,
       cg.nombre,
       cg.cantidad_total,
       cg.precio,
       CASE
           WHEN EXISTS (
               SELECT 1
               FROM vista_sincronizacion_pendiente_reciente sp
               WHERE sp.id_producto = cg.id_producto AND sp.estado = 'PENDIENTE' AND sp.status = 1
           ) THEN 'PENDIENTE'
           ELSE 'SINCRONIZADO'
       END AS sincronizacion
FROM catalogo_general cg
ORDER BY cg.id_producto;

CREATE VIEW vista_roles_privilegios AS
SELECT r.id_rol,
       r.nombre AS nombre_rol,
       p.id_privilegio,
       p.nombre AS nombre_privilegio
FROM roles r
JOIN roles_privilegios rp ON r.id_rol = rp.id_rol
JOIN privilegios p ON rp.id_privilegio = p.id_privilegio;

CREATE VIEW vista_movimientos AS
SELECT m.id_movimiento,
       CONCAT(u.nombre, ' ', u.apellido_paterno, ' ', u.apellido_materno) AS nombre_usuario,
       m.tipo_movimiento,
       COALESCE(s_salida.nombre, 'N/A') AS sucursal_salida,
       COALESCE(s_destino.nombre, 'N/A') AS sucursal_destino,
       COALESCE(cs.tipo, 'N/A') AS tipo_salida,
       COALESCE(c.nombre, 'N/A') AS nombre_clinica,
       m.fecha,
       m.precio_total
FROM movimientos m
LEFT JOIN usuario u ON m.id_usuario = u.id_usuario
LEFT JOIN sucursales s_salida ON m.sucursal_salida = s_salida.id_sucursal
LEFT JOIN sucursales s_destino ON m.sucursal_destino = s_destino.id_sucursal
LEFT JOIN catalogo_salidas cs ON m.id_tipo_salida = cs.id_tipo_salida
LEFT JOIN clinicas c ON m.id_clinica = c.id_clinica;