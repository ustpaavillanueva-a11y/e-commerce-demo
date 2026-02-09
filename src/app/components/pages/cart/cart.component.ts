import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../../models';
import { CartService, CartItem } from '../../../services/cart.service';
import { OrderService } from '../../../services/order.service';

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
    private http: HttpClient,
    private orderService: OrderService,
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

    // Save to JSON Server
    const totalAmount = this.cartItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0,
    );

    const serverCart = {
      id: 1,
      CartID: 1,
      UserID: 1,
      items: this.cartItems,
      totalAmount: totalAmount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.http.put('http://localhost:3000/carts/1', serverCart).subscribe({
      next: (response) => {
        console.log('Cart saved to server:', response);
      },
      error: (err) => {
        console.error('Error saving cart to server:', err);
      },
    });
  }

  checkout(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Calculate total amount
    const totalAmount = this.cartItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0,
    );

    // Get all orders to determine the next OrderID
    this.orderService.getOrders().subscribe({
      next: (orders: any[]) => {
        const maxOrderID =
          orders.length > 0 ? Math.max(...orders.map((o) => o.OrderID)) : 0;
        const newOrderID = maxOrderID + 1;

        // Create new order
        const newOrder = {
          OrderID: newOrderID,
          userID: 1, // Using default user ID 1
          totalAmount: totalAmount,
          orderDate: new Date().toISOString(),
          status: 'processing' as const,
        };

        // Post the order first
        this.orderService.createOrder(newOrder).subscribe({
          next: (createdOrder: any) => {
            console.log('Order created:', createdOrder);

            // Now create order items for each cart item
            let itemsCreated = 0;
            this.cartItems.forEach((item: any, index) => {
              const orderItem = {
                orderID: newOrderID,
                productID: item.ProductID,
                quantity: item.quantity,
                price: item.price,
              };

              this.orderService.createOrderItem(orderItem).subscribe({
                next: (createdItem: any) => {
                  console.log('Order item created:', createdItem);
                  itemsCreated++;

                  // When all items are created, clear cart and navigate
                  if (itemsCreated === this.cartItems.length) {
                    this.clearCartForCheckout();
                    this.router.navigate(['/home/my-orders']);
                    alert('Checkout successful! Your order has been placed.');
                  }
                },
                error: (err) => {
                  console.error('Error creating order item:', err);
                  alert('Error processing some items, but order was created!');
                },
              });
            });
          },
          error: (err) => {
            console.error('Error creating order:', err);
            alert('Error processing checkout. Please try again.');
          },
        });
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
        alert('Error processing checkout. Please try again.');
      },
    });
  }

  private clearCartForCheckout(): void {
    this.cartItems = [];
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('cart');
    }

    // Clear the cart on the server too
    const emptyCart = {
      id: 1,
      CartID: 1,
      UserID: 1,
      items: [],
      totalAmount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.http.put('http://localhost:3000/carts/1', emptyCart).subscribe({
      next: () => {
        console.log('Cart cleared on server');
      },
      error: (err) => {
        console.error('Error clearing cart on server:', err);
      },
    });
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }
}
