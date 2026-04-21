import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

// Just requires being logged in (any role)
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};

// Requires being a manager
export const managerGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }
  
  if (auth.isManager()) {
    return true;
  }
  
  // Logged in but not a manager — send them home
  router.navigate(['/']);
  return false;
};

// Requires being a master
export const masterGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }
  
  if (auth.isMaster()) {
    return true;
  }
  
  // Logged in but not a master — send them home
  router.navigate(['/']);
  return false;
};