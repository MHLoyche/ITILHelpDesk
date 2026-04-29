import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface CommentItem {
  comment_id: number;
  ticket_id: number;
  message: string;
  createdAt: string;
  authorName: string;
}

export interface CreateCommentRequest {
  ticket_id: number;
  message: string;
  authorName: string;
}

@Injectable({
  providedIn: "root",
})
export class CommentsService {
  private apiUrl = "http://localhost:3000/api/comments";

  constructor(private http: HttpClient) {}

  getComments(ticketId: number): Observable<CommentItem[]> {
    return this.http.get<CommentItem[]>(`${this.apiUrl}?ticket_id=${ticketId}`);
  }

  createComment(payload: CreateCommentRequest): Observable<CommentItem> {
    return this.http.post<CommentItem>(this.apiUrl, payload);
  }
}