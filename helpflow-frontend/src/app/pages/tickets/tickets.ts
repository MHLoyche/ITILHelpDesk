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

  getPriorityClass(priority: string | null | undefined): string {
    const value = (priority || '').toLowerCase().trim();
    switch (value) {
      case 'critical':
        return 'badge-priority-critical';
      case 'low':
        return 'badge-priority-low';
      case 'medium':
        return 'badge-priority-medium';
      case 'high':
        return 'badge-priority-high';
      default:
        return 'badge-unknown';
    }
  }

  getStatusClass(status: string | null | undefined): string {
    const value = (status || '').toLowerCase().trim();
    switch (value) {
      case 'open':
        return 'badge-status-open';
      case 'in progress':
        return 'badge-status-in-progress';
      case 'resolved':
        return 'badge-status-resolved';
      case 'closed':
        return 'badge-status-closed';
      case 'escalated':
        return 'badge-status-escalated';
      default:
        return 'badge-unknown';
    }
  }

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