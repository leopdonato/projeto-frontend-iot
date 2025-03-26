import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  airQuality: number = 0;
  temperature: number = 0;

  ngOnInit(): void {
    this.generateRandomValues();
  }

  generateRandomValues(): void {
    setInterval(() => {
      this.airQuality = this.getRandomNumber(50, 100);
      this.temperature = this.getRandomNumber(20, 40);
    }, 700);
  }

  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
