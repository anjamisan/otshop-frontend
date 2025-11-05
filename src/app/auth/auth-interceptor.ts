import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './service/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authToken = authService.getAuthToken();

  //Ako postoji
  if (authToken) {
    const cloned = req.clone({
      // JWT standard format: "Bearer [token]"
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    return next(cloned);
  }

  //ako ne, saljem original
  return next(req);
};
