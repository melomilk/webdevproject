import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services {services = [
    { name: 'Haircut', description: 'Professional haircut', price: 5000 },
    { name: 'Manicure', description: 'Nail care & design', price: 7000 },
    { name: 'Makeup', description: 'Evening makeup', price: 12000 },
    { name: 'Facial', description: 'Skin treatment', price: 9000 },
  ];

  selectedService: any = null;

  selectService(service: any) {
    this.selectedService = service;
  }}

  