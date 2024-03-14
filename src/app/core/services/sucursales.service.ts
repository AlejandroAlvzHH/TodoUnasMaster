import { Injectable } from '@angular/core';
import { Sucursales } from '../../Models/sucursales';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  url = 'https://localhost:44301/api/SucursalApi';

  async getAllSucursales(): Promise<Sucursales[]> {
    try {
      const response = await fetch(this.url, { method: 'GET' });
      return (await response.json()) ?? [];
    } catch (error) {
      console.error('Error al obtener todas las sucursales:', error);
      return [];
    }
  }

  async getSucursalById(id: number): Promise<Sucursales | null> {
    try {
      const response = await fetch(`${this.url}/${id}`, { method: 'GET' });
      if (response.ok) {
        return await response.json();
      } else {
        console.error('Error al obtener la sucursal por ID:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener la sucursal por ID:', error);
      return null;
    }
  }
}
