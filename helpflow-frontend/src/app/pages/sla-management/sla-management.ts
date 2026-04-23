import { Component, computed, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SlaPolicy, SlaService } from "../../services/sla";

@Component({
  selector: "app-sla-management",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./sla-management.html",
  styleUrl: "./sla-management.css",
})

export class SlaManagement {
  slas = signal<SlaPolicy[]>([]);
  loading = signal(true);
  error = signal("");

  totalPolicies = computed(() => this.slas().length);

  avgResponseHours = computed(() => {
    const rows = this.slas();
    if (!rows.length) return 0;
    return Math.round((rows.reduce((sum, s) => sum + s.responseHours, 0) / rows.length) * 10) / 10;
  });

  avgResolveHours = computed(() => {
    const rows = this.slas();
    if (!rows.length) return 0;
    return Math.round((rows.reduce((sum, s) => sum + s.resolveHours, 0) / rows.length) * 10) / 10;
  });

  constructor(private slaService: SlaService) {
    this.loadSlas();
  }

  loadSlas(): void {
    this.loading.set(true);
    this.error.set("");

    this.slaService.getSlas().subscribe({
      next: (data) => {
      this.slas.set(data ?? []);
      this.loading.set(false);
    },
    error: () => {
      this.error.set("Failed to load SLA data.");
      this.loading.set(false);
      },
    });
  }
}