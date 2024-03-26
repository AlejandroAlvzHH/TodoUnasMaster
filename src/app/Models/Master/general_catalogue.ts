export interface General_Catalogue {
  id_producto: number;
  nombre: string;
  descripcion: string;
  cantidad_total: number;
  precio: number;
  usuario_creador: number;
  fecha_creado: Date;
  usuario_modificador: number;
  fecha_modificado: Date;
  usuario_eliminador: number;
  fecha_eliminado: Date;
}
