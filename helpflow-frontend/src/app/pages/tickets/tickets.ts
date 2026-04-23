import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../services/ticket';

export interface Ticket {
  ticket_id: number;
  title: string;
  requesterName: string;
  supporterName: string;
  createdAt: string;
  priorityName: string;
  statusName: string;
  categoryName: string;
}

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css'
})

export class Tickets implements OnInit {
  tickets = signal<Ticket[]>([]);
  searchTerm = signal('');
  selectedStatus = signal('');
  selectedPriority = signal('');
  currentPage = signal(1);
  readonly itemsPerPage = 10;

  loading = signal(true);
  error = signal<string | null>(null);

  // inject TicketService to fetch tickets from backend
  constructor(private ticketService: TicketService) {}

  // fetch tickets from backend on component initialization
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

  // compute filtered tickets based on search term, selected status, and selected priority
  filteredTickets = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const status = this.selectedStatus().toLowerCase().trim();
    const priority = this.selectedPriority().toLowerCase().trim();

    return this.tickets().filter((ticket) => {
      const matchesSearch = !term || ticket.title.toLowerCase().includes(term) || ticket.requesterName.toLowerCase().includes(term);
      const matchesStatus = !status || (ticket.statusName || '').toLowerCase() === status;
      const matchesPriority = !priority || (ticket.priorityName || '').toLowerCase() === priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  });

  // calculate total pages based on filtered tickets
  totalPages = computed(() => {
    return Math.ceil(this.filteredTickets().length / this.itemsPerPage);
  });

  // get tickets for current page
  paginatedTickets = computed(() => {
    const filtered = this.filteredTickets();
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
    return filtered.slice(startIndex, startIndex + this.itemsPerPage);
  })

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  getPageNumbers() {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    let start = Math.max(1, current - 2);
    let end = Math.min(total, current + 2);

    if (end - start < 4) {
      if (start === 1) end = Math.min(total, 5);
      else start = Math.max(1, end - 4);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  // options for status and priority filters
  statusOptions = [
    'Open',
    'In Progress',
    'Pending',
    'Resolved',
    'Closed',
    'Escalated',
  ];

  priorityOptions = [
    'Critical', 
    'High', 
    'Medium', 
    'Low'
  ];

  // helper methods to get CSS classes based on priority and status
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
}