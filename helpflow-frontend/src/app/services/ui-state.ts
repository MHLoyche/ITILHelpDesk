import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UiStateService {
  // sidebar open state; default true for desktop
  readonly sidebarOpen = signal<boolean>(true);

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  setSidebar(open: boolean): void {
    this.sidebarOpen.set(open);
  }
}
