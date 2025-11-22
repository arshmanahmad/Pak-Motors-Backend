# Environment Setup Guide

## Overview

The application uses environment-specific configuration files based on `NODE_ENV`:

- `.env.development` - for development environment
- `.env.production` - for production environment
- `.env.production.local` - for local production testing

## Quick Start

1. Copy the example file based on your environment:

   ```bash
   # For development
   cp env.example .env.development

   # For production
   cp env.example .env.production
   ```

2. Update the values in your `.env.{NODE_ENV}` file with your actual configuration.

## Environment Variables

### Required Variables

#### Application Settings

- `NODE_ENV` - Environment name (development, production, production.local, test)
- `HOST` - Server host (default: localhost)
- `PORT` - Server port (default: 3000)

#### CORS Configuration

- `CORS_ORIGIN` - Allowed CORS origins
  - For multiple origins, separate with semicolon (;)
  - Example: `http://localhost:3001;http://localhost:3000`
  - Production: `https://yourdomain.com;https://www.yourdomain.com`

#### Rate Limiting

- `COMMON_RATE_LIMIT_MAX_REQUESTS` - Maximum requests per window (default: 1000)
- `COMMON_RATE_LIMIT_WINDOW_MS` - Time window in milliseconds (default: 1000)

#### Database

- `MONGO_URL` - MongoDB connection string
  - Local: `mongodb://localhost:27017/pak-motors-db`
  - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/database-name`

#### Authentication

- `JWT_SECRET_KEY` - Secret key for JWT token signing
  - **IMPORTANT**: Use a strong, randomly generated secret in production
  - Generate with: `openssl rand -base64 32`
- `JWT_EXPIRES_IN` - JWT token expiration time
  - Examples: `1d` (1 day), `7d` (7 days), `24h` (24 hours)

#### Security

- `BCRYPT_SALT_ROUNDS` - Salt rounds for password hashing (default: 10)
  - Recommended: 10-12 for development, 12+ for production

#### Email Configuration

- `EMAIL_USER` - Email address for sending OTPs and notifications
  - For Gmail, use your email address
- `EMAIL_PASSWORD` - App-specific password (not your regular password)
  - For Gmail: Generate in Google Account > Security > 2-Step Verification > App passwords

#### OTP Configuration (Optional)

- `OTP_MAX_ATTEMPTS` - Maximum OTP verification attempts (default: 5)

## Example Configurations

### Development (.env.development)

```env
NODE_ENV=development
HOST=localhost
PORT=3000
CORS_ORIGIN=http://localhost:3001;http://localhost:3000
COMMON_RATE_LIMIT_MAX_REQUESTS=1000
COMMON_RATE_LIMIT_WINDOW_MS=1000
MONGO_URL=mongodb://localhost:27017/pak-motors-db
JWT_SECRET_KEY=dev-secret-key-change-in-production
JWT_EXPIRES_IN=1d
BCRYPT_SALT_ROUNDS=10
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
OTP_MAX_ATTEMPTS=5
```

### Production (.env.production)

```env
NODE_ENV=production
HOST=0.0.0.0
PORT=3000
CORS_ORIGIN=https://yourdomain.com;https://www.yourdomain.com
COMMON_RATE_LIMIT_MAX_REQUESTS=100
COMMON_RATE_LIMIT_WINDOW_MS=60000
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/pak-motors-db
JWT_SECRET_KEY=CHANGE-THIS-TO-A-STRONG-RANDOM-SECRET-KEY
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASSWORD=your-production-app-specific-password
OTP_MAX_ATTEMPTS=5
```

## Security Best Practices

1. **Never commit `.env` files to version control**

   - Add `.env*` to `.gitignore` (except `env.example`)
   - Use different credentials for each environment

2. **Use strong secrets in production**

   - Generate JWT_SECRET_KEY using: `openssl rand -base64 32`
   - Use different secrets for each environment

3. **Restrict CORS origins in production**

   - Only include your actual frontend domains
   - Don't use wildcards or `*` in production

4. **Use environment variables for sensitive data**

   - Never hardcode passwords, API keys, or secrets
   - Use secure secret management in production (AWS Secrets Manager, etc.)

5. **Database security**
   - Use strong database passwords
   - Restrict database access by IP in production
   - Use MongoDB Atlas network access rules

## Gmail App Password Setup

1. Go to your Google Account settings
2. Navigate to Security > 2-Step Verification
3. Scroll down to "App passwords"
4. Generate a new app password for "Mail"
5. Use this password (not your regular Gmail password) in `EMAIL_PASSWORD`

## Troubleshooting

### Environment file not found

- Make sure the file is named correctly: `.env.{NODE_ENV}`
- Check that `NODE_ENV` matches your environment file name
- The file should be in the root directory of the project

### MongoDB connection issues

- Verify MongoDB is running (for local setup)
- Check the connection string format
- Verify network access rules (for MongoDB Atlas)

### CORS errors

- Ensure `CORS_ORIGIN` includes your frontend URL
- Check for typos in the origin URL
- Verify protocol (http vs https) matches

### Email sending fails

- Verify `EMAIL_USER` and `EMAIL_PASSWORD` are correct
- For Gmail, ensure you're using an app-specific password
- Check that "Less secure app access" is enabled (if required)
