import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Users } from '../../../Models/Master/users';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:10395/api/UsuariosApi';
  private currentUser: Users | null = null;

  setCurrentUser(user: Users): void {
    this.currentUser = user;
  }

  getCurrentUser(): Users | null {
    return this.currentUser;
  }

  clearCurrentUser(): void {
    this.currentUser = null;
  }

  constructor(private http: HttpClient) {}

  isLoggedIn(): boolean {
    try {
      const currentUser = localStorage.getItem('currentUser');
      return !!currentUser;
    } catch (error) {
      console.error('Error al verificar la autenticación:', error);
      return false;
    }
  }  

  login(username: string, password: string) {
    return this.http
      .get<any[]>(`${this.apiUrl}?correo=${username}&contrasena=${password}`)
      .toPromise()
      .then((users) => {
        const user = users?.find(
          (u) => u.correo === username && u.contrasena === password
        );
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          return user;
        } else {
          throw new Error('Credenciales incorrectas');
        }
      })
      .catch((error) => {
        if (error.status === 0 || error.statusText === 'Unknown Error') {
          throw new Error('Error de conexión');
        } else {
          throw error;
        }
      });
  }

  logout() {
    localStorage.removeItem('currentUser');
  }
}
