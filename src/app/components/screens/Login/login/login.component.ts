import { Component } from '@angular/core';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="title-container">
        <h1>TODO UÑAS MASTER</h1>
      </div>
      <form (ngSubmit)="login()">
        <div>
          <label for="username">Usuario:</label>
          <input
            type="text"
            id="username"
            name="username"
            [(ngModel)]="username"
            required
          />
        </div>
        <div>
          <label for="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            [(ngModel)]="password"
            required
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
        <div *ngIf="error" class="error">{{ error }}</div>
      </form>
    </div>
  `,
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    this.error = null;
    try {
      const user = await this.authService.login(this.username, this.password);
      console.log('Inicio de sesión exitoso:', user);
      this.router.navigate(['/']);
    } catch (error: any) {
      if (error.message === 'Credenciales incorrectas') {
        Swal.fire({
          title: 'Credenciales Incorrectas',
          text: 'Usuario o contraseña incorrectos, por favor intente de nuevo.',
          icon: 'warning',
          confirmButtonColor: '#007bff',
          confirmButtonText: 'Aceptar',
        });
      } else {
        Swal.fire({
          title: 'Error de conexión',
          text: 'Hubo un problema al conectar con el servidor, por favor intente nuevamente más tarde.',
          icon: 'error',
          confirmButtonColor: '#007bff',
          confirmButtonText: 'Aceptar',
        });
      }
    }
  }
}
