# Security Policy / Chinh sach Bao mat

## Supported Versions / Phien ban duoc ho tro

| Version | Supported |
|---------|-----------|
| 1.x     | Yes       |
| < 1.0   | No        |

## Reporting a Vulnerability / Bao cao lo hong

**Please do NOT report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability, please report it responsibly:

1. Email: security@your-domain.com
2. Include a detailed description of the vulnerability
3. Steps to reproduce the issue
4. Potential impact assessment
5. Suggested fix (if any)

### What to Expect / Quy trinh xu ly

- **Acknowledgment**: Within 48 hours of your report
- **Assessment**: Within 7 days, we will assess severity and impact
- **Fix**: Critical vulnerabilities will be patched within 14 days
- **Disclosure**: We will coordinate responsible disclosure with you

### Severity Levels / Muc do nghiem trong

| Level | Description | Response Time |
|-------|-------------|---------------|
| Critical | Remote code execution, data breach | 24 hours |
| High | Authentication bypass, privilege escalation | 72 hours |
| Medium | XSS, CSRF, information disclosure | 7 days |
| Low | Minor issues, best practice violations | 30 days |

## Security Measures / Bien phap Bao mat

VietERP Platform implements the following security measures:

- **Authentication**: Keycloak SSO with RBAC
- **Database**: 100% Prisma ORM (zero raw SQL) — prevents SQL injection
- **API Security**: Rate limiting, CORS, CSP headers, HSTS
- **Secrets Management**: No hardcoded secrets; .env-based configuration
- **Dependencies**: Regular dependency audits
- **Input Validation**: Request validation middleware for all API routes
- **Event Security**: Versioned events with idempotency keys
- **Multi-tenant**: Tenant isolation at database and application level

## Best Practices for Deployers / Huong dan cho nguoi trien khai

1. Always use HTTPS in production
2. Rotate API keys and secrets regularly
3. Enable Keycloak brute-force detection
4. Configure firewall rules for database access
5. Enable audit logging
6. Run `npm audit` regularly
7. Keep all dependencies up to date
8. Use the provided Docker images with non-root users

## Hall of Fame / Vinh danh

We appreciate security researchers who help keep VietERP safe. Responsible disclosures will be acknowledged here.

Thank you for helping keep VietERP Platform secure.
