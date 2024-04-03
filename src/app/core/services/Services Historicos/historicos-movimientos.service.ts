import { Injectable } from '@angular/core';
import { Movements } from '../../../Models/Master/movements';

@Injectable({
  providedIn: 'root',
})
export class HistoricosMovimientosService {
  constructor() {}

  async getAllMovimientos(): Promise<Movements[]> {
    try {
      let url = 'http://localhost:10395/api/MovimientosApi';
      const data = await fetch(url, { method: 'GET' });
      return (await data.json()) ?? [];
    } catch (e) {
      alert('Error: ' + e);
      return [];
    }
  }
}
