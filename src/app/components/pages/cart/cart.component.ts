import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Product } from '../../../models';
import { CartService, CartItem } from '../../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalAmount = 0;
  loading = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    // Load from localStorage first if available
    const localCart =
      typeof localStorage !== 'undefined' ? localStorage.getItem('cart') : null;
    if (localCart) {
      this.cartItems = JSON.parse(localCart);
      this.calculateTotal();
    }

    // Fetch all carts and get the first one
    this.cartService.getCarts().subscribe({
      next: (carts) => {
        if (carts && carts.length > 0) {
          this.cartItems = carts[0].items;
          this.calculateTotal();
        }
        this.loading = false;
      },
      error: (err) => {
        // If server fails, keep using localStorage data
        this.loading = false;
        if (this.cartItems.length === 0) {
          this.error = 'Failed to load cart from server';
        }
        console.error('Error loading cart:', err);
      },
    });
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((sum, item) => {
      return sum + (item.price || 0) * item.quantity;
    }, 0);
  }

  updateQuantity(item: CartItem): void {
    if (item.quantity < 1) {
      item.quantity = 1;
    }
    this.saveCart();
    this.calculateTotal();
  }

  removeItem(productId: number): void {
    this.cartItems = this.cartItems.filter(
      (item) => item.ProductID !== productId,
    );
    this.saveCart();
    this.calculateTotal();
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear the cart?')) {
      this.cartItems = [];
      this.saveCart();
      this.calculateTotal();
    }
  }

  saveCart(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    }
  }

  checkout(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    // TODO: Implement checkout process
    alert('Proceeding to checkout...');
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}
