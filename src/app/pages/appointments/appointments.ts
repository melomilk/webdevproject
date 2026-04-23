import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

  services = signal<Service[]>([]);

  form = {
    name: '',
    phone: '',
    service: '' as number | '',  // will hold service ID (number)
    date: '',
    time: '',
  };

  success = false;
  error: string | null = null;
  submitting = false;

  ngOnInit() {
    this.api.getServices().subscribe({
      next: (data) => this.services.set(data),
      error: (err) => console.error('Failed to load services:', err),
    });
  }

  submit() {
    if (this.submitting) return; // prevents double submit
    console.log('SUBMIT CALLED');
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
      next: (res) => {
        console.log('NEXT FIRED:', res);
        this.success = true;
        this.submitting = false;   // ✅ MUST BE FIRST
        this.cdr.detectChanges();
        console.log('SUCCESS SET TO TRUE:', this.success);
        console.log('FINAL STATE', {
          submitting: this.submitting,
          success: this.success,
          error: this.error
        });
        this.submitting = false;
        // Reset form
        setTimeout(() => {
        this.form = {
          name: '',
          phone: '',
          service: '',
          date: '',
          time: '',
        };
      });
      },
      error: (err) => {
        console.log('ERROR FIRED:', err);
        this.submitting = false;
        this.success = false;
        // this.error =
        // err.error?.non_field_errors?.[0] ||
        // err.error?.detail ||
        // JSON.stringify(err.error) ||
        // 'Failed to create booking. Please try again.';
        this.error = Object.values(err.error).flat()[0] as string;
        console.error('Booking error:', err);
        this.cdr.detectChanges();
      },
    });
  }
}