import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Clinics } from '../../../Models/Master/clinics';

@Injectable({
  providedIn: 'root'
})
export class ClinicasService {
  private clinicasUrl = 'http://localhost:10395/api/ClinicasApi'; 

  constructor(private http: HttpClient) { }

  getClinicas(): Observable<Clinics[]> {
    return this.http.get<Clinics[]>(this.clinicasUrl);
  }
}
