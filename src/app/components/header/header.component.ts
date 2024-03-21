import { Component } from '@angular/core';
import { SidebaropeningService } from '../../core/services/sidebaropening.service';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `<header>
    <button (click)="toggleSidebar()">☰</button>
  </header>`,
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(private sidebarOpeningService: SidebaropeningService) {}

  toggleSidebar(): void {
    console.log('Toggle Sidebar called from HeaderComponent');
    this.sidebarOpeningService.toggleSidebar();
  }
}
