import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SideMenuComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  constructor(
    private firebaseService: FirebaseService,
    private router: Router) {}

  onLogout() {
    this.firebaseService.logout().then(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    });
  }
}
