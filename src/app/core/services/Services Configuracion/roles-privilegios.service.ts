import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { VistaRolesPrivilegios } from '../../../Models/Master/vista-roles-privilegios';
import { Roles_Privileges } from '../../../Models/Master/roles_privileges';

@Injectable({
  providedIn: 'root',
})
export class RolesPrivilegiosService {
  private url = 'http://localhost:10395/api/RolesPrivilegiosApi';

  constructor(private http: HttpClient) {}

  deleteRolesPrivilegios(
    idRol: number,
    idPrivilegio: number
  ): Observable<void> {
    const deleteUrl = `${this.url}/${idRol}/${idPrivilegio}`;
    console.log('entra a mi api')
    return this.http.delete<void>(deleteUrl).pipe(
      catchError((error) => {
        console.error('Error eliminando roles privilegios:', error);
        throw error;
      })
    );
  }

  createRolesPrivilegios(rolesPrivilegios: any): Observable<any> {
    console.log(rolesPrivilegios)
    return this.http.post<any>(this.url, rolesPrivilegios).pipe(
      catchError((error) => {
        console.error('Error creando roles privilegios:', error);
        throw error;
      })
    );
  }
}
