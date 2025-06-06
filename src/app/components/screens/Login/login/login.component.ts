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
        <button>Iniciar Sesión</button>
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
      await this.authService.login(this.username, this.password);
      this.router.navigate(['/']);
    } catch (error: any) {
      console.log(error);
      if (error.status === 401) {
        this.error =
          'Usuario o contraseña incorrectos, por favor intente de nuevo.';
        this.showErrorAlert('Credenciales Incorrectas', this.error);
      } else if (error.message === 'El usuario está desactivado') {
        this.error =
          'Su usuario está desactivado, por favor contacte al administrador.';
        this.showErrorAlert('Usuario Desactivado', this.error);
      } else {
        this.error =
          'Hubo un problema al conectar con el servidor, por favor intente nuevamente más tarde.';
        this.showErrorAlert('Error de conexión', this.error);
      }
    }
  }
  showErrorAlert(title: string, message: string) {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonColor: '#333333',
      confirmButtonText: 'Aceptar',
    });
  }
}
