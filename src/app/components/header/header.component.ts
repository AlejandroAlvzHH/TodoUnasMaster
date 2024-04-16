import { Component } from '@angular/core';
import { SidebaropeningService } from '../../core/services/sidebaropening.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: ` <header>
    <button (click)="toggleSidebar()">☰</button>
    <button *ngIf="showBackButton" (click)="goBack()" class="back-button">
      Volver
    </button>
  </header>`,
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  showBackButton: boolean = false;

  constructor(
    private router: Router,
    private sidebarOpeningService: SidebaropeningService
  ) {
    this.updateBackButtonVisibility();
    this.router.events.subscribe(() => {
      this.updateBackButtonVisibility();
    });
  }

  updateBackButtonVisibility(): void {
    const currentUrl = this.router.url;
    this.showBackButton = currentUrl !== '/';
  }

  goBack(): void {
    if (this.router.url === '/other') {
      this.router.navigate(['/some']);
    } else {
      window.history.back();
    }
  }

  toggleSidebar(): void {
    this.sidebarOpeningService.toggleSidebar();
  }
}
