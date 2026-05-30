export const ENV = {
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000/",

  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGODB_URI || "",

  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "",

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "secret",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "secret",

  ACCESS_TOKEN_TTL: 15 * 60,
  REFRESH_TOKEN_TTL: 7 * 24 * 60 * 60,

  OTP_TTL: 5 * 60,

  STRIPE_KEY: process.env.STRIPE_KEY || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",

  RESEND_API: process.env.RESEND_API || "",
  RESEND_FROM: process.env.RESEND_FROM || "",

  REDIS_HOST: process.env.REDIS_HOST || "redis",
  REDIS_PORT: process.env.REDIS_PORT || "6359",

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",

  GITHUB_BASE_URL: process.env.GITHUB_BASE_URL || "https://api.github.com",
};
