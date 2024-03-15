import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Sucursales } from '../Models/sucursales';
import { ApiService } from '../core/services/sucursales.service';

@Component({
  selector: 'app-sucursal-selected',
  standalone: true,
  templateUrl: './sucursal-selected.component.html',
  styleUrls: ['./sucursal-selected.component.css'],
})
export class SucursalSelectedComponent implements OnInit {
  sucursal: Sucursales | null = null;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    this.obtenerDetalleSucursal();
  }

  obtenerDetalleSucursal(): void {
    this.route.paramMap.subscribe((params) => {
      const sucursalId = params.get('id');
      if (sucursalId) {
        this.apiService.getSucursalById(parseInt(sucursalId, 10)).subscribe(
          (sucursal: Sucursales | null) => {
            this.sucursal = sucursal;
          },
          (error) => {
            console.error('Error al obtener la sucursal:', error);
          }
        );
      }
    });
  }

  /*eliminarSucursal(): void {
    if (this.sucursal) {
      this.apiService.eliminarSucursal(this.sucursal.id_sucursal).subscribe(
        () => {
          console.log('Sucursal eliminada correctamente.');
        },
        (error) => {
          console.error('Error al eliminar la sucursal:', error);
        }
      );
    }
  }*/
}
