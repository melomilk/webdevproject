import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export class Portfolio {

  selectedWork: any = null; // 👈 ВОТ ЭТО НУЖНО

  works = [
  {
    title: 'Bridal Makeup',
    image: '/work1.jpg',
    master: {
      id: 1,
      name: 'Anna',
      phone: '+7777000001',
      experience: 5,
      image: '/anna.jpg'
    }
  },
  {
    title: 'Hair Styling',
    image: '/work2.jpg',
    master: {
      id: 2,
      name: 'Mira',
      phone: '+7777000002',
      experience: 7,
      image: '/mira.jpg'
    }
  },
  {
    title: 'Nails Design',
    image: '/work3.jpg',
    master: {
      id: 3,
      name: 'Dana',
      phone: '+7777000003',
      experience: 4,
      image: '/dana.jpg'
    }
  },
  {
    title: 'Skincare Glow',
    image: '/work4.jpg',
    master: {
      id: 4,
      name: 'Lina',
      phone: '+7777000004',
      experience: 6,
      image: '/lina.jpg'
    }
  }
];

  openWork(work: any) {
  console.log('CLICKED WORK:', work);
  this.selectedWork = work;
  
}

  closePopup() {
    this.selectedWork = null;
  }
}

