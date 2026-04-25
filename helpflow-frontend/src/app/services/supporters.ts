import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface Supporter {
    supporter_id: number;
    name: string;
    email: string;
    phoneNumber: string;
}

@Injectable({
    providedIn: "root",
})
export class SupporterService {
  private apiUrl = "http://localhost:3000/api/supporters";

  constructor(private http: HttpClient) {}

  getSupporters(): Observable<Supporter[]> {
    return this.http.get<Supporter[]>(this.apiUrl);
  }
}