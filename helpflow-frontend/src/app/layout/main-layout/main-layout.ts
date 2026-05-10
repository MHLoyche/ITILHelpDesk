import { Component, inject } from "@angular/core";
import { Footer } from "../../shared/footer/footer";
import { Sidebar } from "../../shared/sidebar/sidebar";
import { RouterOutlet } from "@angular/router";
import { UiStateService } from "../../services/ui-state";

@Component({
  selector: "app-main-layout",
  imports: [Sidebar, Footer, RouterOutlet],
  templateUrl: "./main-layout.html",
  styleUrl: "./main-layout.css",
})
export class MainLayout {
  private readonly ui = inject(UiStateService);

  toggleSidebar(): void {
    this.ui.toggleSidebar();
  }
}
