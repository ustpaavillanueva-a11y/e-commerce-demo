import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products';
        this.loading = false;
        console.error(err);
      },
    });
  }

  viewProduct(id: number): void {
    this.router.navigate(['/home/product', id]);
  }

  addToCart(product: Product): void {
    try {
      if (typeof localStorage === 'undefined') {
        alert('Local storage is not available');
        return;
      }

      console.log('Adding to cart:', product);

      const cartData = localStorage.getItem('cart');
      const cart = cartData ? JSON.parse(cartData) : [];

      const existingItem = cart.find(
        (item: any) => item.ProductID === product.ProductID,
      );

      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      console.log('Cart updated in localStorage:', cart);

      // Calculate total amount
      const totalAmount = cart.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0,
      );

      // Update JSON server cart
      const serverCart = {
        id: 1,
        CartID: 1,
        UserID: 1,
        items: cart,
        totalAmount: totalAmount,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Sending to server:', serverCart);

      this.http.put('http://localhost:3000/carts/1', serverCart).subscribe({
        next: (response) => {
          console.log('Cart saved to server:', response);
          alert('Product added to cart!');
        },
        error: (err) => {
          console.error('Error saving to server:', err);
          alert('Product added to your local cart!');
        },
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding product to cart. Please try again.');
    }
  }
}
