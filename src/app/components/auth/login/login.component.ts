import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
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
    private userService: UserService,
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
      next: (loginResult) => {
        if (loginResult && loginResult.length > 0) {
          // Credentials are correct
          const loginData = loginResult[0];
          const loginID = loginData.LoginID;

          // Fetch user profile based on LoginID
          this.userService.getUserByLoginID(loginID).subscribe({
            next: (userResult) => {
                this.loading = false;
                const userProfile =
                  userResult && userResult.length > 0 ? userResult[0] : null;

                // Display login information in console
                console.clear();
                console.log(
                  '%c✅ LOGIN SUCCESSFUL',
                  'color: green; font-size: 16px; font-weight: bold;',
                );

                // Display Login Credentials
                console.log(
                  '%cLogin Credentials:',
                  'color: orange; font-size: 14px; font-weight: bold;',
                );
                console.table({
                  Email: this.email,
                  Password: this.password,
                });

                // Display Login Data from Database
                console.log(
                  '%cLogin Data (from database):',
                  'color: #FF6B6B; font-size: 14px; font-weight: bold;',
                );
                console.table({
                  'Login ID': loginData.LoginID,
                  Email: loginData.email,
                  Password: loginData.password,
                  'Created At': loginData.createdAt,
                });

                // Display User Profile
                if (userProfile) {
                  console.log(
                    '%cUser Profile:',
                    'color: #4ECDC4; font-size: 14px; font-weight: bold;',
                  );
                  console.table({
                    'User ID': userProfile.UserID,
                    'Login ID': userProfile.LoginID,
                    'First Name': userProfile.firstName,
                    'Last Name': userProfile.lastName,
                    'Middle Name': userProfile.middleName || 'N/A',
                    'Contact Number': userProfile.contactNumber,
                    Address: userProfile.address,
                    Role: userProfile.role,
                    'Created At': userProfile.createdAt,
                  });
                }

                // Display Full Objects
                console.log(
                  '%cFull Login Object:',
                  'color: #9B59B6; font-weight: bold;',
                );
                console.log(loginData);

                if (userProfile) {
                  console.log(
                    '%cFull User Object:',
                    'color: #3498DB; font-weight: bold;',
                  );
                  console.log(userProfile);
                }

                // Store combined data in localStorage
                const combinedData = {
                  login: loginData,
                  profile: userProfile,
                };

                if (typeof localStorage !== 'undefined') {
                  localStorage.setItem(
                    'user',
                    JSON.stringify(combinedData)
                  );
                  localStorage.setItem('isLoggedIn', 'true');
                }

                // Navigate to home
                this.router.navigate(['/home']);
              },
              error: (err) => {
                this.loading = false;
                console.error('Error fetching user profile:', err);
                // Still allow login even if profile fetch fails
                if (typeof localStorage !== 'undefined') {
                  localStorage.setItem(
                    'user',
                    JSON.stringify({ login: loginData, profile: null })
                  );
                  localStorage.setItem('isLoggedIn', 'true');
                }
                this.router.navigate(['/home']);
              },
            });
        } else {
          // No matching credentials found
          this.loading = false;
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
