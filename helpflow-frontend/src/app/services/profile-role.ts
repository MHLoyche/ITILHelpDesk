import { Injectable, signal } from "@angular/core";

export type AppRole = "user" | "supporter";

@Injectable({
  providedIn: "root",
})
export class ProfileRoleService {
  private readonly storageKey = "helpflow_role";
  readonly role = signal<AppRole>(this.getInitialRole());

  setRole(role: AppRole): void {
    this.role.set(role);
    localStorage.setItem(this.storageKey, role);
  }

  private getInitialRole(): AppRole {
    const stored = localStorage.getItem(this.storageKey);
    return stored === "supporter" ? "supporter" : "user";
  }
}