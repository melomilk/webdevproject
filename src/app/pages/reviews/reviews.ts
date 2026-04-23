import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css',
})
export class Reviews implements OnInit {
  reviews = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  newReview = {
    name: '',
    text: '',
    rating: 5
  };

  constructor(private api: ApiService, public auth: AuthService) {}

  ngOnInit() {
    this.newReview.name = this.auth.currentUser()?.username || '';
    console.log('reviews init'); // 👈 should appear now

    this.api.getReviews().subscribe({
      next: (data) => {
        console.log('REVIEWS:', data);
        this.reviews.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load reviews:', err);
        this.error.set('Could not load reviews.');
        this.loading.set(false);
      }
    });
  }

  submitReview() {
    const payload = {
      ...this.newReview,
      name: this.auth.currentUser()?.username || this.newReview.name
    };
    // console.log('CLICK WORKS'); // 👈 add this
    this.api.addReview(payload).subscribe({
      next: (res: any) => {
        // Add new review to list instantly
        this.reviews.set([res, ...this.reviews()]);
        
        // Reset form
        this.newReview = { name: '', text: '', rating: 5 };
      },
      error: (err) => {
        console.error('Failed to add review', err);
      }
    });
  }
}