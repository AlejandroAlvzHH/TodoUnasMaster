export interface General_Catalogue_Hist {
  id_historico: number;
  id_producto: number;
  nombre: string;
  descripcion: string;
  cantidad_total: number;
  precio: number;
  usuario_involucrado: number;
  tipo_accion: string;
  fecha: Date;
}