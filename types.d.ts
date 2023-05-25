export interface SiteEnvTypes {
  PORT: string;
  MONGO_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  SMTP_PASS: string;
  SMTP_USER: string;
  SMTP_PORT: number;
  SMTP_HOST: string;
  FRONTEND_BASE_URL: string;
}
