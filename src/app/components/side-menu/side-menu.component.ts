import { Component, EventEmitter, Output } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MobileMenuComponent } from '../mobile-menu/mobile-menu.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [RouterModule, MobileMenuComponent],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {
  isMobile: boolean = false;
  isSidebarOpen = true;
  @Output() logoutEvent = new EventEmitter<void>();

  constructor(private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver.observe(['(max-width: 767px)']).subscribe((result) => {
      this.isMobile = result.matches;
    });
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

  logout() {
    this.logoutEvent.emit();
  }
}
