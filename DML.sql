INSERT INTO roles (nombre, status) VALUES
    ('Administrador', 1),
    ('Empleado Estándar', 1);

INSERT INTO usuario (nombre, apellido_paterno, apellido_materno, contrasena, correo, id_rol, status) VALUES
    ('Juan', 'Hernández', 'Hernández', '123456', 'juan@gmail.com', 1, 1),
    ('María', 'Hernández', 'Hernández', '123456', 'maria@gmail.com', 2, 1);

INSERT INTO privilegios (nombre) VALUES
    ('Eliminar Sucursal'),
    ('Editar Sucursal'),
    ('Agregar Sucursal'),
    ('Ver Entradas y Salidas'),
    ('Ver Inventario'),
    ('Ver Traspaso a Sucursal'),
    ('Ver Traspaso a Clinica'),
    ('Agregar Producto Catalogo'),
    ('Reintentar Sincronizacion'),
    ('Editar Producto Catalogo General'),
    ('Ver Ajustes'),
    ('Ver Catalogo de Salidas'),
    ('Ver Catalogo de Clinicas'),
    ('Eliminar Producto Catalogo General'),
    ('Ver Roles'),
    ('Ver Usuarios');

INSERT INTO roles_privilegios (id_rol, id_privilegio) VALUES
    (1,1),
    (1,2),
    (1,3),
    (1,4),
    (1,5),
    (1,6),
    (1,7),
    (1,8),
    (1,9),
    (1,10),
    (1,11),
    (1,12),
    (1,13),
    (1,14),
    (1,15),
    (1,16),
    (2,1),
    (2,2),
    (2,5),
    (2,6);

INSERT INTO sucursales (nombre, estado, fecha_actualizacion, direccion, url, usuario_creador, fecha_creado, usuario_modificador, fecha_modificado, usuario_eliminador, fecha_eliminado, url_imagen, status) VALUES
    ('Sucursal A', 'Online 🟢', '2024-06-25 10:00:00', 'Calle A, Ciudad A', 'https://khk6cf13-10394.usw3.devtunnels.ms', 1, '2024-06-25 10:00:00', 1, '2024-06-25 10:00:00', NULL, NULL, 'https://image.placeholder.co/insecure/w:640/quality:65/czM6Ly9jZG4uc3BhY2VyLnByb3BlcnRpZXMvYjZhYTU2YjUtN2RkMS00N2MwLTg4ZjYtNjUyOTlkODk0YmE2', 1),
    ('Sucursal B', 'Online 🟢', '2024-06-25 10:00:00', 'Calle B, Ciudad B', 'https://khk6cf13-10396.usw3.devtunnels.ms', 1, '2024-06-25 10:00:00', 1, '2024-06-25 10:00:00', NULL, NULL, 'https://image.placeholder.co/insecure/w:640/quality:65/czM6Ly9jZG4uc3BhY2VyLnByb3BlcnRpZXMvYjZhYTU2YjUtN2RkMS00N2MwLTg4ZjYtNjUyOTlkODk0YmE2', 1);

INSERT INTO sucursales_hist (id_sucursal, nombre, estado, fecha_actualizacion, direccion, url, usuario_involucrado, tipo_accion, fecha, url_imagen, status) VALUES
    ('Sucursal A', 'Online 🟢', '2024-06-25 10:00:00', 'Calle A, Ciudad A', 'https://khk6cf13-10394.usw3.devtunnels.ms', 1, 'Creación', '2024-06-25 10:00:00', 'https://image.placeholder.co/insecure/w:640/quality:65/czM6Ly9jZG4uc3BhY2VyLnByb3BlcnRpZXMvYjZhYTU2YjUtN2RkMS00N2MwLTg4ZjYtNjUyOTlkODk0YmE2', 1),
    ('Sucursal B', 'Online 🟢', '2024-06-25 10:00:00', 'Calle B, Ciudad B', 'https://khk6cf13-10396.usw3.devtunnels.ms', 1, 'Creación', '2024-06-25 10:00:00', 'https://image.placeholder.co/insecure/w:640/quality:65/czM6Ly9jZG4uc3BhY2VyLnByb3BlcnRpZXMvYjZhYTU2YjUtN2RkMS00N2MwLTg4ZjYtNjUyOTlkODk0YmE2', 1);

INSERT INTO clinicas (nombre, direccion, status) VALUES
    ('Clínica A', 'Calle A, Ciudad A', 1),
    ('Clínica B', 'Calle B, Ciudad B', 1);

INSERT INTO catalogo_salidas (tipo, status) VALUES
    ('Default', 1),
    ('Venta', 1),
    ('Merma', 1);