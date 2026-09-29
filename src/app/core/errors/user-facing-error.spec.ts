import { HttpErrorResponse } from '@angular/common/http';
import { describe, expect, it } from 'vitest';
import { toUserFacingError } from './user-facing-error';

describe('toUserFacingError', () => {
  it('should classify status 0 (no connection) as a network error', () => {
    const error = new HttpErrorResponse({ status: 0 });
    expect(toUserFacingError(error, 'list').kind).toBe('network');
  });

  it('should tell a timeout apart from a network failure even though both have status 0', () => {
    const error = new HttpErrorResponse({
      status: 0,
      error: new DOMException('signal timed out', 'TimeoutError'),
    });
    expect(toUserFacingError(error, 'list').kind).toBe('timeout');
  });

  it('should not classify a timeout on the product detail as not found', () => {
    const error = new HttpErrorResponse({
      status: 0,
      error: new DOMException('signal timed out', 'TimeoutError'),
    });
    expect(toUserFacingError(error, 'detail').kind).toBe('timeout');
  });

  it('should classify a 500 on the product detail as not found (the API does not use 404)', () => {
    const error = new HttpErrorResponse({ status: 500 });
    expect(toUserFacingError(error, 'detail').kind).toBe('not-found');
  });

  it('should classify a 500 on the product list as a server error', () => {
    const error = new HttpErrorResponse({ status: 500 });
    expect(toUserFacingError(error, 'list').kind).toBe('server');
  });

  it('should classify a 500 when adding to the cart as a server error', () => {
    const error = new HttpErrorResponse({ status: 500 });
    expect(toUserFacingError(error, 'cart').kind).toBe('server');
  });

  it('should classify a 400 as an unknown error', () => {
    const error = new HttpErrorResponse({ status: 400 });
    expect(toUserFacingError(error, 'cart').kind).toBe('unknown');
  });

  it('should classify an error not coming from HttpClient as unknown', () => {
    expect(toUserFacingError(new Error('boom'), 'list').kind).toBe('unknown');
  });

  it('should provide a non-empty message for each error kind', () => {
    const error = new HttpErrorResponse({ status: 0 });
    const result = toUserFacingError(error, 'list');
    expect(result.message.length).toBeGreaterThan(0);
  });
});
