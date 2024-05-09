import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from '../../../Models/Master/users';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private url = 'http://localhost:10395/api/UsuariosApi';

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

  updateStatusUsuario(usuario: Users): Observable<Users> {
    console.log('este es el usuario que recibo',usuario)
    const updateUrl = `${this.url}/${usuario.id_usuario}`;
    console.log(updateUrl)
    return this.http.put<Users>(updateUrl, usuario);
  }
}
