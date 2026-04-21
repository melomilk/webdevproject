import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  error = '';
  loading = false;

  login() {
    this.error = '';
    this.loading = true;

    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.loading = false;
        // Redirect based on role
        const role = this.auth.getRole();
        if (role === 'manager') {
          this.router.navigate(['/appointments']);
        } else if (role === 'master') {
          this.router.navigate(['/portfolio']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401) {
          this.error = 'Wrong username or password';
        } else if (err.status === 0) {
          this.error = 'Cannot reach server. Is Django running?';
        } else {
          this.error = 'Login failed. Please try again.';
        }
        console.error('Login error:', err);
      },
    });
  }
}