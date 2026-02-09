import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CartItem {
  ProductID: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Cart {
  CartID: number;
  UserID: number;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:3000/carts';

  constructor(private http: HttpClient) {}

  getCarts(): Observable<Cart[]> {
    return this.http.get<Cart[]>(this.apiUrl);
  }

  getCartByUserId(userId: number): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.apiUrl}?UserID=${userId}`);
  }

  getCart(cartId: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/${cartId}`);
  }

  createCart(cart: Cart): Observable<Cart> {
    return this.http.post<Cart>(this.apiUrl, cart);
  }

  updateCart(cartId: number, cart: Cart): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/${cartId}`, cart);
  }

  deleteCart(cartId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${cartId}`);
  }
}
