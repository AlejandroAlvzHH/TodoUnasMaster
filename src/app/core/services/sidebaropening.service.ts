import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebaropeningService {
  private isOpenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isOpen$: Observable<boolean> = this.isOpenSubject.asObservable();

  constructor() {}

  toggleSidebar(): void {
    const isOpen = this.isOpenSubject.getValue();
    this.isOpenSubject.next(!isOpen);
  }
}
