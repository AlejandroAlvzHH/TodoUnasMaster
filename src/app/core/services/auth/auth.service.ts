import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Users } from '../../../Models/Master/users';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:10395/api/UsuariosApi';
  private rolesPrivilegiosUrl = 'http://localhost:10395/api/VistaRolesPrivilegiosApi';
  private currentUserSubject: BehaviorSubject<Users | null>;
  public currentUser: Observable<Users | null>;
  public userPrivileges: any[] = [];

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<Users | null>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
    this.currentUser = this.currentUserSubject.asObservable();

    if (this.currentUserValue) {
      this.loadUserPrivileges(this.currentUserValue.id_usuario);
    }
  }

  public get currentUserValue(): Users | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  async login(username: string, password: string): Promise<Users> {
    return this.http
      .get<any[]>(`${this.apiUrl}?correo=${username}&contrasena=${password}`)
      .toPromise()
      .then(async (users) => {
        const user = users?.find(
          (u) => u.correo === username && u.contrasena === password
        );
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          await this.loadUserPrivileges(user.id);
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
    this.userPrivileges = [];
  }

  async loadUserPrivileges(userId: number): Promise<void> {
    try {
      const response = await this.http.get<any[]>(`${this.rolesPrivilegiosUrl}/${userId}`).toPromise();
      this.userPrivileges = response || [];
      console.log('User Privileges:', this.userPrivileges); // Agregar este log
    } catch (error) {
      console.error('Error loading privileges:', error);
      this.userPrivileges = [];
    }
  }

  hasPrivilege(privilegeName: string): boolean {
    console.log('Checking privilege:', privilegeName);
    const hasPrivilege = this.userPrivileges.some(p => p.nombre_privilegio === privilegeName);
    console.log('Has privilege:', hasPrivilege);
    return hasPrivilege;
  }
}
