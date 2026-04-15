import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar';
import { ToastService } from './shared/toast';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar,LoadingSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  protected readonly title = signal('webdev-project');

  constructor(public toast: ToastService) {}

}