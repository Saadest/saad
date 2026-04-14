# Nova Scientia — Backend fase 1

Implementación inicial con Next.js App Router + TypeScript + Prisma.

## Incluye

- Autenticación por email/password (`/api/auth/register`, `/api/auth/login`).
- OAuth ORCID real (`/api/auth/orcid`, `/api/auth/callback/orcid`).
- Persistencia de `orcidId`, `fullName` y `orcidData` JSON en Prisma.
- APIs base: artículos, reviews, comentarios y reputación.
- Esquema inicial de wallet/transacciones para tokenización futura.

## Variables de entorno

Copiar `.env.example` a `.env` y completar:

- `DATABASE_URL`
- `JWT_SECRET`
- `ORCID_CLIENT_ID`
- `ORCID_CLIENT_SECRET`
- `ORCID_REDIRECT_URI`

## Base de datos

```bash
npx prisma generate
npx prisma db push
```

## Nota sobre NextAuth

Por política del entorno de ejecución, no fue posible instalar `next-auth` desde npm (error 403). La fase se implementó con flujo JWT propio y rutas ORCID reales, dejando la arquitectura lista para reemplazo directo por NextAuth cuando el registro permita instalar dependencias.
