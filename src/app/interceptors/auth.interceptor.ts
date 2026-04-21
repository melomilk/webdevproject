import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getAccessToken();

  const isAuthEndpoint = req.url.includes('/api/token/');

  // 🔍 DEBUG LOGGING — remove after we fix this
  console.log('[INTERCEPTOR]', {
    url: req.url,
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 20) + '...' : 'NULL',
    isAuthEndpoint,
    willAttach: !!(token && !isAuthEndpoint),
  });

  if (token && !isAuthEndpoint) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }

  return next(req);
};