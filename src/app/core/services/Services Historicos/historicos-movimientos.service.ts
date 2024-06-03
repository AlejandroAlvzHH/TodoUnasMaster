import { Injectable } from '@angular/core';
import { VistaMovements } from '../../../Models/Master/vista-movements';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HistoricosMovimientosService {
  private baseUrl = environment.baseUrl;
  private url = `${this.baseUrl}/api/VistaMovimientosApi`;

  constructor() {}

  async getAllMovimientos(): Promise<VistaMovements[]> {
    try {
      const data = await fetch(this.url, { method: 'GET' });
      return (await data.json()) ?? [];
    } catch (e) {
      alert('Error: ' + e);
      return [];
    }
  }
}
