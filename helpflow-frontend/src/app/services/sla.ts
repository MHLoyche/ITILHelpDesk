import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface SlaPolicy {
  sla_id: number;
  serviceName: string;
  responseHours: number;
  resolveHours: number;
}

@Injectable({
  providedIn: "root",
})

export class SlaService {
  private apiUrl = "http://localhost:3000/api/slas";

  constructor(private http: HttpClient) {}

  getSlas(): Observable<SlaPolicy[]> {
  return this.http.get<SlaPolicy[]>(this.apiUrl);
  }
}