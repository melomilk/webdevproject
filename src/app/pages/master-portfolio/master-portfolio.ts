import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Master, Booking } from '../../services/api';

@Component({
  selector: 'app-master-portfolio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './master-portfolio.html',
  styleUrl: './master-portfolio.css',
})
export class MasterPortfolio implements OnInit {
  private api = inject(ApiService);

  profile = signal<Master | null>(null);
  bookings = signal<Booking[]>([]);
  loading = signal(true);
  error = signal('');
  
  // Для режима редактирования
  editing = signal(false);
  editForm = {
    name: '',
    specialty: '',
    bio: '',
  };
  saveMessage = signal('');

  ngOnInit() {
    this.loadProfile();
    this.loadBookings();
  }

  loadProfile() {
    this.api.getMyMasterProfile().subscribe({
      next: (data) => {
        this.profile.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 403) {
          this.error.set('Access denied — masters only.');
        } else if (err.status === 404) {
          this.error.set('Your account is not linked to a master profile. Please contact admin.');
        } else {
          this.error.set('Failed to load profile.');
        }
        console.error('Profile load error:', err);
      },
    });
  }

  loadBookings() {
    this.api.getMyMasterBookings().subscribe({
      next: (data) => this.bookings.set(data),
      error: (err) => console.error('Bookings load error:', err),
    });
  }

  startEditing() {
    const p = this.profile();
    if (!p) return;
    this.editForm = {
      name: p.name,
      specialty: p.specialty,
      bio: p.bio || '',
    };
    this.editing.set(true);
    this.saveMessage.set('');
  }

  cancelEditing() {
    this.editing.set(false);
    this.saveMessage.set('');
  }

  saveProfile() {
    this.api.updateMyMasterProfile(this.editForm).subscribe({
      next: (updated) => {
        this.profile.set(updated);
        this.editing.set(false);
        this.saveMessage.set('Profile updated!');
        setTimeout(() => this.saveMessage.set(''), 3000);
      },
      error: (err) => {
        this.saveMessage.set('Failed to save.');
        console.error('Save error:', err);
      },
    });
  }
}