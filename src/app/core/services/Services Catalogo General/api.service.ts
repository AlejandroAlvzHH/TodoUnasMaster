import { Injectable } from '@angular/core';
import { Products } from '../../../Models/Factuprint/products';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor() {}

  async getAllProducts(baseUrl: string): Promise<Products[]> {
    try {
      const url = `${baseUrl}/api/ProductApi/instock`;
      console.log(url)
      const data = await fetch(url, { method: 'GET' });
      return (await data.json()) ?? [];
    } catch (e) {
      alert('Error: ' + e);
      return [];
    }
  }
}