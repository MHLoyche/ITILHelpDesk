import { Component, computed, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SlaPolicy, SlaService } from "../../services/sla";
import { TicketService } from "../../services/ticket";
import { forkJoin } from "rxjs";

// This interface extends the basic ticket structure to include SLA tracking fields
interface SlaTrackedTicket {
  ticket_id: number;
  createdAt: string;
  updatedAt?: string | null;
  closedAt?: string | null;
  statusName?: string | null;
  resolveHours?: number | null;
}

@Component({
  selector: "app-sla-management",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./sla-management.html",
  styleUrl: "./sla-management.css",
})

export class SlaManagement {
  slas = signal<SlaPolicy[]>([]);
  tickets = signal<SlaTrackedTicket[]>([]);
  loading = signal(true);
  error = signal("");

  // computed properties for SLA statistics
  totalPolicies = computed(() => this.slas().length);

  // total tickets that are currently being tracked for SLA compliance
  successfulHeldCount = computed(() => {
    return this.tickets().reduce((count, ticket) => {
      return this.isTicketHeld(ticket) ? count + 1 : count;
    }, 0);
  });

  // total tickets that have breached their SLA
  breachedCount = computed(() => {
    return this.tickets().reduce((count, ticket) => {
      return this.isTicketBreached(ticket) ? count + 1 : count;
    }, 0);
  });

  constructor(
    private slaService: SlaService,
    private ticketService: TicketService
  ) {
    this.loadSlas();
  }

  // load SLA policies and related tickets from backend
  loadSlas(): void {
    this.loading.set(true);
    this.error.set("");

    forkJoin({
      slas: this.slaService.getSlas(),
      tickets: this.ticketService.getTickets(),
    }).subscribe({
      next: ({ slas, tickets }) => {
        this.slas.set(slas ?? []);
        this.tickets.set((tickets ?? []) as SlaTrackedTicket[]);
        this.loading.set(false);
      },
      error: () => {
        this.error.set("Failed to load SLA data.");
        this.loading.set(false);
      },
    });
  }

  // helper method to determine if a ticket is held successfully within its SLA
  private isTicketHeld(ticket: SlaTrackedTicket): boolean {
    const resolveHours = ticket.resolveHours;
    if (!resolveHours || resolveHours <= 0) return false;

    const createdMs = Date.parse(ticket.createdAt);
    if (Number.isNaN(createdMs)) return false;

    const isClosed = this.isClosedStatus(ticket.statusName);
    if (!isClosed) return false;

    const completionMs = this.getCompletionTimestamp(ticket);
    if (!completionMs) return false;

    const deadlineMs = createdMs + resolveHours * 60 * 60 * 1000;
    return completionMs <= deadlineMs;
  }

  // helper method to determine if a ticket has breached its SLA
  private isTicketBreached(ticket: SlaTrackedTicket): boolean {
    const resolveHours = ticket.resolveHours;
    if (!resolveHours || resolveHours <= 0) return false;

    const createdMs = Date.parse(ticket.createdAt);
    if (Number.isNaN(createdMs)) return false;

    const deadlineMs = createdMs + resolveHours * 60 * 60 * 1000;
    const isClosed = this.isClosedStatus(ticket.statusName);

    if (isClosed) {
      const completionMs = this.getCompletionTimestamp(ticket);
      return !!completionMs && completionMs > deadlineMs;
    }

    return Date.now() > deadlineMs;
  }

  // helper method to get the most relevant completion timestamp for a ticket (closedAt > updatedAt)
  private getCompletionTimestamp(ticket: SlaTrackedTicket): number | null {
    if (ticket.closedAt) {
      const closedMs = Date.parse(ticket.closedAt);
      if (!Number.isNaN(closedMs)) return closedMs;
    }

    if (ticket.updatedAt) {
      const updatedMs = Date.parse(ticket.updatedAt);
      if (!Number.isNaN(updatedMs)) return updatedMs;
    }

    return null;
  }

  // helper method to determine if a ticket's status indicates it is closed/resolved
  private isClosedStatus(statusName?: string | null): boolean {
    const status = (statusName || "").toLowerCase();
    return status === "resolved" || status === "closed";
  }
}