import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RolesPrivilegiosService {
  private baseUrl = environment.baseUrl;
  private url = `${this.baseUrl}/api/RolesPrivilegiosApi`;

  constructor(private http: HttpClient) {}

  deleteRolesPrivilegios(
    idRol: number,
    idPrivilegio: number
  ): Observable<void> {
    const deleteUrl = `${this.url}/${idRol}/${idPrivilegio}`;
    console.log('entra a mi api');
    return this.http.delete<void>(deleteUrl).pipe(
      catchError((error) => {
        console.error('Error eliminando roles privilegios:', error);
        throw error;
      })
    );
  }

  createRolesPrivilegios(rolesPrivilegios: any): Observable<any> {
    console.log(rolesPrivilegios);
    return this.http.post<any>(this.url, rolesPrivilegios).pipe(
      catchError((error) => {
        console.error('Error creando roles privilegios:', error);
        throw error;
      })
    );
  }
}
