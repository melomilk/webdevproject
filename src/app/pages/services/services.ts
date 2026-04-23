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

  {

    name: 'Hair Styling',

    description: 'Modern cuts & styling',

    items: [

      'Classic Cut',

      'Wavy Styling',

      'Keratin Straightening',

      'Luxury Blowout'

    ]

  },

  {

    name: 'Makeup',

    description: 'Professional makeup services',

    items: [

      'Day Makeup',

      'Evening Glam',

      'Wedding Makeup'

    ]

  },

  {

    name: 'Nails Design',

    description: 'Manicure & nail art',

    items: [

      'Manicure',

      'Gel Design',

      'Luxury Nails'

    ]

  },

  {

    name: 'Skincare',

    description: 'Glow & skin treatments',

    items: [

      'Deep Cleansing',

      'Hydration Therapy',

      'Glow Facial'

    ]

  }

];

  selectedService: any = null;
  toggleService(service: any) {

  this.selectedService =

    this.selectedService === service ? null : service;

}
  selectService(service: any) {
    this.selectedService = service;
  }}

  