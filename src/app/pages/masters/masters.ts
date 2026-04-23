import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-masters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './masters.html',
  styleUrl: './masters.css',
})
export class Masters implements OnInit {

  master: any = null;

  masters = [
    {
      id: 1,
      name: 'Anna',
      image: '/anna.jpg',
      phone: '+7777000001',
      experience: 5,
      specialty: 'Hair Styling'
    },
    {
      id: 2,
      name: 'Mira',
      image: '/mira.jpg',
      phone: '+7777000002',
      experience: 7,
      specialty: 'Makeup'
    },
    {
      id: 3,
      name: 'Dana',
      image: '/dana.jpg',
      phone: '+7777000003',
      experience: 4,
      specialty: 'Nails'
    },
    {
      id: 4,
      name: 'Lina',
      image: '/lina.jpg',
      phone: '+7777000004',
      experience: 6,
      specialty: 'Skincare'
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.master = this.masters.find(m => m.id === id);
  }
}