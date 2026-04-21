import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Service } from '../../services/api';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services implements OnInit {
  services = signal<Service[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  selectedService: Service | null = null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getServices().subscribe({
      next: (data) => {
        this.services.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load services:', err);
        this.error.set('Could not load services. Try again later.');
        this.loading.set(false);
      }
    });
  }

  selectService(service: Service) {
    this.selectedService = service;
  }
}