export const envSchema = {
  type: 'object',
  required: [
    'DATABASE_URL',
    'JWT_AUTH_TOKEN_SECRET',
    'JWT_AUTH_TOKEN_EXPIRES_IN',
    'JWT_REFRESH_TOKEN_SECRET',
    'JWT_REFRESH_TOKEN_EXPIRES_IN',
    'ADMIN_PASSWORD'
  ],
  properties: {
    DATABASE_URL: {
      type: 'string'
    },
    ENVIRONMENT: {
      enum: ['development', 'production', 'test']
    },
    JWT_AUTH_TOKEN_SECRET: {
      type: 'string'
    },
    JWT_AUTH_TOKEN_EXPIRES_IN: { type: 'string' },
    JWT_REFRESH_TOKEN_SECRET: {
      type: 'string'
    },
    JWT_REFRESH_TOKEN_EXPIRES_IN: { type: 'string' },
    DOMAIN: { type: 'string' },
    ADMIN_PASSWORD: { type: 'string' }
  }
};
