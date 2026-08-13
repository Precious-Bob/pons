# Pons

> **A simulated inter-fintech wallet routing service built with NestJS.**

## Overview

**Pons** is Latin for _"bridge"_—a fitting name for a platform that connects independent wallet systems. Inspired by African fintech infrastructure companies like **Thepeer**, Pons is an educational simulation that demonstrates how an intermediary service can coordinate wallet-to-wallet transfers between separate financial systems.

Rather than processing real money, Pons recreates the backend engineering challenges involved in building payment infrastructure, including transaction consistency, idempotency, asynchronous communication, and failure recovery.

## The Problem

Digital wallets often exist as isolated ecosystems. If a user has funds in one wallet provider and wants to send money to someone using another provider, those systems need a reliable way to communicate.

Pons simulates that infrastructure layer by acting as a bridge between multiple independent wallet providers.

## How It Works

Pons sits between three simulated fintech providers—**PayA**, **PayB**, and **PayC**—and routes transfers between them while maintaining a consistent and auditable transaction history.

```text
                Pons
                 │
      ┌──────────┼──────────┐
      ▼          ▼          ▼
    PayA       PayB       PayC
```

Each provider has its own users and wallets, while Pons coordinates cross-provider transfers through a unified API.

## Core Features

- Simulated wallet providers (PayA, PayB, PayC)
- Cross-provider wallet transfers
- Double-entry ledger for auditable money movement
- Idempotency keys to prevent duplicate transfers
- Transaction state management
- Webhook delivery for provider notifications
- Retry mechanisms for failed webhook deliveries
- Reconciliation jobs for stuck or uncertain transfers
- Failure injection for testing timeout and recovery scenarios

## Tech Stack

- **NestJS** — Backend framework
- **TypeScript** — Primary language
- **SQLite** — Relational database for the simulation
- **TypeORM** — ORM and migrations
- **Redis** — Queue backing store
- **BullMQ** — Background jobs, webhooks, and retries
- **Swagger** — API documentation
- **Jest** — Testing

## Learning Goals

Pons is designed as a backend engineering project focused on concepts commonly found in payment infrastructure, including:

- Transaction consistency
- Double-entry accounting
- Idempotency
- Asynchronous processing
- Webhooks
- Retry strategies
- Distributed system reliability
- Reconciliation workflows

## Project Scope

Pons is **not** a production payment platform.

It does **not** integrate with real banks, fintech APIs, or payment gateways. Instead, it provides a safe environment for exploring the architectural patterns behind modern payment infrastructure.

## Getting Started

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
pnpm install

# Run database migrations
pnpm migration:run

# Start the development server
pnpm start:dev
```

Once running, the API documentation will be available through Swagger.

## License

MIT
