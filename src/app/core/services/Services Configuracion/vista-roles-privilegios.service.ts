import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VistaRolesPrivilegios } from '../../../Models/Master/vista-roles-privilegios';

@Injectable({
  providedIn: 'root',
})
export class VistaRolesPrivilegiosService {
  private url = 'http://localhost:10395/api/VistaRolesPrivilegiosApi';

  constructor(private http: HttpClient) {}

  getRolesPrivilegios(id: number): Observable<VistaRolesPrivilegios[]> {
    return this.http.get<VistaRolesPrivilegios[]>(`${this.url}/${id}`);
  }

  async getAllRolesPrivilegios(id: number): Promise<VistaRolesPrivilegios[]> {
    try {
      const url = `${this.url}/${id}`;
      const data = await fetch(url, { method: 'GET' });
      return (await data.json()) ?? [];
    } catch (e) {
      alert('Error: ' + e);
      return [];
    }
  }
}
