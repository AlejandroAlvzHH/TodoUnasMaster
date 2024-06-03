import { Injectable } from '@angular/core';
import { VistaUsuarioDetalle } from '../../../Models/Master/vista-usuario-detalle';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VistaUsuarioDetalleService {
  private baseUrl = environment.baseUrl;
  private url = `${this.baseUrl}/api/VistaUsuarioDetalleApi`;

  constructor() {}

  async getAllDetalleUsers(): Promise<VistaUsuarioDetalle[]> {
    try {
      const data = await fetch(this.url, { method: 'GET' });
      return (await data.json()) ?? [];
    } catch (e) {
      alert('Error: ' + e);
      return [];
    }
  }
}
