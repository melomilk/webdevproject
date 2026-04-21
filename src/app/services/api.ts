import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Service {
  id: number;
  name: string;
  category: string;
  price: string;
  description: string;
}

export interface Booking {
  id: number;
  name: string;
  phone: string;
  service: number;
  master?: number | null;
  date: string;
  time: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // PUBLIC ENDPOINTS (anyone can call)
  
  hello(): Observable<any> {
    return this.http.get(`${this.baseUrl}/hello/`);
  }

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.baseUrl}/services/`);
  }

  getMasters(): Observable<any> {
    return this.http.get(`${this.baseUrl}/masters/`);
  }

  // Customer creates a booking (no login needed)
  createBooking(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/bookings/`, data);
  }

  // MANAGER-ONLY ENDPOINTS (interceptor auto-attaches JWT)

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/bookings/`);
  }

  deleteBooking(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/bookings/${id}/`);
  }
}