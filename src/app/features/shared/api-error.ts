import { HttpErrorResponse } from '@angular/common/http';

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (typeof error.error === 'string' && error.error.trim()) {
      return error.error;
    }

    if (typeof error.error?.message === 'string') {
      return error.error.message;
    }

    return `Begäran misslyckades (${error.status || 'nätverksfel'}). Kontrollera API-anslutningen och försök igen.`;
  }

  return 'Ett oväntat fel inträffade. Försök igen.';
}
