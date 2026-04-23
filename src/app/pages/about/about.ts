import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements AfterViewInit {

  ngAfterViewInit() {
    const cards = document.querySelectorAll('.info-card');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    });

    cards.forEach(card => observer.observe(card));
  }
}