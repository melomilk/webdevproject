import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-masters',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './masters.html',
  styleUrl: './masters.css',
})
export class Masters {masters = [
    {
      name: 'Aigerim',
      specialty: 'Hair Stylist',
      experience: 5,
      image: 'https://i.pravatar.cc/150?img=47'
    },
    {
      name: 'Dana',
      specialty: 'Nail Artist',
      experience: 3,
      image: 'https://i.pravatar.cc/150?img=32'
    },
    {
      name: 'Alina',
      specialty: 'Makeup Artist',
      experience: 7,
      image: 'https://i.pravatar.cc/150?img=5'
    },
    {
      name: 'Zhanar',
      specialty: 'Skin Care Specialist',
      experience: 4,
      image: 'https://i.pravatar.cc/150?img=12'
    }
  ];

  selectedMaster: any = null;

  selectMaster(master: any) {
    this.selectedMaster = master;
  }}
