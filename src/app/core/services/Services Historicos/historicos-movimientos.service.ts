import { Injectable } from '@angular/core';
import { VistaMovements } from '../../../Models/Master/vista-movements';
@Injectable({
  providedIn: 'root',
})
export class HistoricosMovimientosService {
  constructor() {}

  async getAllMovimientos(): Promise<VistaMovements[]> {
    try {
      let url = 'http://localhost:10395/api/VistaMovimientosApi';
      const data = await fetch(url, { method: 'GET' });
      return (await data.json()) ?? [];
    } catch (e) {
      alert('Error: ' + e);
      return [];
    }
  }
}
