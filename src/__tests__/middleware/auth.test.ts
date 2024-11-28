/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

describe('authMiddleware', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    delete process.env.BASIC_AUTH_USERNAME;
    delete process.env.BASIC_AUTH_PASSWORD;
  });

  it('should throw an error if BASIC_AUTH_USERNAME or BASIC_AUTH_PASSWORD is not set', async () => {
    delete process.env.BASIC_AUTH_USERNAME;
    delete process.env.BASIC_AUTH_PASSWORD;

    await expect(async () => {
      await import('../../middleware/auth');
    }).rejects.toThrow('BASIC_AUTH_USERNAME or BASIC_AUTH_PASSWORD is not set');
  });

  it('should allow the request when correct credentials are provided', async () => {
    process.env.BASIC_AUTH_USERNAME = 'testuser';
    process.env.BASIC_AUTH_PASSWORD = 'testpass';

    const { authMiddleware } = await import('../../middleware/auth');

    const credentials = Buffer.from('testuser:testpass').toString('base64');
    const headers = new Headers();
    headers.set('Authorization', `Basic ${credentials}`);
    const request = { headers } as unknown as NextRequest;

    const response = authMiddleware(request);

    expect(response.status).toBe(200);
  });

  it('should respond with 401 when incorrect credentials are provided', async () => {
    process.env.BASIC_AUTH_USERNAME = 'testuser';
    process.env.BASIC_AUTH_PASSWORD = 'testpass';

    const { authMiddleware } = await import('../../middleware/auth');

    const credentials = Buffer.from('wronguser:wrongpass').toString('base64');
    const headers = new Headers();
    headers.set('Authorization', `Basic ${credentials}`);
    const request = { headers } as unknown as NextRequest;

    const response = authMiddleware(request);

    expect(response.status).toBe(401);
    expect(response.headers.get('WWW-Authenticate')).toBe('Basic realm="Protected Area"');
    const text = await response.text();
    expect(text).toBe('Authentication required');
  });

  it('should respond with 401 when no Authorization header is present', async () => {
    process.env.BASIC_AUTH_USERNAME = 'testuser';
    process.env.BASIC_AUTH_PASSWORD = 'testpass';

    const { authMiddleware } = await import('../../middleware/auth');

    const request = { headers: new Headers() } as unknown as NextRequest;

    const response = authMiddleware(request);

    expect(response.status).toBe(401);
    expect(response.headers.get('WWW-Authenticate')).toBe('Basic realm="Protected Area"');
    const text = await response.text();
    expect(text).toBe('Authentication required');
  });
});
