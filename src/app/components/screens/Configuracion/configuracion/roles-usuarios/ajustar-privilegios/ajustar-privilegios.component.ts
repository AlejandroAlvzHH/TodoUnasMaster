import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RolesService } from '../../../../../../core/services/Services Configuracion/roles.service';
import { FormsModule } from '@angular/forms';
import { Privileges } from '../../../../../../Models/Master/privileges';
import { PrivilegiosService } from '../../../../../../core/services/Services Configuracion/privilegios.service';
import { Roles } from '../../../../../../Models/Master/roles';
import { VistaRolesPrivilegios } from '../../../../../../Models/Master/vista-roles-privilegios';
import { VistaRolesPrivilegiosService } from '../../../../../../core/services/Services Configuracion/vista-roles-privilegios.service';
import { RolesPrivilegiosService } from '../../../../../../core/services/Services Configuracion/roles-privilegios.service';

@Component({
  selector: 'app-ajustar-privilegios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal">
      <div class="modal-content">
        <h2>Ajustar Privilegios</h2>
        <div *ngIf="loading" class="loading-overlay">
          <div class="loading-spinner"></div>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Privilegio</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let privilegio of privilegiosList; let i = index">
                <td>{{ i + 1 }}</td>
                <td>{{ privilegio.nombre }}</td>
                <td>
                  <input
                    type="checkbox"
                    id="checkbox_{{ i }}"
                    [checked]="privilegioSeleccionado(privilegio)"
                    (change)="marcarPrivilegio(privilegio)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="botonera">
          <button class="btn" (click)="modificarPrivilegios()">
            Modificar
          </button>
          <button class="btn-cerrar" (click)="cerrarModal()">Cerrar</button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './ajustar-privilegios.component.css',
})
export class AjustarPrivilegiosComponent {
  loading: boolean = false;
  @Output() cancelar = new EventEmitter<void>();
  @Input() rolSeleccionado: Roles | null = null;
  privilegiosList: Privileges[] = [];
  privilegiosDisponibles?: VistaRolesPrivilegios[] = [];
  backupPrivilegios: VistaRolesPrivilegios[] = [];

  constructor(
    private privilegiosService: PrivilegiosService,
    private vistaRolesPrivilegiosService: VistaRolesPrivilegiosService,
    private RolesPrivilegiosService: RolesPrivilegiosService
  ) {}

  ngOnInit(): void {
    this.vistaRolesPrivilegiosService
      .getAllRolesPrivilegiosXD(this.rolSeleccionado!.id_rol)
      .then((data) => {
        this.privilegiosDisponibles = data;
        this.backupPrivilegios = [...this.privilegiosDisponibles];
        console.log(this.privilegiosDisponibles)
      })
      .catch((error) => {
        console.error('Error al obtener los roles y privilegios:', error);
      });

    this.privilegiosService.getAllPrivilegios().then((privilegios) => {
      this.privilegiosList = privilegios;
    });
  }

  privilegioSeleccionado(privilegio: Privileges): boolean {
    return this.privilegiosDisponibles!.some(
      (priv) => priv.id_privilegio === privilegio.id_privilegio
    );
  }

  marcarPrivilegio(privilegio: Privileges): void {
    if (this.privilegioSeleccionado(privilegio)) {
      this.privilegiosDisponibles = this.privilegiosDisponibles!.filter(
        (priv) => priv.id_privilegio !== privilegio.id_privilegio
      );
    } else {
      this.privilegiosDisponibles!.push({
        id_rol: this.rolSeleccionado!.id_rol,
        nombre_rol: this.rolSeleccionado!.nombre,
        id_privilegio: privilegio.id_privilegio,
        nombre_privilegio: privilegio.nombre,
      });
    }
  }

  modificarPrivilegios(): void {
    console.log('Backup de privilegios:', this.backupPrivilegios);
    console.log(
      'Nuevos privilegios seleccionados:',
      this.privilegiosDisponibles
    );
    const privilegiosABorrar = this.backupPrivilegios.filter(
      (priv) =>
        !this.privilegiosDisponibles!.some(
          (newPriv) => newPriv.id_privilegio === priv.id_privilegio
        )
    );
    const privilegiosAAgregar = this.privilegiosDisponibles!.filter(
      (newPriv) =>
        !this.backupPrivilegios.some(
          (priv) => priv.id_privilegio === newPriv.id_privilegio
        )
    );
    const privilegiosIguales = this.backupPrivilegios.filter((priv) =>
      this.privilegiosDisponibles!.some(
        (newPriv) => newPriv.id_privilegio === priv.id_privilegio
      )
    );
    console.log('Privilegios a borrar:', privilegiosABorrar);
    console.log('Privilegios a agregar:', privilegiosAAgregar);
    console.log('Privilegios que permanecieron iguales:', privilegiosIguales);
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción modificará los privilegios',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#333333',
      cancelButtonColor: '#bcbcbs',
      confirmButtonText: 'Sí, modificar',
    }).then((result) => {
      if (result.isConfirmed) {
        privilegiosABorrar.forEach((privilegio) => {
          console.log(
            'se borrará',
            privilegio.id_rol,
            privilegio.id_privilegio
          );
          this.RolesPrivilegiosService.deleteRolesPrivilegios(
            privilegio.id_rol,
            privilegio.id_privilegio
          ).subscribe(
            () => {
              console.log('Privilegio borrado exitosamente:', privilegio);
            },
            (error) => {
              console.error('Error al borrar el privilegio:', error);
            }
          );
        });
        privilegiosAAgregar.forEach((privilegio) => {
          const JSON = {
            id_rol: privilegio.id_rol,
            id_privilegio: privilegio.id_privilegio,
          };
          console.log(JSON);
          this.RolesPrivilegiosService.createRolesPrivilegios(JSON).subscribe(
            (response) => {
              console.log('Respuesta del servidor:', response);
              Swal.fire({
                title: '¡Privilegios Actualizados!',
                icon: 'success',
                confirmButtonColor: '#333333',
                confirmButtonText: 'Aceptar',
              });
            },
            (error) => {
              console.error('Error al crear roles privilegios:', error);
              Swal.fire({
                title: 'Error!',
                icon: 'error',
                confirmButtonColor: '#333333',
                confirmButtonText: 'Aceptar',
              });
            }
          );
        });
      }
    });
  }

  cerrarModal() {
    this.cancelar.emit();
  }
}
