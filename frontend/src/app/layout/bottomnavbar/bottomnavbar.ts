import { Component } from '@angular/core';
import { NavigationService } from '../../core/services/navigation.service';

@Component({
  selector: 'app-bottomnavbar',
  imports: [],
  templateUrl: './bottomnavbar.html',
  styleUrl: './bottomnavbar.css',
})
export class Bottomnavbar {
  constructor(public nav: NavigationService) {}
}
