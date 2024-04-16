import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Users } from '../../../Models/Master/users';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:10395/api/UsuariosApi';
  private currentUserSubject: BehaviorSubject<Users | null>;
  public currentUser: Observable<Users | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<Users | null>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Users | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  login(username: string, password: string): Promise<Users> {
    return this.http
      .get<any[]>(`${this.apiUrl}?correo=${username}&contrasena=${password}`)
      .toPromise()
      .then((users) => {
        const user = users?.find(
          (u) => u.correo === username && u.contrasena === password
        );
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
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
    this.currentUserSubject.next(null);
  }
}
