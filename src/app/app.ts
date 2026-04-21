import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { ToastService } from './shared/toast';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner';
import { ApiService } from './services/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, LoadingSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  protected readonly title = signal('webdev-project');
  connectionMessage = signal('Testing connection...');

  constructor(
    public toast: ToastService,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.api.hello().subscribe({
      next: (res) => {
        this.connectionMessage.set(res.message);
        console.log('✅ Connected to Django:', res);
      },
      error: (err) => {
        this.connectionMessage.set('❌ Connection failed — check console');
        console.error('Connection error:', err);
      }
    });
  }
}