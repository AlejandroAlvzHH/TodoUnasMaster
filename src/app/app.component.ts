import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SucursalSelectedComponent } from './components/screens/Sucursales/sucursal-selected/sucursal-selected.component';
import { HomeComponent } from './components/screens/Sucursales/home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SucursalSelectedComponent, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-17-app';
}
