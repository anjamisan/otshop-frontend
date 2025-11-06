import { AuthResponseDTO } from './response-dto';

describe('AuthResponseDTO', () => {
  it('should have correct structure', () => {
    const response: AuthResponseDTO = { jwtToken: 'abc123', expiresIn: 3600 };
    expect(response).toBeTruthy();
    expect(response.jwtToken).toBe('abc123');
  });
});
