import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { VistaRolesPrivilegiosService } from './vista-roles-privilegios.service';

@Injectable({
  providedIn: 'root',
})
export class PermisosService {
  currentUser: any;
  privilegiosDisponibles: any[] = [];

  constructor(
    private authService: AuthService,
    private vistaRolesPrivilegiosService: VistaRolesPrivilegiosService
  ) {}

  async getAllRolesPrivilegios(id_buscar: number): Promise<boolean> {
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
    try {
      const id = this.currentUser?.id_rol;
      if (id) {
        this.privilegiosDisponibles =
          await this.vistaRolesPrivilegiosService.getAllRolesPrivilegios(id);
        const privilegioEncontrado = this.privilegiosDisponibles.find(
          (privilegio) => privilegio.id_privilegio === id_buscar
        );
        if (privilegioEncontrado) {
          console.log('Privilegio encontrado:', privilegioEncontrado);
          return true;
        } else {
          console.log('Privilegio no encontrado');
          return false;
        }
      }
    } catch (error) {
      console.error('Error al obtener los roles y privilegios:', error);
      return false;
    }
    return false;
  }

  permissions = {
    DELETE_BRANCH: 1,
    EDIT_BRANCH: 2,
    ADD_BRANCH: 3,
    VIEW_ENTRIES_AND_EXITS: 4,
    VIEW_INVENTORY: 5,
    VIEW_TRANSFER_TO_BRANCH: 6,
    VIEW_TRANSFER_TO_CLINIC: 7,
    ADD_PRODUCT_CATALOG: 8,
    RETRY_SYNCHRONIZATION: 9,
    EDIT_GENERAL_PRODUCT_CATALOG: 10,
    VIEW_SETTINGS: 11,
    VIEW_PASSWORDS: 12,
    VIEW_OUTGOINGS_CATALOG: 13,
    VIEW_CLINICS_CATALOG: 14,
    VIEW_ROLES_AND_USERS: 15,
  };

  canDeleteBranch(): boolean {
    return this.checkPermission(this.permissions.DELETE_BRANCH);
  }

  canEditBranch(): boolean {
    return this.checkPermission(this.permissions.EDIT_BRANCH);
  }

  canAddBranch(): Promise<boolean> {
    return this.getAllRolesPrivilegios(3).then((result) => result); 
  }

  canViewEntriesAndExits(): boolean {
    return this.checkPermission(this.permissions.VIEW_ENTRIES_AND_EXITS);
  }

  canViewInventory(): boolean {
    return this.checkPermission(this.permissions.VIEW_INVENTORY);
  }

  canViewTransferToBranch(): boolean {
    return this.checkPermission(this.permissions.VIEW_TRANSFER_TO_BRANCH);
  }

  canViewTransferToClinic(): boolean {
    return this.checkPermission(this.permissions.VIEW_TRANSFER_TO_CLINIC);
  }

  canAddProductCatalog(): boolean {
    return this.checkPermission(this.permissions.ADD_PRODUCT_CATALOG);
  }

  canRetrySynchronization(): boolean {
    return this.checkPermission(this.permissions.RETRY_SYNCHRONIZATION);
  }

  canEditGeneralProductCatalog(): boolean {
    return this.checkPermission(this.permissions.EDIT_GENERAL_PRODUCT_CATALOG);
  }

  canViewSettings(): boolean {
    return this.checkPermission(this.permissions.VIEW_SETTINGS);
  }

  canViewPasswords(): boolean {
    return this.checkPermission(this.permissions.VIEW_PASSWORDS);
  }

  canViewOutgoingsCatalog(): boolean {
    return this.checkPermission(this.permissions.VIEW_OUTGOINGS_CATALOG);
  }

  canViewClinicsCatalog(): boolean {
    return this.checkPermission(this.permissions.VIEW_CLINICS_CATALOG);
  }

  canViewRolesAndUsers(): boolean {
    return this.checkPermission(this.permissions.VIEW_ROLES_AND_USERS);
  }

  checkPermission(id: number): boolean {
    return Object.values(this.privilegiosDisponibles).includes(id);
  }
}
