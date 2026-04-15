import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // 🔥 GET services
  getServices(): Observable<any> {
    return this.http.get(`${this.baseUrl}/services/`);
  }

  // 🔥 POST appointment
  bookAppointment(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/appointments/`, data);
  }

  // 🔥 LOGIN
  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login/`, data);
  }
}