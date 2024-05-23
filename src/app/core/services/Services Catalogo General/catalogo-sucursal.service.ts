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
      const url = `${baseUrl}/api/ProductApi`;
      console.log(url);
      const data = await fetch(url, { method: 'GET' });
      return (await data.json()) ?? [];
    } catch (e) {
      return [];
    }
  }

  getAllProductsHTTP(baseUrl: string): Observable<Products[]> {
    const url = `${baseUrl}/api/ProductApi`;
    return this.http.get<Products[]>(url).pipe(
      catchError((error) => {
        console.error('Error fetching products:', error);
        return throwError(error);
      })
    );
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
    const url = `${baseUrl}/api/ProductApi/${productId}`;
    try {
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
      console.error(error);
      throw error; 
    }
  }


  async getProductById(baseUrl: string, productId: number): Promise<Products | null> {
    try {
      const url = `${baseUrl}/api/ProductApi/${productId}`;
      console.log(url)
      const data = await fetch(url, { method: 'GET' });
      if (data.ok) {
        return await data.json();
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }
}
