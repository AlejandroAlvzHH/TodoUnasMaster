export interface Movements {
  id_movimiento:number;
    id_usuario:number;
    tipo_movimiento:string;
    sucursal_salida:number;
    sucursal_destino:number;
    id_tipo_salida:number;
    id_clinica:number;
    fecha:Date;
    precio_total:number;
}
