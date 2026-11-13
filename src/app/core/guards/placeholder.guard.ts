import { CanActivateFn } from '@angular/router';

export const placeholderGuard: CanActivateFn = () => {
  // Replace with an access check; return a UrlTree when redirecting.
  return true;
};
