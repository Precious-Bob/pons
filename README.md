# Pons

A minimal financial infrastructure API built with **NestJS, TypeORM, and SQLite**.

Pons is a simulation of [ThePeer](https://thepeer.co/), designed to model core financial infrastructure features such as customer management, wallet creation, and wallet transactions through an authenticated API.

Pons allows businesses to manage customers, create wallets, and perform basic wallet transactions through an authenticated API.

## Functional Requirements

- Business API-key authentication
- Customer creation and management
- Customer-to-business ownership
- Wallet creation per customer and currency
- Wallet funding
- Wallet debiting
- Insufficient-balance protection
- Transaction history
- Transaction references for idempotency
- Business-level resource isolation

## Core Entities

```text
Business
   │
   └── Customer
          │
          └── Wallet
                 │
                 └── Transaction
```

### Business

Represents a business using the Pons API.

### Customer

Represents a customer belonging to a business.

### Wallet

Stores a customer's balance and currency.

### Transaction

Records money movement into or out of a wallet.

## Core API

```text
POST   /v1/customers
GET    /v1/customers/:id

POST   /v1/wallets
GET    /v1/wallets/:id

POST   /v1/wallets/:id/fund
POST   /v1/wallets/:id/debit

GET    /v1/wallets/:id/transactions
```

## Design Principles

- Money stored as integer minor units (e.g. kobo)
- Wallet balance and transaction records updated atomically
- Transaction references are unique
- Business resources are isolated from other businesses
- Financial transactions are treated as immutable records

## Tech Stack

- **NestJS**
- **TypeScript**
- **TypeORM**
- **SQLite**
- **class-validator**

## Status

🚧 MVP in development.

- hash apikey on db
- implement transfers
