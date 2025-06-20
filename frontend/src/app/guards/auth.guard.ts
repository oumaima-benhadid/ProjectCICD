// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    // 🧠 Sauvegarder la route actuelle pour redirection après login
    sessionStorage.setItem('redirectAfterLogin', state.url);
    router.navigate(['/login']);
    return false;
  }

  return true;
};
