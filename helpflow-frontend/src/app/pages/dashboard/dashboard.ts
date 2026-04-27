import { CommonModule } from "@angular/common";
import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { forkJoin } from "rxjs";
import { Article, ArticleService } from "../../services/articles";
import { ProfileRoleService } from "../../services/profile-role";
import { SlaPolicy, SlaService } from "../../services/sla";
import { TicketService } from "../../services/ticket";

interface DashboardTicket {
  ticket_id: number;
  title: string;
  requesterName?: string | null;
  requesterEmail?: string | null;
  supporter_id?: number | null;
  supporterName?: string | null;
  statusName?: string | null;
  priorityName?: string | null;
  categoryName?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  closedAt?: string | null;
  resolveHours?: number | null;
}

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./dashboard.html",
  styleUrl: "./dashboard.css",
})
export class Dashboard implements OnInit {
  private readonly currentSupporterId = 1;
  private readonly currentRequester = {
    name: "Anna Jensen",
    email: "anna.jensen@company.local",
  };

  private readonly ticketService = inject(TicketService);
  private readonly articleService = inject(ArticleService);
  private readonly slaService = inject(SlaService);
  private readonly profileRole = inject(ProfileRoleService);

  readonly role = this.profileRole.role;
  readonly isSupporter = computed(() => this.role() === "supporter");

  readonly tickets = signal<DashboardTicket[]>([]);
  readonly articles = signal<Article[]>([]);
  readonly slas = signal<SlaPolicy[]>([]);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly supporterTickets = computed(() => {
    return this.tickets().filter((ticket) => this.matchesCurrentSupporter(ticket));
  });

  readonly userTickets = computed(() => {
    return this.tickets().filter((ticket) => this.matchesCurrentRequester(ticket));
  });

  readonly assignedTicketsCount = computed(() => {
    return this.supporterTickets().length;
  });

  readonly unassignedTicketsCount = computed(() => {
    return this.tickets().filter((ticket) => this.isUnassignedTicket(ticket)).length;
  });

  readonly heldSlaCount = computed(() => {
    return this.tickets().reduce((count, ticket) => {
      return this.isTicketHeld(ticket) ? count + 1 : count;
    }, 0);
  });

  readonly breachedSlaCount = computed(() => {
    return this.tickets().reduce((count, ticket) => {
      return this.isTicketBreached(ticket) ? count + 1 : count;
    }, 0);
  });

  readonly escalatedAndCriticalTickets = computed(() => {
    return this.tickets()
      .filter((ticket) => this.isEscalatedOrCritical(ticket))
      .sort((a, b) => this.getUrgencySortValue(b) - this.getUrgencySortValue(a))
      .slice(0, 8);
  });

  readonly myTickets = computed(() => {
    return this.tickets()
      .filter((ticket) => this.isMyTicket(ticket))
      .sort((a, b) => this.getTimestampValue(b.updatedAt || b.createdAt) - this.getTimestampValue(a.updatedAt || a.createdAt))
      .slice(0, 8);
  });

  readonly activeTicketsCount = computed(() => {
    return this.userTickets().filter((ticket) => this.isActiveStatus(ticket.statusName)).length;
  });

  readonly resolvedTicketsCount = computed(() => {
    return this.userTickets().filter((ticket) => this.isClosedStatus(ticket.statusName)).length;
  });

