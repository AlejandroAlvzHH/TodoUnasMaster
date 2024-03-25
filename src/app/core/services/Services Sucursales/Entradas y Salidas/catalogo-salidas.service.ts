import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatalogoSalidas } from '../../../../Models/catalogo_salidas';

@Injectable({
  providedIn: 'root'
})
export class CatalogoSalidasService {
  private catalogoSalidasUrl = 'http://localhost:10395/api/CatalogoSalidasApi'; 

  constructor(private http: HttpClient) { }

  getCatalogoSalidas(): Observable<CatalogoSalidas[]> {
    return this.http.get<CatalogoSalidas[]>(this.catalogoSalidasUrl);
  }
}
