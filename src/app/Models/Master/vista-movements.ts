export interface VistaMovements {
  id_movimiento: number;
  nombre_usuario: string;
  tipo_movimiento: string;
  sucursal_salida: string;
  sucursal_destino: string;
  tipo_salida: string;
  nombre_clinica: string;
  fecha: Date;
  precio_total: number;
}
