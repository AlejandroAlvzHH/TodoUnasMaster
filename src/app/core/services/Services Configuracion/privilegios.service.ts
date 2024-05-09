import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Privileges } from '../../../Models/Master/privileges';

@Injectable({
  providedIn: 'root',
})
export class PrivilegiosService {
  private privilegiosUrl = 'http://localhost:10395/api/PrivilegiosApi';

  constructor(private http: HttpClient) {}

  getPrivilegios(): Observable<Privileges[]> {
    return this.http.get<Privileges[]>(this.privilegiosUrl);
  }

  async getAllPrivilegios(): Promise<Privileges[]> {
    try {
      const url = `${this.privilegiosUrl}`;
      const data = await fetch(url, { method: 'GET' });
      return (await data.json()) ?? [];
    } catch (e) {
      alert('Error: ' + e);
      return [];
    }
  }

  addRol(rol: Privileges): Observable<Privileges> {
    console.log(rol);
    return this.http.post<Privileges>(this.privilegiosUrl, rol);
  }

  async updateRol(
    rol: Privileges,
    id_privilegio: number
  ): Promise<Privileges | null> {
    try {
      const response = await fetch(`${this.privilegiosUrl}/${id_privilegio}`, {
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
