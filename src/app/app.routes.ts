import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AddProductComponent } from './components/admin/add-product/add-product.component';
import { AddCategoryComponent } from './components/admin/add-category/add-category.component';
import { AdminViewProductsComponent } from './components/admin/admin-view-products/admin-view-products.component';
import { AdminProductDetailComponent } from './components/admin/admin-product-detail/admin-product-detail.component';
import { EditProductComponent } from './components/admin/edit-product/edit-product.component';
import { UserListComponent } from './components/admin/user-list/user-list.component';
import { UserDetailsComponent } from './components/admin/user-details/user-details.component';
import { ViewProductComponent } from './components/view-product/view-product.component';
import { MyPurchasesComponent } from './components/my-purchases/my-purchases.component';
import { MyFavouritesComponent } from './components/my-favourites/my-favourites.component';
import { AuthGuard } from './auth/auth-guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'home', component: HomeComponent },
    { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard] },
    { path: 'admin/add-product', component: AddProductComponent, canActivate: [AuthGuard] },
    { path: 'admin/add-category', component: AddCategoryComponent, canActivate: [AuthGuard] },
    { path: 'admin/products', component: AdminViewProductsComponent, canActivate: [AuthGuard] },
    { path: 'admin/product/:id', component: AdminProductDetailComponent, canActivate: [AuthGuard] },
    { path: 'admin/product/:id/edit', component: EditProductComponent, canActivate: [AuthGuard] },
    { path: 'admin/users', component: UserListComponent, canActivate: [AuthGuard] },
    { path: 'admin/users/:id', component: UserDetailsComponent, canActivate: [AuthGuard] },
    { path: 'products/:id', component: ViewProductComponent, canActivate: [AuthGuard] }, //parametar rute je id
    { path: 'my-purchases', component: MyPurchasesComponent, canActivate: [AuthGuard] },
    { path: 'my-favourites', component: MyFavouritesComponent, canActivate: [AuthGuard] },
    { path: '', component: HomeComponent }, //default ruta
    { path: '**', redirectTo: '' }, //wildcard ruta
];
