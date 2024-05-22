import { Injectable } from '@angular/core';
import { General_Catalogue } from '../../../Models/Master/general_catalogue';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CatalogoGeneralService {
  constructor(private http: HttpClient) {}

  url = `http://localhost:10395/api/CatalogoGeneralApi`;

  async getAllCatalogueProducts(): Promise<General_Catalogue[]> {
    try {
      const data = await fetch(this.url, { method: 'GET' });
      return (await data.json()) ?? [];
    } catch (e) {
      return [];
    }
  }

  async getCatalogueProductByID(id: number): Promise<General_Catalogue | null> {
    try {
      const response = await fetch(`${this.url}/${id}`, { method: 'GET' });
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      const data = await response.json();
      return data as General_Catalogue;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  getCatalogueProductObesrvableByID(id: number): Observable<General_Catalogue | null> {
    return this.http.get<General_Catalogue>(`${this.url}/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching product:', error);
        return of(null);
      })
    );
  }

  async addCatalogueProduct(
    product: General_Catalogue
  ): Promise<General_Catalogue> {
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      return await response.json();
    } catch (e) {
      throw e;
    }
  }

  async updateCatalogueProduct(
    product: General_Catalogue,
    id: number
  ): Promise<General_Catalogue | null> {
    try {
      const response = await fetch(`${this.url}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      if (response.status === 204) {
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  updateCatalogueProductop(
    product: General_Catalogue,
    id: number
  ): Promise<General_Catalogue | null> {
    return fetch(`${this.url}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    })
    .then(response => {
      if (response.status === 204) {
        return null;
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error updating product:', error);
      throw error;
    });
  }
  
}
