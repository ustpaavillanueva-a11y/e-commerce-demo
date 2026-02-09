import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/logins';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<Login[]> {
    return this.http.get<Login[]>(
      `${this.apiUrl}?email=${email}&password=${password}`,
    );
  }

  register(login: Omit<Login, 'LoginID'>): Observable<Login> {
    return this.http.post<Login>(this.apiUrl, login);
  }

  getLogins(): Observable<Login[]> {
    return this.http.get<Login[]>(this.apiUrl);
  }
}
