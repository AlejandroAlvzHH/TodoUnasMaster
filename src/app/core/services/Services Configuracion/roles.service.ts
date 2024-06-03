import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Roles } from '../../../Models/Master/roles';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private baseUrl = environment.baseUrl;
  private url = `${this.baseUrl}/api/RolesApi`;

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Roles[]> {
    return this.http.get<Roles[]>(this.url);
  }

  async getAllRoles(): Promise<Roles[]> {
    try {
      const data = await fetch(this.url, { method: 'GET' });
      return (await data.json()) ?? [];
    } catch (e) {
      alert('Error: ' + e);
      return [];
    }
  }

  addRol(rol: Roles): Observable<Roles> {
    return this.http.post<Roles>(this.url, rol);
  }

  updateStatusRol(rol: Roles): Observable<Roles> {
    const updateUrl = `${this.url}/${rol.id_rol}`;
    return this.http.put<Roles>(updateUrl, rol);
  }

  async updateRol(rol: Roles, id_rol: number): Promise<Roles | null> {
    try {
      const response = await fetch(`${this.url}/${id_rol}`, {
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

  async getNombrePorId(id_rol: number): Promise<string | null> {
    try {
      const roles = await this.getAllRoles();
      const role = roles.find((r) => r.id_rol === id_rol);
      return role ? role.nombre : null;
    } catch (error) {
      console.error('Error obteniendo nombre del rol:', error);
      throw error;
    }
  }
}
