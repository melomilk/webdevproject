import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = '';
  password = '';
  error = '';

  login() {
    if (this.username === 'admin' && this.password === '123') {
      localStorage.setItem('token', 'fake-jwt-token');
      alert('Login success');
    } else {
      this.error = 'Wrong credentials';
    }
  }
}