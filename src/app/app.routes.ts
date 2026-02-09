import { SettingsComponent } from './components/pages/settings/settings.component';
import { ReportsComponent } from './components/pages/reports/reports.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ProductsComponent } from './components/pages/products/products.component';
import { ProductDetailComponent } from './components/pages/product-detail/product-detail.component';
import { CartComponent } from './components/pages/cart/cart.component';
import { MyOrdersComponent } from './components/pages/my-orders/my-orders.component';
import { AdminProductsComponent } from './components/pages/admin-products/admin-products.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'product/:id', component: ProductDetailComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'cart', component: CartComponent },
      { path: 'my-orders', component: MyOrdersComponent },
      { path: 'admin-products', component: AdminProductsComponent },
    ],
  },
];
