import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AddProductComponent } from './components/admin/add-product/add-product.component';
import { AddCategoryComponent } from './components/admin/add-category/add-category.component';
import { AdminViewProductsComponent } from './components/admin/admin-view-products/admin-view-products.component';
import { AdminProductDetailComponent } from './components/admin/admin-product-detail/admin-product-detail.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'home', component: HomeComponent },
    { path: 'admin', component: AdminDashboardComponent },
    { path: 'admin/add-product', component: AddProductComponent },
    { path: 'admin/add-category', component: AddCategoryComponent },
    { path: 'admin/products', component: AdminViewProductsComponent },
    { path: 'admin/product/:id', component: AdminProductDetailComponent },


];
