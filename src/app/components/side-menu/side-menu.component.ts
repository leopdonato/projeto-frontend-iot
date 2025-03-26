import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {

  isSidebarOpen = true;

  constructor(private router: Router) {
    // Detecta mudanças de rota
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.triggerAnimation();
      }
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  triggerAnimation() {
    const renderContainer = document.getElementById('render-container');
    if (renderContainer) {
      renderContainer.classList.remove('fade-in');
      void renderContainer.offsetWidth;
      renderContainer.classList.add('fade-in');
    }
  }
}
