import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { RolesService } from '../../../../../../core/services/Services Configuracion/roles.service';
import { FormsModule } from '@angular/forms';
import { Privileges } from '../../../../../../Models/Master/privileges';
import { PrivilegiosService } from '../../../../../../core/services/Services Configuracion/privilegios.service';

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
                    id="miCheckbox"
                    name="miCheckbox"
                    value="valorCheckbox"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="botonera">
          <button class="btn">Modificar</button>
          <button class="btn-cerrar" (click)="cerrarModal()">Cancelar</button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './ajustar-privilegios.component.css',
})
export class AjustarPrivilegiosComponent {
  loading: boolean = false;
  @Output() cancelar = new EventEmitter<void>();
  privilegiosList: Privileges[] = [];

  constructor(private privilegiosService: PrivilegiosService) {}

  ngOnInit(): void {
    this.privilegiosService.getAllPrivilegios().then((privilegios) => {
      this.privilegiosList = privilegios;
    });
  }

  cerrarModal() {
    this.cancelar.emit();
  }
}
