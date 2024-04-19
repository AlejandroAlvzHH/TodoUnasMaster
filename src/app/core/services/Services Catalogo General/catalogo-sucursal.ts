import { Injectable } from '@angular/core';
import { Products } from '../../../Models/Factuprint/products';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CatalogoSucursalService {
  constructor(private http: HttpClient) {}

  async getAllProducts(baseUrl: string): Promise<Products[]> {
    try {
      const url = `${baseUrl}/api/ProductApi/instock`;
      console.log(url);
      const data = await fetch(url, { method: 'GET' });
      return (await data.json()) ?? [];
    } catch (e) {
      alert('Error: ' + e);
      return [];
    }
  }

  agregarProductoSucursal(
    baseUrl: string,
    product: Products
  ): Observable<Products> {
    const url = `${baseUrl}/api/ProductApi`;
    return this.http.post<Products>(url, product).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  async updateProductoSucursal(
    baseUrl: string,
    productId: number,
    updatedProduct: Products
  ): Promise<void> {
    try {
      const url = `${baseUrl}/api/ProductApi/${productId}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });
      if (!response.ok) {
        throw new Error('Fallo al actualizar el producto.');
      }
    } catch (error) {
      alert('Error: ' + error);
      throw error;
    }
  }
}
