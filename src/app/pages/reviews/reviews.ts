import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css',
})
export class Reviews implements OnInit {
  reviews = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private api: ApiService) {}

  ngOnInit() {
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
}