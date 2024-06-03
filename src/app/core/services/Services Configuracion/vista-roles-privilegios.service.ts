import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VistaRolesPrivilegios } from '../../../Models/Master/vista-roles-privilegios';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VistaRolesPrivilegiosService {
  private baseUrl = environment.baseUrl;
  private url = `${this.baseUrl}/api/VistaRolesPrivilegiosApi`;

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

  async getAllRolesPrivilegiosXD(id: number): Promise<any[]> {
    try {
      const url = `${this.url}/${id}`;
      const response = await this.http.get<any[]>(url).toPromise();
      return response ?? [];
    } catch (e) {
      return [];
    }
  }
}
