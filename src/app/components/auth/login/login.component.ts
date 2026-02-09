import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email = '';
  password = '';
  error: string | null = null;
  loading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  login() {
    // Reset error
    this.error = null;

    // Validate inputs
    if (!this.email || !this.password) {
      this.error = 'Please enter both email and password';
      return;
    }

    this.loading = true;

    // Call auth service to validate credentials
    this.authService.login(this.email, this.password).subscribe({
      next: (result) => {
        this.loading = false;
        if (result && result.length > 0) {
          // Credentials are correct
          console.log('Login successful:', result);
          // Store user info in localStorage
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(result[0]));
            localStorage.setItem('isLoggedIn', 'true');
          }
          // Navigate to home
          this.router.navigate(['/home']);
        } else {
          // No matching credentials found
          this.error = 'Invalid email or password';
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Login error:', err);
        this.error = 'Login failed. Please try again.';
      },
    });
  }
}
