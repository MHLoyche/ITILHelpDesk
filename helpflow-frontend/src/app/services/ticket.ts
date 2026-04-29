import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TicketDetail {
  ticket_id: number;
  title: string;
  description: string;
  requesterName: string;
  requesterEmail: string;
  supporter_id: number | null;
  supporterName: string | null;
  statusName: string | null;
  priorityName: string | null;
  categoryName: string | null;
  sla_id: number | null;
  resolveHours: number | null;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  requesterName: string;
  priority_id: number;
  category_id?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private apiUrl = 'http://localhost:3000/api/tickets';

  constructor(private http: HttpClient) { }

  getTickets(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getTicketById(id: number): Observable<TicketDetail> {
    return this.http.get<TicketDetail>(`${this.apiUrl}/${id}`);
  }

  createTicket(payload: CreateTicketRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }
}