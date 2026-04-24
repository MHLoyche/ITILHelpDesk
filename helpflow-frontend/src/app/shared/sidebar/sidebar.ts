import { Component, computed, inject } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppRole, ProfileRoleService } from "../../services/profile-role";

@Component({
  selector: "app-sidebar",
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: "./sidebar.html",
  styleUrl: "./sidebar.css",
})
export class Sidebar {
  // computed property to determine if the user has supporter role
  private readonly profileRole = inject(ProfileRoleService)
  readonly role = this.profileRole.role;
  readonly isSupporter = computed(() => this.role() === "supporter");

  setRole(role: AppRole): void {
    this.profileRole.setRole(role);
  }
}
