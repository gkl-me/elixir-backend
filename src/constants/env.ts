

export const ENV = {
    CLIENT_URL:process.env.CLIENT_URL || "http://localhost:3000/",
    
    NODE_ENV:process.env.NODE_ENV || 'development',
    MONGODB_URI:process.env.MONGODB_URI || '',

    ADMIN_EMAIL:process.env.ADMIN_EMAIL || "",
    ADMIN_PASSWORD:process.env.ADMIN_PASSWORD || "",

    ACCESS_TOKEN_SECRET:process.env.ACCESS_TOKEN_SECRET || "secret",
    REFRESH_TOKEN_SECRET:process.env.REFRESH_TOKEN_SECRET || "secret",

    STRIPE_KEY:process.env.STRIPE_KEY || "",
    STRIPE_WEBHOOK_SECRET:process.env.STRIPE_WEBHOOK_SECRET || "",

    RESEND_API:process.env.RESEND_API || "",
    RESEND_FROM:process.env.RESEND_FROM || "",

    REDIS_HOST:process.env.REDIS_HOST || "redis",
    REDIS_PORT:process.env.REDIS_PORT || "6359",
    REDIS_PASSWORD:process.env.REDIS_PASSWORD || "demo"
}