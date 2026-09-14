import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    // Trigger animations after component loads
    setTimeout(() => {
      document.querySelector('.hero-content')?.classList.add('loaded');
    }, 100);

    setTimeout(() => {
      document.querySelectorAll('.feature-card').forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('loaded');
        }, index * 100); // Stagger each card by 100ms
      });
    }, 300);

    setTimeout(() => {
      document.querySelector('.cta-section')?.classList.add('loaded');
    }, 800);
  }

  navigateToLibrary() {
    this.router.navigate(['/library']);
  }
}
