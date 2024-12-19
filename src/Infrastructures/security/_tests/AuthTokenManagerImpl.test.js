const HapiJwt = require('@hapi/jwt');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AuthTokenManagerImpl = require('../AuthTokenManagerImpl');

describe('An AuthTokenManagerImpl Interface Implementation', () => {
  describe('Negative Tests', () => {
    describe('A .validateRefreshToken Method', () => {
      test('should throw an error when decoding a refresh token is failed', () => {
        const spiedDecode = jest
          .spyOn(HapiJwt.token, 'decode')
          .mockImplementation(() => {
            throw new Error();
          });

        const authTokenManagerImpl = new AuthTokenManagerImpl(HapiJwt);

        expect(() =>
          authTokenManagerImpl.validateRefreshToken('input_refresh_token'),
        ).toThrow(InvariantError);

        expect(() =>
          authTokenManagerImpl.validateRefreshToken('input_refresh_token'),
        ).toThrow('refresh token tidak valid');

        expect(spiedDecode).toHaveBeenCalledTimes(2);
        expect(spiedDecode).toHaveBeenCalledWith('input_refresh_token');
      });

      test('should throw an error when verifying a refresh token signature is failed', () => {
        const spiedDecode = jest
          .spyOn(HapiJwt.token, 'decode')
          .mockReturnValue({
            decoded: {
              payload: {
                userId: 'user-1',
              },
            },
          });

        const spiedVerifySignature = jest
          .spyOn(HapiJwt.token, 'verifySignature')
          .mockImplementation(() => {
            throw new Error();
          });

        const authTokenManagerImpl = new AuthTokenManagerImpl(HapiJwt);

        expect(() =>
          authTokenManagerImpl.validateRefreshToken('input_refresh_token'),
        ).toThrow(InvariantError);

        expect(() =>
          authTokenManagerImpl.validateRefreshToken('input_refresh_token'),
        ).toThrow('refresh token tidak valid');

        expect(spiedDecode).toHaveBeenCalledTimes(2);
        expect(spiedDecode).toHaveBeenCalledWith('input_refresh_token');

        expect(spiedVerifySignature).toHaveBeenCalledTimes(2);

        expect(spiedVerifySignature.mock.calls[0][0]).toStrictEqual({
          decoded: {
            payload: {
              userId: 'user-1',
            },
          },
        });

        expect(spiedVerifySignature.mock.calls[1][0]).toStrictEqual({
          decoded: {
            payload: {
              userId: 'user-1',
            },
          },
        });
      });
    });

    describe('A .getRefreshTokenPayload Method', () => {
      test('should throw an error when decoding a refresh token is failed', () => {
        const spiedDecode = jest
          .spyOn(HapiJwt.token, 'decode')
          .mockImplementation(() => {
            throw new Error();
          });

        const authTokenManagerImpl = new AuthTokenManagerImpl(HapiJwt);

        expect(() =>
          authTokenManagerImpl.getRefreshTokenPayload('input_refresh_token'),
        ).toThrow(InvariantError);

        expect(() =>
          authTokenManagerImpl.getRefreshTokenPayload('input_refresh_token'),
        ).toThrow('refresh token tidak valid');

        expect(spiedDecode).toHaveBeenCalledTimes(2);
        expect(spiedDecode).toHaveBeenCalledWith('input_refresh_token');
      });
    });
  });

  describe('Positive Tests', () => {
    describe('A .generateAccessToken Method', () => {
      test('should generate an access token', () => {
        const spiedGenerate = jest
          .spyOn(HapiJwt.token, 'generate')
          .mockReturnValue('access_token');

        const authTokenManagerImpl = new AuthTokenManagerImpl(HapiJwt);

        expect(
          authTokenManagerImpl.generateAccessToken({
            userId: 'user-1',
          }),
        ).toBe('access_token');

        expect(spiedGenerate).toHaveBeenCalledTimes(1);

        expect(spiedGenerate.mock.calls[0][0]).toStrictEqual({
          userId: 'user-1',
        });
      });
    });

    describe('A .generateRefreshToken Method', () => {
      test('should generate a refresh token', () => {
        const spiedGenerate = jest
          .spyOn(HapiJwt.token, 'generate')
          .mockReturnValue('refresh_token');

        const authTokenManagerImpl = new AuthTokenManagerImpl(HapiJwt);

        expect(
          authTokenManagerImpl.generateRefreshToken({
            userId: 'user-1',
          }),
        ).toBe('refresh_token');

        expect(spiedGenerate).toHaveBeenCalledTimes(1);

        expect(spiedGenerate.mock.calls[0][0]).toStrictEqual({
          userId: 'user-1',
        });
      });
    });

    describe('A .validateRefreshToken Method', () => {
      test('should not throw error when refresh token is valid', () => {
        const spiedDecode = jest
          .spyOn(HapiJwt.token, 'decode')
          .mockReturnValue({
            decoded: {
              payload: {
                userId: 'user-1',
              },
            },
          });

        const spiedVerifySignature = jest
          .spyOn(HapiJwt.token, 'verifySignature')
          .mockResolvedValue();

        const authTokenManagerImpl = new AuthTokenManagerImpl(HapiJwt);

        expect(() =>
          authTokenManagerImpl.validateRefreshToken('input_refresh_token'),
        ).not.toThrow(InvariantError);

        expect(spiedDecode).toHaveBeenCalledTimes(1);
        expect(spiedDecode).toHaveBeenCalledWith('input_refresh_token');

        expect(spiedVerifySignature).toHaveBeenCalledTimes(1);

        expect(spiedVerifySignature.mock.calls[0][0]).toStrictEqual({
          decoded: {
            payload: {
              userId: 'user-1',
            },
          },
        });
      });
    });

    describe('A .getRefreshTokenPayload Method', () => {
      test('should return a refresh token payload', () => {
        const spiedDecode = jest
          .spyOn(HapiJwt.token, 'decode')
          .mockReturnValue({
            decoded: {
              payload: {
                userId: 'user-1',
              },
            },
          });

        const authTokenManagerImpl = new AuthTokenManagerImpl(HapiJwt);

        expect(() =>
          authTokenManagerImpl.getRefreshTokenPayload('input_refresh_token'),
        ).not.toThrow(InvariantError);

        expect(
          authTokenManagerImpl.getRefreshTokenPayload('input_refresh_token'),
        ).toStrictEqual({
          userId: 'user-1',
        });

        expect(spiedDecode).toHaveBeenCalledTimes(2);
        expect(spiedDecode).toHaveBeenCalledWith('input_refresh_token');
      });
    });
  });
});
