import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService, Service } from '../../services/api';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './appointments.html',
  styleUrls: ['./appointments.css'],
})
export class Appointments implements OnInit {
  private api = inject(ApiService);

  services = signal<Service[]>([]);

  form = {
    name: '',
    phone: '',
    service: '' as number | '',  // will hold service ID (number)
    date: '',
    time: '',
  };

  success = false;
  error = '';
  submitting = false;

  ngOnInit() {
    this.api.getServices().subscribe({
      next: (data) => this.services.set(data),
      error: (err) => console.error('Failed to load services:', err),
    });
  }

  submit() {
    this.error = '';
    this.success = false;

    // Basic validation
    if (
      !this.form.name ||
      !this.form.phone ||
      !this.form.service ||
      !this.form.date ||
      !this.form.time
    ) {
      this.error = 'Please fill in all fields.';
      return;
    }

    this.submitting = true;

    this.api.createBooking(this.form).subscribe({
      next: () => {
        this.success = true;
        this.submitting = false;
        // Reset form
        this.form = {
          name: '',
          phone: '',
          service: '',
          date: '',
          time: '',
        };
      },
      error: (err) => {
        this.submitting = false;
        this.error = 'Failed to create booking. Please try again.';
        console.error('Booking error:', err);
      },
    });
  }
}