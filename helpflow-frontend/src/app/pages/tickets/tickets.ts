import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../services/ticket';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css'
})
export class Tickets implements OnInit {
  tickets = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.ticketService.getTickets().subscribe({
      next: (data) => {
        this.tickets.set(data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load tickets');
        this.loading.set(false);
      }
    });
  }
}