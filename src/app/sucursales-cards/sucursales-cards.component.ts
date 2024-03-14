import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Sucursales } from '../Models/sucursales';

@Component({
  selector: 'app-sucursales-cards',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template:  `
    <h2>{{ sucursales.nombre }}</h2>
    <p>{{ sucursales.estado }}</p>
    <p>{{ sucursales.fechaActualizacion }}</p>
`,
  styleUrl: './sucursales-cards.component.css'
})
export class SucursalesCardsComponent {
  @Input() sucursales!: Sucursales;
}
