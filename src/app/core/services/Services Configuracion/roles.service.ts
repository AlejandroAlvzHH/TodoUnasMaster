import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Roles } from '../../../Models/Master/roles';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private rolesUrl = 'http://localhost:10395/api/RolesApi';

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Roles[]> {
    return this.http.get<Roles[]>(this.rolesUrl);
  }

  async getAllRoles(): Promise<Roles[]> {
    try {
      const url = `${this.rolesUrl}`;
      const data = await fetch(url, { method: 'GET' });
      return (await data.json()) ?? [];
    } catch (e) {
      alert('Error: ' + e);
      return [];
    }
  }

  addRol(rol: Roles): Observable<Roles> {
    console.log(rol)
    return this.http.post<Roles>(this.rolesUrl, rol);
  }

  async updateRol(rol: Roles, id_rol: number): Promise<Roles | null> {
    try {
      const response = await fetch(`${this.rolesUrl}/${id_rol}`, {
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
      console.error('Error updating rol:', error);
      throw error;
    }
  }
}