import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidenav',
  imports: [RouterLink, CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit {
  userRole: string = '';

  ngOnInit(): void {
    this.loadUserRole();
  }

  loadUserRole(): void {
    if (typeof localStorage !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          // Check if it's the new format with profile or old format
          if (userData.profile && userData.profile.role) {
            this.userRole = userData.profile.role;
          } else if (userData.role) {
            this.userRole = userData.role;
          }
          console.log('User Role:', this.userRole);
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    }
  }

  isAdmin(): boolean {
    return this.userRole === 'admin';
  }

  isCustomerOrUser(): boolean {
    return this.userRole === 'customer' || this.userRole === 'user';
  }
}
