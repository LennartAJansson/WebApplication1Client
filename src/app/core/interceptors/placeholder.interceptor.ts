import { HttpInterceptorFn } from '@angular/common/http';

export const placeholderInterceptor: HttpInterceptorFn = (request, next) => {
  // Clone the request here to add headers, or pipe the response from next(request).
  return next(request);
};
