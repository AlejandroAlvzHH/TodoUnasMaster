import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Clinics } from '../../../Models/Master/clinics';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClinicasService {
  private baseUrl = environment.baseUrl;
  private url = `${this.baseUrl}/api/ClinicasApi`;

  constructor(private http: HttpClient) {}

  getClinicas(): Observable<Clinics[]> {
    return this.http.get<Clinics[]>(this.url);
  }

  getClinicasStatus1(): Observable<Clinics[]> {
    return this.http
      .get<Clinics[]>(this.url)
      .pipe(
        map((clinicas) => clinicas.filter((clinica) => clinica.status === 1))
      );
  }

  async getAllClinicas(): Promise<Clinics[]> {
    try {
      const data = await fetch(this.url, { method: 'GET' });
      return (await data.json()) ?? [];
    } catch (e) {
      alert('Error: ' + e);
      return [];
    }
  }

  addClinica(catalogoSalida: Clinics): Observable<Clinics> {
    return this.http.post<Clinics>(this.url, catalogoSalida);
  }

  async updateClinica(
    clinica: Clinics,
    id_clinica: number
  ): Promise<Clinics | null> {
    try {
      const response = await fetch(`${this.url}/${id_clinica}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clinica),
      });
      if (response.status === 204) {
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating clinica:', error);
      throw error;
    }
  }

  updateStatusClinica(clinica: Clinics): Observable<Clinics> {
    const updateUrl = `${this.url}/${clinica.id_clinica}`;
    console.log(updateUrl);
    return this.http.put<Clinics>(updateUrl, clinica);
  }

  async deleteClinica(id_clinica: number): Promise<void> {
    try {
      const response = await fetch(`${this.url}/${id_clinica}`, {
        method: 'DELETE',
      });
      if (response.status !== 204) {
        throw new Error('Failed to delete clinica');
      }
    } catch (error) {
      console.error('Error deleting clinica:', error);
      throw error;
    }
  }
}
