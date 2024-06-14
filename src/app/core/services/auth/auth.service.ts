import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Users } from '../../../Models/Master/users';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.baseUrl;
  private urlAuthenticate = `${this.baseUrl}/api/UsuariosApi/authenticate`;
  private urlUsers = `${this.baseUrl}/api/UsuariosApi`;
  private urlRolesPrivilegios = `${this.baseUrl}/api/VistaRolesPrivilegiosApi`;
  private currentUserSubject: BehaviorSubject<Users | null>;
  public currentUser: Observable<Users | null>;
  public userPrivileges: any[] = [];

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<Users | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();

    if (this.currentUserValue) {
      this.loadUserPrivilegesERROR(this.currentUserValue.id_rol);
    }
  }

  public get currentUserValue(): Users | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  async login(username: string, password: string): Promise<void> {
    try {
      const response = await this.http
        .post<any>(this.urlAuthenticate, {
          correo: username,
          contraseña: password,
        })
        .toPromise();
      const user = response.user;
      if (user.status !== 1) {
        throw new Error('El usuario está desactivado');
      }
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      await this.loadUserPrivilegesERROR(user.id_rol);
    } catch (error: any) {
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.userPrivileges = [];
  }

  async loadUserPrivilegesERROR(rolID: number): Promise<void> {
    try {
      const response = await this.http
        .get<any[]>(`${this.urlRolesPrivilegios}/${rolID}`)
        .toPromise();
      this.userPrivileges = response || [];
    } catch (error) {
      console.error('Error loading privileges:', error);
      this.userPrivileges = [];
    }
  }

  hasPrivilege(privilegeName: string): boolean {
    const hasPrivilege = this.userPrivileges.some(
      (p) => p.nombre_privilegio === privilegeName
    );
    console.log('Has privilege:', hasPrivilege);
    return hasPrivilege;
  }
}
