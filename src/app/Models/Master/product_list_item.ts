import { Products } from "../Factuprint/products";

export interface ProductListItem extends Products {
  enCarrito: boolean;
  botonDesactivado: boolean;
}