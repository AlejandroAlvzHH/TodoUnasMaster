import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from '../../../Models/Master/users';
import { environment } from '../../../../environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private baseUrl = environment.baseUrl;
  private url = `${this.baseUrl}/api/UsuariosApi`;

  constructor(private http: HttpClient) {}

  async getAllUsers(): Promise<Users[]> {
    try {
      const url = `${this.url}`;
      const data = await fetch(url, { method: 'GET' });
      return (await data.json()) ?? [];
    } catch (e) {
      alert('Error: ' + e);
      return [];
    }
  }

  addUsuario(usuario: Users): Observable<Users> {
    return this.http.post<Users>(this.url, usuario);
  }

  getUserById(id: number): Observable<Users> {
    const userUrl = `${this.url}/${id}`;
    return this.http.get<Users>(userUrl);
  }
  
  updateStatusUsuario(usuario: Users): Observable<Users> {
    console.log('este es el usuario que recibo',usuario)
    const updateUrl = `${this.url}/updateWithPassword/${usuario.id_usuario}`;
    console.log(updateUrl)
    return this.http.put<Users>(updateUrl, usuario);
  }

  verificarCorreoExistente(correo: string): Observable<boolean> {
    const params = new HttpParams().set('correo', correo);
    const verificarUrl = `${this.url}/existe-correo`;
    return this.http.get<boolean>(verificarUrl, { params });
  }
  
}
