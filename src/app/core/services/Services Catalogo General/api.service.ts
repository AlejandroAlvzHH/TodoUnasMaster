import { Injectable } from '@angular/core';
import { Products } from '../../../Models/products';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  url = 'https://localhost:44300/api/ProductApi/instock';

  async getAllProducts(): Promise<Products[]> {
    try {
      const data = await fetch(this.url, { method: 'GET' });
      //alert('json: ' + data.json());
      return (await data.json()) ?? [];
    } catch (e) {
      alert('Error: ' + e);
    }
    return [];
  }
}
/*async getHousingLocationById(id: number): Promise<HousingLocation | undefined> {
    const data = await fetch(`${this.url}/${id}`, { method: 'GET' });
    return await data.json() ?? {};
  }

  submitApplication(firstName: string, lastName: string, email: string) {
    console.log(firstName, lastName, email);
  }*/
