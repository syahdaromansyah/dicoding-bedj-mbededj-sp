const createServer = require('../createServer');

describe('An HTTP Server', () => {
  describe('A 404 Response Code', () => {
    test('should return error response when accessing unregistered endpoint', async () => {
      // Arrange
      const server = await createServer({});

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/404',
        payload: {},
      });

      // Assert
      expect(response.statusCode).toBe(404);
    });
  });
});
