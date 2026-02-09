import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { Order, OrderItem } from '../../../models';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss'],
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];
  orderItems: { [key: number]: OrderItem[] } = {};
  loading = true;
  error: string | null = null;
  expandedOrderId: number | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loadOrderItems();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders';
        this.loading = false;
        console.error(err);
      },
    });
  }

  loadOrderItems(): void {
    this.orders.forEach((order) => {
      this.orderService.getOrderItems(order.OrderID).subscribe({
        next: (items) => {
          this.orderItems[order.OrderID] = items;
        },
        error: (err) => console.error(err),
      });
    });
  }

  toggleExpand(orderId: number): void {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return '#ffc107';
      case 'processing':
        return '#17a2b8';
      case 'shipped':
        return '#0275d8';
      case 'delivered':
        return '#28a745';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  }
}
