import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderItem } from '../models';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/orders';
  private orderItemUrl = 'http://localhost:3000/orderItems';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  createOrder(order: Omit<Order, 'OrderID'>): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  updateOrder(id: number, order: Partial<Order>): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}`, order);
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getOrderItems(orderId: number): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(
      `${this.orderItemUrl}?orderID=${orderId}`,
    );
  }

  createOrderItem(item: Omit<OrderItem, 'OrderItemID'>): Observable<OrderItem> {
    return this.http.post<OrderItem>(this.orderItemUrl, item);
  }

  deleteOrderItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.orderItemUrl}/${id}`);
  }
}
