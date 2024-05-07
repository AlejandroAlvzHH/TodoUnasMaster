import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Clinics } from '../../../Models/Master/clinics';

@Injectable({
  providedIn: 'root',
})
export class ClinicasService {
  private clinicasUrl = 'http://localhost:10395/api/ClinicasApi';

  constructor(private http: HttpClient) {}

  getClinicas(): Observable<Clinics[]> {
    return this.http.get<Clinics[]>(this.clinicasUrl);
  }

  async getAllClinicas(): Promise<Clinics[]> {
    try {
      const url = `${this.clinicasUrl}`;
      const data = await fetch(url, { method: 'GET' });
      return (await data.json()) ?? [];
    } catch (e) {
      alert('Error: ' + e);
      return [];
    }
  }

  addClinica(catalogoSalida: Clinics): Observable<Clinics> {
    return this.http.post<Clinics>(this.clinicasUrl, catalogoSalida);
  }

  async updateClinica(
    clinica: Clinics,
    id_clinica: number
  ): Promise<Clinics | null> {
    try {
      const response = await fetch(`${this.clinicasUrl}/${id_clinica}`, {
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

  async deleteClinica(id_clinica: number): Promise<void> {
    try {
      const response = await fetch(`${this.clinicasUrl}/${id_clinica}`, {
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
