import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from '../../../directives/click-outside.directive';

@Component({
  selector: 'app-topbar',
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent implements OnInit {
  user: any = null;
  showDropdown = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    if (typeof localStorage !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          // Handle both old and new user data structure
          if (userData.login) {
            // New structure with login and profile
            this.user = {
              email: userData.login.email,
              LoginID: userData.login.LoginID,
              role: userData.profile?.role || 'user',
              firstName: userData.profile?.firstName || '',
              lastName: userData.profile?.lastName || '',
              fullData: userData,
            };
          } else {
            // Old structure
            this.user = userData;
          }
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown(): void {
    this.showDropdown = false;
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('cart');
    }
    this.showDropdown = false;
    this.router.navigate(['/login']);
  }
}