  readonly recentArticles = computed(() => {
    return [...this.articles()]
      .sort((a, b) => this.getTimestampValue(b.updatedAt) - this.getTimestampValue(a.updatedAt))
      .slice(0, 5);
  });

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      tickets: this.ticketService.getTickets(),
      articles: this.articleService.getArticles(),
      slas: this.slaService.getSlas(),
    }).subscribe({
      next: ({ tickets, articles, slas }) => {
        this.tickets.set((tickets ?? []) as DashboardTicket[]);
        this.articles.set((articles ?? []) as Article[]);
        this.slas.set(slas ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set("Failed to load dashboard data.");
        this.loading.set(false);
      },
    });
  }

  getStatusClass(statusName?: string | null): string {
    const status = (statusName || "").toLowerCase().trim();

    if (status === "escalated") return "badge-status-escalated";
    if (status === "open") return "badge-status-open";
    if (status === "in progress") return "badge-status-in-progress";
    if (status === "resolved") return "badge-status-resolved";
    if (status === "closed") return "badge-status-closed";

    return "badge-unknown";
  }

  getPriorityClass(priorityName?: string | null): string {
    const priority = (priorityName || "").toLowerCase().trim();

    if (priority === "critical") return "badge-priority-critical";
    if (priority === "high") return "badge-priority-high";
    if (priority === "medium") return "badge-priority-medium";
    if (priority === "low") return "badge-priority-low";

    return "badge-unknown";
  }

  private isEscalatedOrCritical(ticket: DashboardTicket): boolean {
    const status = (ticket.statusName || "").toLowerCase();
    const priority = (ticket.priorityName || "").toLowerCase();
    return status === "escalated" || priority === "critical";
  }

  private isUnassignedTicket(ticket: DashboardTicket): boolean {
    const supporterId = Number(ticket.supporter_id);
    const supporterName = (ticket.supporterName || "").toLowerCase().trim();

    return !supporterId || supporterName === "unassigned";
  }

  private isMyTicket(ticket: DashboardTicket): boolean {
    if (this.isSupporter()) {
      return this.matchesCurrentSupporter(ticket);
    }

    return this.matchesCurrentRequester(ticket);
  }

  private matchesCurrentSupporter(ticket: DashboardTicket): boolean {
    return Number(ticket.supporter_id) === this.currentSupporterId;
  }

  private matchesCurrentRequester(ticket: DashboardTicket): boolean {
    const requesterName = (ticket.requesterName || "").toLowerCase().trim();
    const requesterEmail = (ticket.requesterEmail || "").toLowerCase().trim();

    return (
      requesterName === this.currentRequester.name.toLowerCase() ||
      requesterEmail === this.currentRequester.email.toLowerCase()
    );
  }

  private getUrgencySortValue(ticket: DashboardTicket): number {
    const priority = (ticket.priorityName || "").toLowerCase();
    const status = (ticket.statusName || "").toLowerCase();
    const updatedAtScore = this.getTimestampValue(ticket.updatedAt || ticket.createdAt);

    let urgencyScore = 0;
    if (priority === "critical") urgencyScore += 2000000000000;
    if (status === "escalated") urgencyScore += 1000000000000;

    return urgencyScore + updatedAtScore;
  }

  private isTicketHeld(ticket: DashboardTicket): boolean {
    const resolveHours = ticket.resolveHours;
    if (!resolveHours || resolveHours <= 0) return false;

    const createdMs = this.getTimestampValue(ticket.createdAt);
    if (!createdMs) return false;

    if (!this.isClosedStatus(ticket.statusName)) return false;

    const completionMs = this.getCompletionTimestamp(ticket);
    if (!completionMs) return false;

    const deadlineMs = createdMs + resolveHours * 60 * 60 * 1000;
    return completionMs <= deadlineMs;
  }

  private isTicketBreached(ticket: DashboardTicket): boolean {
    const resolveHours = ticket.resolveHours;
    if (!resolveHours || resolveHours <= 0) return false;

    const createdMs = this.getTimestampValue(ticket.createdAt);
    if (!createdMs) return false;

    const deadlineMs = createdMs + resolveHours * 60 * 60 * 1000;

    if (this.isClosedStatus(ticket.statusName)) {
      const completionMs = this.getCompletionTimestamp(ticket);
      return !!completionMs && completionMs > deadlineMs;
    }

    return Date.now() > deadlineMs;
  }

  private getCompletionTimestamp(ticket: DashboardTicket): number {
    const closedMs = this.getTimestampValue(ticket.closedAt);
    if (closedMs) return closedMs;

    return this.getTimestampValue(ticket.updatedAt);
  }

  private getTimestampValue(value?: string | null): number {
    if (!value) return 0;
    const timestamp = Date.parse(value);
    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  private isClosedStatus(statusName?: string | null): boolean {
    const status = (statusName || "").toLowerCase();
    return status === "resolved" || status === "closed";
  }

  private isActiveStatus(statusName?: string | null): boolean {
    const status = (statusName || "").toLowerCase();
    return status === "open" || status === "in progress" || status === "pending" || status === "escalated";
  }
}
