import { Injectable } from '@angular/core';
import { Movements_Detail } from '../../../Models/Master/movements_detail';

@Injectable({
  providedIn: 'root'
})
export class HistoricosMovimientosDetalleService {
  constructor() {}

  async getAllMovimientos(): Promise<Movements_Detail[]> {
    try {
      let url = 'http://localhost:10395/api/DetalleMovimientoApi';
      const data = await fetch(url, { method: 'GET' });
      return (await data.json()) ?? [];
    } catch (e) {
      alert('Error: ' + e);
      return [];
    }
  }
}