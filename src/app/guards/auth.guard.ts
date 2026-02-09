import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Check if user is logged in
    if (typeof localStorage !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const user = localStorage.getItem('user');

      if (isLoggedIn === 'true' && user) {
        // User is authenticated, allow access
        return true;
      }
    }

    // User is not authenticated, redirect to login
    this.router.navigate(['/login']);
    return false;
  }
}
