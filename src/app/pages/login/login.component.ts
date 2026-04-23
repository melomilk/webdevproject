import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  form = {
    username: '',
    password: ''
  };

  success = false;
  error = false;

  constructor(private api: ApiService) {}

  login() {
    this.api.login(this.form).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.access);
        this.success = true;
        this.error = false;
      },
      error: () => {
        this.success = false;
        this.error = true;
      }
    });
  }
}

export class LoginComponent {

  form = {
    username: '',
    password: ''
  };

  login() {
    console.log(this.form); // пока просто проверка
  }
}