import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';

interface OrderWithItems {
  OrderID: number;
  userID: number;
  totalAmount: number;
  orderDate: string;
  status: string;
  id: string;
  items?: any[];
}

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss'],
})
export class AdminOrdersComponent implements OnInit {
  orders: OrderWithItems[] = [];
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
        this.orders = data.map(order => ({
          ...order,
          id: order.OrderID.toString()
        }));
        this.loading = false;
        console.log('Orders loaded:', this.orders);
      },
      error: (err) => {
        this.error = 'Failed to load orders';
        this.loading = false;
        console.error(err);
      },
    });
  }

  toggleExpand(orderId: number): void {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      processing: '#ff9800',
      shipped: '#2196f3',
      delivered: '#4caf50',
      cancelled: '#f44336',
    };
    return colors[status] || '#999';
  }

  updateOrderStatus(
    orderId: number,
    newStatus: string,
    orderIndex: number,
  ): void {
    if (!newStatus) return;

    this.orderService.updateOrder(orderId, { status: newStatus as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' }).subscribe({
      next: (response) => {
        console.log('Order updated:', response);
        // Update local array
        this.orders[orderIndex].status = newStatus;
        alert(`Order #${orderId} status updated to ${newStatus}`);
      },
      error: (err) => {
        console.error('Error updating order:', err);
        alert('Failed to update order status');
      },
    });
  }

  deleteOrder(orderId: number, orderIndex: number): void {
    if (!confirm(`Are you sure you want to delete Order #${orderId}?`)) {
      return;
    }

    this.orderService.deleteOrder(orderId).subscribe({
      next: () => {
        console.log('Order deleted:', orderId);
        this.orders.splice(orderIndex, 1);
        alert(`Order #${orderId} has been deleted`);
      },
      error: (err) => {
        console.error('Error deleting order:', err);
        alert('Failed to delete order');
      },
    });
  }
}
