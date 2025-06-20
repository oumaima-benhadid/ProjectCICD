// src/app/guards/role.guard.ts
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data['expectedRole'] || route.data['expectedRoles'];
  const currentRole = auth.getRole();

  // autoriser si currentRole correspond à expectedRole ou est dans expectedRoles
  if (Array.isArray(expectedRoles)) {
    if (!expectedRoles.includes(currentRole)) {
      router.navigate(['/unauthorized']);
      return false;
    }
  } else {
    if (currentRole !== expectedRoles) {
      router.navigate(['/unauthorized']);
      return false;
    }
  }
  
  return true;
};
