import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-masters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './masters.html',
  styleUrls: ['./masters.css']
})
export class MastersComponent {

  masters = [
    {
      id: 1,
      name: 'Lina',
      role: 'Makeup Artist',
      rating: 4.9,
      bio: 'Soft glam & bridal specialist',
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: 2,
      name: 'Dana',
      role: 'Hair Stylist',
      rating: 4.8,
      bio: 'Luxury waves & modern styles',
      image: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    {
      id: 3,
      name: 'Aruzhan',
      role: 'Nail Master',
      rating: 4.7,
      bio: 'Clean & aesthetic nail art',
      image: 'https://randomuser.me/api/portraits/women/65.jpg'
    },
    {
      id: 4,
      name: 'Mira',
      role: 'Makeup Artist',
      rating: 4.9,
      bio: 'Evening glam & photoshoot looks',
      image: 'https://randomuser.me/api/portraits/women/12.jpg'
    },
    {
      id: 5,
      name: 'Amina',
      role: 'Stylist',
      rating: 4.6,
      bio: 'Natural beauty enhancement',
      image: 'https://randomuser.me/api/portraits/women/25.jpg'
    }
  ];

  openMaster(master: any) {
    console.log(master);
  }
}