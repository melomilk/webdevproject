import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {

  const router = new Router();
  const token = localStorage.getItem('token');

  if (token) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};