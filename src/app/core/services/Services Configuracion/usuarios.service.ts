import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from '../../../Models/Master/users';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private url = 'http://localhost:10395/api/UsuariosApi';

  constructor(private http: HttpClient) { }

  async getAllClinicas(): Promise<Users[]> {
    try {
      const url = `${this.url}`;
      const data = await fetch(url, { method: 'GET' });
      return (await data.json()) ?? [];
    } catch (e) {
      alert('Error: ' + e);
      return [];
    }
  }
}
