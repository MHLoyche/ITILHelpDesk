import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SupporterService, Supporter } from "../../services/supporters";

@Component({
  selector: "app-contact",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./contact.html",
  styleUrl: "./contact.css",
})
export class Contact implements OnInit {
  supporters = signal<Supporter[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private supporterService: SupporterService) {}

  ngOnInit(): void {
    this.supporterService.getSupporters().subscribe({
      next: (data) => {
        this.supporters.set(data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set("Failed to load supporters");
        this.loading.set(false);
      },
    });
  }
}