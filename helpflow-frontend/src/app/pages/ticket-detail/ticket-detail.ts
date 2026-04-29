import { CommonModule } from "@angular/common";
import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { TicketDetail as TicketDetailModel, TicketService } from "../../services/ticket";
import { CommentsService, CommentItem } from "../../services/comments";
import { ProfileRoleService } from "../../services/profile-role";

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
  newComment = signal("");
  savingComment = signal(false);
  commentError = signal<string | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  readonly role = this.profileRole.role;
  readonly currentAuthorName = computed(() => {
    return this.role() === "supporter" ? "Jonas" : "Anna Jensen";
  });

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService
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
}
