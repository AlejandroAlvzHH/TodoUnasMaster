import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './core/services/auth/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const requiredPrivilege = route.data['requiredPrivilege'] as string;
    console.log('Required Privilege:', requiredPrivilege);

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']); 
      return false; 
    }

    if (this.authService.userPrivileges.length === 0) {
      const currentUser = this.authService.currentUserValue;
      if (currentUser) {
        await this.authService.loadUserPrivileges(currentUser.id_usuario);
      }
    }

    if (this.authService.hasPrivilege(requiredPrivilege)) {
      return true; 
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Acceso Denegado',
        text: 'No tienes los permisos necesarios para acceder a esta ruta. Serás deslogeado. Si necesitas acceso, contacta al administrador.',
      }).then(() => {
        this.authService.logout();
        this.router.navigate(['/login']);
      });
      return false; 
    }
  }
}
