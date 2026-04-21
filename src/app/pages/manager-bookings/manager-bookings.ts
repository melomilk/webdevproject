import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Booking } from '../../services/api';

@Component({
  selector: 'app-manager-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manager-bookings.html',
  styleUrl: './manager-bookings.css',
})
export class ManagerBookings implements OnInit {
  private api = inject(ApiService);

  bookings = signal<Booking[]>([]);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading.set(true);
    this.error.set('');

    this.api.getBookings().subscribe({
      next: (data) => {
        this.bookings.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 403) {
          this.error.set('Access denied — managers only.');
        } else if (err.status === 401) {
          this.error.set('You must be logged in.');
        } else {
          this.error.set('Failed to load bookings.');
        }
        console.error('Booking load error:', err);
      },
    });
  }

  deleteBooking(id: number) {
    if (!confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    this.api.deleteBooking(id).subscribe({
      next: () => {
        this.bookings.update((current) => current.filter((b) => b.id !== id));
      },
      error: (err) => {
        alert('Failed to delete booking.');
        console.error('Delete error:', err);
      },
    });
  }
}