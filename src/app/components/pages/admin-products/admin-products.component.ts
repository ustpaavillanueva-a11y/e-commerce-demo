import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss'],
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  showForm = false;
  editingId: number | null = null;
  loading = true;
  error: string | null = null;

  formData: Partial<Product> = {
    name: '',
    description: '',
    imageUrl: '',
    stock: 0,
    price: 0,
  };

  constructor(private productService: ProductService) {}

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

  openForm(product?: Product): void {
    if (product) {
      this.editingId = product.ProductID;
      this.formData = { ...product };
    } else {
      this.editingId = null;
      this.formData = {
        name: '',
        description: '',
        imageUrl: '',
        stock: 0,
        price: 0,
      };
    }
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.formData = {};
  }

  saveProduct(): void {
    if (!this.formData.name || !this.formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    if (this.editingId) {
      // Update product - need to get the full product to find the JSON Server id
      const productToUpdate = this.products.find(
        (p) => p.ProductID === this.editingId,
      );
      if (!productToUpdate) {
        alert('Product not found');
        return;
      }

      // Use the 'id' field for JSON Server (or fall back to ProductID)
      const updateId = productToUpdate.id || this.editingId;

      this.productService.updateProduct(updateId, this.formData).subscribe({
        next: () => {
          alert('Product updated successfully');
          this.loadProducts();
          this.closeForm();
        },
        error: (err) => {
          alert('Failed to update product');
          console.error(err);
        },
      });
    } else {
      // Create product
      this.productService
        .createProduct(this.formData as Omit<Product, 'ProductID'>)
        .subscribe({
          next: () => {
            alert('Product created successfully');
            this.loadProducts();
            this.closeForm();
          },
          error: (err) => {
            alert('Failed to create product');
            console.error(err);
          },
        });
    }
  }

  deleteProduct(product: Product): void {
    if (!product || !product.name) {
      alert('Error: Invalid product');
      return;
    }

    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      // Use the 'id' field for JSON Server (or fall back to ProductID)
      const deleteId = product.id || product.ProductID;

      if (!deleteId) {
        alert('Error: Cannot determine product ID');
        return;
      }

      this.productService.deleteProduct(deleteId).subscribe({
        next: () => {
          alert('Product deleted successfully');
          this.loadProducts();
        },
        error: (err) => {
          alert('Failed to delete product');
          console.error(err);
        },
      });
    }
  }
}
