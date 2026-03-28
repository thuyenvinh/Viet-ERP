# Contributing to VietERP Platform / Huong dan Dong gop

Thank you for your interest in contributing to VietERP! This guide will help you get started.

## Getting Started / Bat dau

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/vierp-platform.git`
3. Create a feature branch: `git checkout -b feature/my-feature`
4. Install dependencies: `npm install`
5. Start infrastructure: `docker compose up -d`

## Development Workflow / Quy trinh

### Branch Naming / Quy uoc dat ten nhanh

- `feature/` — New features (e.g., `feature/crm-bulk-import`)
- `fix/` — Bug fixes (e.g., `fix/invoice-calculation`)
- `docs/` — Documentation changes
- `refactor/` — Code refactoring
- `test/` — Test additions or fixes

### Commit Messages / Thong diep commit

We follow the Conventional Commits specification:

```
<type>(<scope>): <description>

[optional body]
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`, `ci`

Scopes: `hrm`, `crm`, `mrp`, `accounting`, `ecommerce`, `otb`, `tpm`, `pm`, `core`, `events`, `auth`, `branding`

Examples:
```
feat(crm): add bulk customer import via CSV
fix(accounting): correct TT200 tax calculation for Q4
docs(branding): update white-label customization guide
refactor(events): migrate DLQ to typed event schemas
```

### Pull Request Process / Quy trinh Pull Request

1. Ensure all tests pass: `npx turbo test`
2. Ensure type checking passes: `npx turbo type-check`
3. Ensure linting passes: `npx turbo lint`
4. Update documentation if needed
5. Create a pull request with a clear description
6. Link any related issues

## Code Standards / Tieu chuan ma nguon

### TypeScript

- Use strict TypeScript — avoid `any` type
- Export interfaces for public APIs
- Use Prisma types for database models
- Prefer `const` over `let`

### File Organization

- Collocate tests with source files (e.g., `utils.ts` + `utils.test.ts`)
- Use barrel exports (`index.ts`) for packages
- Follow Next.js App Router conventions for route files

### Styling

- Use Tailwind CSS for all styling
- Follow the design tokens in `packages/branding`
- Support dark mode where applicable

### Internationalization

- All user-facing strings must use the bilingual label system from `@vierp/branding`
- Format: "Tieng Viet / English" for bilingual mode
- Never hardcode UI text directly in components

## Testing / Kiem thu

```bash
# Unit tests
npx turbo test

# E2E tests
npx turbo test:e2e

# Test specific module
npx turbo test --filter=CRM
```

- Write tests for all new features
- Maintain existing test coverage
- E2E tests for critical user flows

## Reporting Issues / Bao cao loi

Use GitHub Issues with the provided templates:
- **Bug Report**: For bugs and unexpected behavior
- **Feature Request**: For new features and enhancements

Include: steps to reproduce, expected vs actual behavior, screenshots if applicable.

## Code of Conduct / Quy tac ung xu

This project follows a Code of Conduct. See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## Questions / Cau hoi

If you have questions, please open a GitHub Discussion or create an issue.

Thank you for contributing to VietERP Platform!
