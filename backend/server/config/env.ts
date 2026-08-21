import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  JWT_SECRET: process.env.JWT_SECRET || 'msrtc_secure_jwt_token_key_2026',
  HMAC_SECRET: process.env.HMAC_SECRET || 'msrtc_hmac_sha256_e_ticket_secret_key_2026',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
};
