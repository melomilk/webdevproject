import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-masters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './masters.html',
  styleUrl: './masters.css',
})
export class Masters implements OnInit {

  masters = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  selectedMaster: any = null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getMasters().subscribe({
      next: (data) => {
        this.masters.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Failed to load masters');
        this.loading.set(false);
      }
    });
  }

  selectMaster(master: any) {
    this.selectedMaster = master;
  }
}


// export class Masters {masters = [
//     {
//       name: 'Aigerim',
//       specialty: 'Hair Stylist',
//       experience: 5,
//       image: 'https://i.pravatar.cc/150?img=47'
//     },
//     {
//       name: 'Dana',
//       specialty: 'Nail Artist',
//       experience: 3,
//       image: 'https://i.pravatar.cc/150?img=32'
//     },
//     {
//       name: 'Alina',
//       specialty: 'Makeup Artist',
//       experience: 7,
//       image: 'https://i.pravatar.cc/150?img=5'
//     },
//     {
//       name: 'Zhanar',
//       specialty: 'Skin Care Specialist',
//       experience: 4,
//       image: 'https://i.pravatar.cc/150?img=12'
//     }
//   ];