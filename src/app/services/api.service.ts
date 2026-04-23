import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login/`, data);
  }

  bookAppointment(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/appointments/`, data);
  }

  getReviews(): Observable<any> {
    return this.http.get(`${this.baseUrl}/reviews/`);
  }

  getPrices(): Observable<any> {
    return this.http.get(`${this.baseUrl}/prices/`);
  }
}