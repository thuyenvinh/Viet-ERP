# VietERP Platform

**Nền tảng ERP mã nguồn mở cho doanh nghiệp Việt Nam / Open-source ERP platform for Vietnamese enterprises**

VietERP Platform is a comprehensive, enterprise-grade ERP ecosystem built with modern web technologies. Designed specifically for the Vietnamese market with bilingual Vi-En support, VAS accounting compliance (TT200), e-Invoice integration, and local payment/shipping gateways.

## Tổng quan / Overview

| Metric | Value |
|--------|-------|
| Total LOC | 473,193 |
| Applications | 14 modules |
| Shared Packages | 20 |
| Database Models | 970 |
| API Routes | 1,256 |
| Test Files | 706 |

## Modules / Ung dung

| Module | Description |
|--------|-------------|
| **HRM** | Quan ly nhan su / Human Resource Management |
| **HRM-AI** | HRM voi tro ly AI / AI-powered HRM |
| **CRM** | Quan ly khach hang / Customer Relationship Management |
| **MRP** | Quan ly san xuat / Manufacturing Resource Planning |
| **Accounting** | Ke toan / Accounting (TT200 compliant) |
| **Ecommerce** | Thuong mai dien tu / E-Commerce platform |
| **OTB** | Ke hoach mua hang / Open-To-Buy Planning |
| **TPM** | Quan ly khuyen mai / Trade Promotion Management |
| **PM** | Quan ly du an / Project Management |
| **ExcelAI** | Phan tich Excel voi AI / AI-powered Excel Analysis |
| **Admin** | Quan tri he thong / System Administration |
| **Docs** | Tai lieu / Documentation portal |

## Tech Stack / Cong nghe

- **Frontend**: Next.js 14, React 18, TypeScript 5, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL 16
- **Messaging**: NATS JetStream (event-driven architecture)
- **Auth**: Keycloak SSO + RBAC
- **Gateway**: Kong API Gateway
- **Cache**: Redis
- **Build**: Turborepo + npm workspaces
- **Testing**: Vitest + Playwright (E2E)

## Quick Start / Bat dau nhanh

### Prerequisites / Yeu cau

- Node.js >= 20.x LTS
- npm >= 10.x
- PostgreSQL 16
- Redis 7
- Docker & Docker Compose (recommended)

### Installation / Cai dat

```bash
# Clone repository
git clone https://github.com/your-org/vierp-platform.git
cd vierp-platform

# Install dependencies
npm install

# Start infrastructure services
docker compose up -d

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npx turbo db:migrate

# Seed sample data
npx turbo db:seed

# Start development
npx turbo dev
```

### Docker Compose (Full Stack)

```bash
docker compose --profile full up -d
```

This starts all infrastructure services: PostgreSQL, Redis, NATS, Keycloak, Kong.

## Project Structure / Cau truc du an

```
vierp-platform/
├── apps/                    # Application modules
│   ├── Accounting/          # Ke toan / Accounting
│   ├── CRM/                 # Khach hang / CRM
│   ├── Ecommerce/           # Thuong mai dien tu
│   ├── ExcelAI/             # Excel AI Analysis
│   ├── HRM/                 # Nhan su / HRM
│   ├── HRM-AI/              # HRM + AI
│   ├── HRM-unified/         # HRM tich hop
│   ├── MRP/                 # San xuat / Manufacturing
│   ├── OTB/                 # Open-To-Buy Planning
│   ├── PM/                  # Quan ly du an
│   ├── TPM-api/             # TPM Backend
│   ├── TPM-api-nestjs/      # TPM Backend (NestJS)
│   ├── TPM-web/             # TPM Frontend
│   └── docs/                # Documentation
├── packages/                # Shared libraries
│   ├── admin/               # Admin utilities
│   ├── ai-copilot/          # AI integration engine
│   ├── api-middleware/       # API middleware stack
│   ├── auth/                # Authentication
│   ├── branding/            # Central branding config
│   ├── cache/               # Redis cache layer
│   ├── database/            # Database utilities
│   ├── errors/              # Error handling
│   ├── events/              # NATS event system + DLQ
│   ├── feature-flags/       # Feature flag system
│   ├── health/              # Health checks
│   ├── i18n/                # Internationalization
│   ├── logger/              # Structured logging
│   ├── master-data/         # Master data management
│   ├── notifications/       # Notification service
│   ├── saas/                # Multi-tenant SaaS
│   ├── sdk/                 # Platform SDK
│   ├── security/            # Security utilities
│   ├── shared/              # Common utilities
│   └── tpm-shared/          # TPM shared types
├── infrastructure/          # K8s, Terraform, configs
├── scripts/                 # Build & utility scripts
├── docker-compose.yml       # Infrastructure services
├── turbo.json               # Turborepo config
├── BRANDING.md              # White-label customization guide
├── CONTRIBUTING.md          # Contribution guidelines
├── SECURITY.md              # Security policy
├── CODE_OF_CONDUCT.md       # Community code of conduct
└── LICENSE                  # MIT License
```

## White-Label / Ca nhan hoa thuong hieu

VietERP is designed for easy white-labeling. All branding is centralized in `packages/branding/`:

```bash
# 1. Edit brand config
# Edit packages/branding/src/config.ts

# 2. Run automated rebrand
npx ts-node scripts/rebrand.ts --dry-run   # Preview
npx ts-node scripts/rebrand.ts             # Apply

# 3. Rebuild
npx turbo build
```

See [BRANDING.md](./BRANDING.md) for full customization guide.

## Vietnamese Market Features / Tinh nang thi truong Viet Nam

- VAS Accounting compliance (Thong tu 200 / TT200)
- E-Invoice integration (Nghi dinh 123 / ND123)
- Payment gateways: VNPay, MoMo, ZaloPay
- Shipping: GHN, GHTK, Viettel Post
- Bilingual UI: Vietnamese-English (configurable)
- Vietnamese tax calculation & reporting

## Development / Phat trien

```bash
# Run all apps in dev mode
npx turbo dev

# Run specific app
npx turbo dev --filter=CRM

# Run tests
npx turbo test

# Run E2E tests
npx turbo test:e2e

# Build all
npx turbo build

# Lint
npx turbo lint

# Type check
npx turbo type-check
```

## Contributing / Dong gop

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Security / Bao mat

To report security vulnerabilities, please see [SECURITY.md](./SECURITY.md).

## License / Giay phep

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

---

Built with care for Vietnamese enterprises.
