/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

// Do not import middleware or authMiddleware at the top level
// We will import them inside the tests after setting environment variables

jest.mock('../middleware/auth', () => ({
  authMiddleware: jest.fn(),
}));

describe('middleware', () => {
  beforeEach(() => {
    jest.resetModules(); // Clears the module cache
    jest.clearAllMocks(); // Clears mock data
  });

  afterEach(() => {
    delete process.env.BASIC_AUTH_USERNAME;
    delete process.env.BASIC_AUTH_PASSWORD;
  });

  it('should return the response from authMiddleware if it exists', async () => {
    // Set environment variables before importing middleware
    process.env.BASIC_AUTH_USERNAME = 'testuser';
    process.env.BASIC_AUTH_PASSWORD = 'testpass';

    // Import middleware and authMiddleware after setting environment variables
    const { middleware } = await import('../middleware');
    const { authMiddleware } = await import('../middleware/auth');

    // Mock the response from authMiddleware
    const mockResponse = {
      status: 401,
      headers: new Headers({
        'WWW-Authenticate': 'Basic realm="Protected Area"',
      }),
      text: jest.fn().mockResolvedValue('Authentication required'),
    };
    (authMiddleware as jest.Mock).mockReturnValue(mockResponse);

    const request = new NextRequest('http://localhost');

    const response = middleware(request);

    expect(authMiddleware).toHaveBeenCalledWith(request);
    expect(response).toBe(mockResponse);
  });

  it('should throw error if authresponse is undefiend', async () => {
    // Set environment variables before importing middleware
    process.env.BASIC_AUTH_USERNAME = 'testuser';
    process.env.BASIC_AUTH_PASSWORD = 'testpass';

    const { middleware } = await import('../middleware');
    const { authMiddleware } = await import('../middleware/auth');

    // Mock authMiddleware to return undefined
    (authMiddleware as jest.Mock).mockReturnValue(undefined);

    const request = new NextRequest('http://localhost');

    
    expect(() => middleware(request)).toThrow(Error("Authentication failed: No auth response exists."));
    expect(authMiddleware).toHaveBeenCalledWith(request);
  });
});
