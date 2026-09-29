import { HttpErrorResponse } from '@angular/common/http';

export type UserFacingErrorKind = 'timeout' | 'network' | 'not-found' | 'server' | 'unknown';

export interface UserFacingError {
  readonly kind: UserFacingErrorKind;
  readonly message: string;
}

export const SLOW_RESPONSE_NOTICE =
  'Está tardando más de lo habitual: el servidor puede estar arrancando tras un rato sin uso. ' +
  'La primera carga puede tardar hasta un minuto.';

const MESSAGES: Record<UserFacingErrorKind, string> = {
  timeout:
    'El servidor no ha respondido a tiempo. Puede que siga arrancando: vuelve a intentarlo en unos segundos.',
  network: 'No se ha podido conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.',
  'not-found': 'No hemos encontrado este producto.',
  server:
    'El servidor ha tenido un problema al procesar la petición. Inténtalo de nuevo en unos minutos.',
  unknown: 'Ha ocurrido un error inesperado. Inténtalo de nuevo.',
};

// La API de la prueba responde 500 (no 404) cuando el `id` de un producto no
// existe, así que ese caso concreto se trata como "no encontrado" solo en el
// contexto de detalle de producto.
export function toUserFacingError(
  error: unknown,
  context: 'list' | 'detail' | 'cart',
): UserFacingError {
  const kind = resolveKind(error, context);
  return { kind, message: MESSAGES[kind] };
}

function resolveKind(error: unknown, context: 'list' | 'detail' | 'cart'): UserFacingErrorKind {
  if (!(error instanceof HttpErrorResponse)) {
    return 'unknown';
  }

  // Al vencer el `timeout`, HttpClient aborta la petición y la envuelve con
  // status 0, igual que un fallo de red; solo el error original las distingue.
  if (error.error instanceof DOMException && error.error.name === 'TimeoutError') {
    return 'timeout';
  }

  if (error.status === 0) {
    return 'network';
  }

  if (error.status === 500 && context === 'detail') {
    return 'not-found';
  }

  if (error.status >= 500) {
    return 'server';
  }

  return 'unknown';
}
