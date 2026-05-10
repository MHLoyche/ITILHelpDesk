import { CommonModule } from "@angular/common";
import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { TicketDetail as TicketDetailModel, TicketService, UpdateTicketRequest } from "../../services/ticket";
import { CommentsService, CommentItem } from "../../services/comments";
import { ProfileRoleService } from "../../services/profile-role";
import { Supporter, SupporterService } from "../../services/supporters";

@Component({
  selector: "app-ticket-detail",
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: "./ticket-detail.html",
  styleUrl: "./ticket-detail.css",
})
export class TicketDetailComponent implements OnInit {
  private readonly commentsService = inject(CommentsService);
  private readonly profileRole = inject(ProfileRoleService);

  ticket = signal<TicketDetailModel | null>(null);
  comments = signal<CommentItem[]>([]);
  supporters = signal<Supporter[]>([]);
  newComment = signal("");
  savingComment = signal(false);
  commentError = signal<string | null>(null);
  editing = signal(false);
  savingEdit = signal(false);
  editError = signal<string | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  editForm = signal<UpdateTicketRequest>({
    title: "",
    description: "",
    supporter_id: null,
  });

  readonly role = this.profileRole.role;
  readonly isSupporter = computed(() => this.role() === "supporter");
  readonly currentAuthorName = computed(() => {
    return this.role() === "supporter" ? "Jonas" : "Anna Jensen";
  });

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private supporterService: SupporterService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));

    if (!id) {
      this.error.set("Invalid ticket id");
      this.loading.set(false);
      return;
    }

    this.ticketService.getTicketById(id).subscribe({
      next: (data) => {
        this.ticket.set(data);
        this.loadComments(id);
        this.loadSupporters();
        this.loading.set(false);
      },
      error: () => {
        this.error.set("Failed to load ticket");
        this.loading.set(false);
      },
    });
  }

  submitComment(): void {
    const ticket = this.ticket();
    const message = this.newComment().trim();

    if (!ticket) {
      this.commentError.set("Ticket is not loaded yet.");
      return;
    }

    if (!message) {
      this.commentError.set("Please enter a comment before submitting.");
      return;
    }

    this.savingComment.set(true);
    this.commentError.set(null);

    this.commentsService.createComment({
      ticket_id: ticket.ticket_id,
      message,
      authorName: this.currentAuthorName(),
    }).subscribe({
      next: (createdComment) => {
        this.comments.update((currentComments) => [...currentComments, createdComment]);
        this.newComment.set("");
        this.savingComment.set(false);
      },
      error: () => {
        this.commentError.set("Failed to save comment.");
        this.savingComment.set(false);
      },
    });
  }

  startEdit(): void {
    const current = this.ticket();
    if (!current) {
      return;
    }

    this.editForm.set({
      title: current.title ?? "",
      description: current.description ?? "",
      supporter_id: current.supporter_id ?? null,
    });
    this.editError.set(null);
    this.editing.set(true);
  }

  cancelEdit(): void {
    this.editing.set(false);
    this.editError.set(null);
  }

  updateEditField(field: "title" | "description", value: string): void {
    this.editForm.update((current) => ({
      ...current,
      [field]: value,
    }));
  }

  updateSupporterField(value: string): void {
    this.editForm.update((current) => ({
      ...current,
      supporter_id: value === "" ? null : Number(value),
    }));
  }

  saveEdit(): void {
    const current = this.ticket();
    if (!current) {
      return;
    }

    const payload: UpdateTicketRequest = {
      title: this.editForm().title.trim(),
      description: this.editForm().description.trim(),
      supporter_id: this.editForm().supporter_id ?? null,
    };

    if (!payload.title || !payload.description) {
      this.editError.set("Title and description are required.");
      return;
    }

    this.savingEdit.set(true);
    this.editError.set(null);

    this.ticketService.updateTicket(current.ticket_id, payload).subscribe({
      next: (updatedTicket) => {
        this.ticket.set(updatedTicket);
        this.editing.set(false);
        this.savingEdit.set(false);
      },
      error: () => {
        this.editError.set("Failed to update ticket.");
        this.savingEdit.set(false);
      },
    });
  }

  private loadComments(ticketId: number): void {
    this.commentsService.getComments(ticketId).subscribe({
      next: (data) => {
        this.comments.set(data ?? []);
      },
      error: () => {
        this.commentError.set("Failed to load comments.");
      },
    });
  }

  private loadSupporters(): void {
    this.supporterService.getSupporters().subscribe({
      next: (data) => {
        this.supporters.set(data ?? []);
      },
      error: () => {
        this.supporters.set([]);
      },
    });
  }
}
