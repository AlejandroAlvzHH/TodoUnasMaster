import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Privileges } from '../../../Models/Master/privileges';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PrivilegiosService {
  private baseUrl = environment.baseUrl;
  private url = `${this.baseUrl}/api/PrivilegiosApi`;

  constructor(private http: HttpClient) {}

  getPrivilegios(): Observable<Privileges[]> {
    return this.http.get<Privileges[]>(this.url);
  }

  async getAllPrivilegios(): Promise<Privileges[]> {
    try {
      const data = await fetch(this.url, { method: 'GET' });
      return (await data.json()) ?? [];
    } catch (e) {
      alert('Error: ' + e);
      return [];
    }
  }

  addRol(rol: Privileges): Observable<Privileges> {
    return this.http.post<Privileges>(this.url, rol);
  }

  async updateRol(
    rol: Privileges,
    id_privilegio: number
  ): Promise<Privileges | null> {
    try {
      const response = await fetch(`${this.url}/${id_privilegio}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rol),
      });
      if (response.status === 204) {
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating privilegio:', error);
      throw error;
    }
  }
}
