import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getAccessToken();

  // Don't attach token to login/refresh requests (they don't need it)
  const isAuthEndpoint = req.url.includes('/api/token/');

  if (token && !isAuthEndpoint) {
    // Clone the request and add the Authorization header
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }

  // No token or auth endpoint — send request unchanged
  return next(req);
};  