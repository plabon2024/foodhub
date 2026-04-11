import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export const envVars = {
    NODE_ENV: process.env.NODE_ENV as string,
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
    APP_URL: process.env.APP_URL as string,
    MAIL_USER: process.env.MAIL_USER as string,
    MAIL_PASS: process.env.MAIL_PASS as string,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
};

export default envVars;
