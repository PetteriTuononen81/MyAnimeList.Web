import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Topnavbar } from './layout/topnavbar/topnavbar';
import { Bottomnavbar } from './layout/bottomnavbar/bottomnavbar';
import { Sidebar } from './layout/sidebar/sidebar';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Topnavbar, Bottomnavbar, Sidebar, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  showTopNavbar: boolean = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Show top navbar only on library page
        this.showTopNavbar = event.url.includes('/library');
      });
  }
}
