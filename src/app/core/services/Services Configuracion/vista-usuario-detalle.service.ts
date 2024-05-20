import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VistaUsuarioDetalle } from '../../../Models/Master/vista-usuario-detalle';

@Injectable({
  providedIn: 'root',
})
export class VistaUsuarioDetalleService {
  private url = 'http://localhost:10395/api/VistaUsuarioDetalleApi';

  constructor(private http: HttpClient) {}

  async getAllDetalleUsers(): Promise<VistaUsuarioDetalle[]> {
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
