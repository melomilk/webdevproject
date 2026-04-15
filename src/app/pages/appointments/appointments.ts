import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments.html',
  styleUrls: ['./appointments.css'],
})
export class Appointments {

  form = {
    name: '',
    phone: '',
    service: '',
    date: '',
    time: ''
  };

  success = false;
  error = false;

  submit() {
    // просто проверка (типо "отправили")
    if (
      this.form.name &&
      this.form.phone &&
      this.form.service &&
      this.form.date &&
      this.form.time
    ) {
      this.success = true;
      this.error = false;

      console.log('Данные формы:', this.form);

      // очистка формы
      this.form = {
        name: '',
        phone: '',
        service: '',
        date: '',
        time: ''
      };
    } else {
      this.error = true;
      this.success = false;
    }
  }
}