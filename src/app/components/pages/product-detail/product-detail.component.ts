import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  quantity = 1;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      this.loadProduct(id);
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load product';
        this.loading = false;
        console.error(err);
      },
    });
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) return;

    try {
      if (typeof localStorage === 'undefined') {
        alert('Local storage is not available');
        return;
      }

      console.log('Adding to cart:', this.product);

      const cartData = localStorage.getItem('cart');
      const cart = cartData ? JSON.parse(cartData) : [];

      const existingItem = cart.find(
        (item: any) => item.ProductID === this.product!.ProductID,
      );

      if (existingItem) {
        existingItem.quantity += this.quantity;
      } else {
        cart.push({ ...this.product, quantity: this.quantity });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      console.log('Cart updated:', cart);
      alert('Product added to cart!');
      this.quantity = 1;
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding product to cart. Please try again.');
    }
  }

  goBack(): void {
    this.router.navigate(['/home/products']);
  }
}
