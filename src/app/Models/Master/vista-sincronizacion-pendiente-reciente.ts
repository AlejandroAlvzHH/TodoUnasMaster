export interface VistaSincronizacionPendienteReciente {
  id_producto: number;
  id_sucursal: number;
  nombre_sucursal: string;
  fecha_registro: Date;
  estado: string;
  cantidad_existencia: number
  url_sucursal: string
}
