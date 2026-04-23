import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 🔥 ДОБАВИТЬ
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule], // 🔥 ВАЖНО ДОБАВИТЬ СЮДА
  templateUrl: './reviews.html',
  styleUrls: ['./reviews.css'],
})
export class Reviews implements OnInit {

  reviews = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  showForm = false;

  newReview = {
    name: '',
    text: '',
    rating: 5
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.reviews.set([
  {
    id: 1,
    name: 'Anna',
    rating: 5,
    text: 'Amazing service! I absolutely loved the result 💕 The stylist really understood what I wanted and made my hair look even better than I expected. The atmosphere in the salon was super relaxing and comfortable. I will definitely come back again for my next appointment!'
  },
  {
    id: 2,
    name: 'Mira',
    rating: 4,
    text: 'Very professional and clean work! The makeup artist paid attention to every small detail and made sure everything looked perfect under different lighting. I received so many compliments at the event. Highly recommend this place for special occasions.'
  },
  {
    id: 3,
    name: 'Dana',
    rating: 5,
    text: 'Best beauty salon in the city ✨ I tried their full package: hair styling, manicure, and makeup. Everything was done with such care and precision. The staff is very friendly and makes you feel comfortable from the moment you walk in.'
  },
  {
    id: 4,
    name: 'Lina',
    rating: 5,
    text: 'Super friendly staff and great experience overall. I was a bit nervous at first, but they guided me through everything and suggested styles that actually suited my face shape. The result was stunning and long-lasting!'
  },
  {
    id: 5,
    name: 'Aruzhan',
    rating: 5,
    text: 'I booked bridal makeup and it was honestly perfect. The makeup stayed fresh the whole day, even after dancing and photos. They really know how to highlight natural beauty without overdoing it. I felt confident and beautiful.'
  },
  {
    id: 6,
    name: 'Sabina',
    rating: 4,
    text: 'Great experience with hair coloring and styling. The color turned out exactly as I wanted and the stylist explained every step clearly. The salon has a modern vibe and everything is very clean and organized.'
  }
]);

    this.loading.set(false);
  }

  addReview() {
    const review = {
      id: Date.now(),
      ...this.newReview
    };

    this.reviews.set([review, ...this.reviews()]);

    this.newReview = {
      name: '',
      text: '',
      rating: 5
    };

    this.showForm = false;
  }
}