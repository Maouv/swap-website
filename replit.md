# Ledgr - Monad Testnet Swap Application

## Overview

Ledgr is a decentralized token swap application built specifically for the Monad testnet. It provides a clean, minimalist interface for swapping between MON (native Monad token) and WMON (Wrapped Monad) tokens using Uniswap V2 protocol. The application features a full-stack architecture with React frontend, Express backend, and PostgreSQL database integration.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom Ledgr theme (dark mode focused)
- **Web3 Integration**: ethers.js for blockchain interactions
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js 20
- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL 16 (configured via Drizzle)
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Development**: Hot-reload with tsx

### Key Design Decisions
1. **Monorepo Structure**: Single repository with client, server, and shared directories for better code organization
2. **Shared Schema**: Database schema and types shared between client and server via `/shared` directory
3. **Memory Storage Fallback**: In-memory storage implementation as fallback when database is unavailable
4. **Web3-First**: Built specifically for Monad testnet with hardcoded contract addresses and network configuration

## Key Components

### Database Schema
- **Users Table**: Basic user management with username/password authentication
- **Schema Location**: `/shared/schema.ts` using Drizzle ORM with Zod validation

### Web3 Integration
- **Network**: Monad Testnet (Chain ID: 41144)
- **Protocols**: Uniswap V2 Router and Factory contracts
- **Tokens**: MON (native) and WMON (0x760afe86e5de5fa0ee542fc7b7b713e1c5425701)
- **Wallet**: MetaMask integration with automatic network switching

### UI Components
- **Design System**: Custom Ledgr theme with Courier Prime font
- **Color Scheme**: Dark theme with purple accents (#8B5CF6)
- **Components**: Comprehensive shadcn/ui component library
- **Responsive**: Mobile-first design approach

## Data Flow

1. **User Authentication**: Users can register/login through the backend API
2. **Wallet Connection**: MetaMask integration for Web3 functionality
3. **Token Swapping**: Direct interaction with Uniswap V2 contracts on Monad testnet
4. **Balance Updates**: Real-time balance fetching from blockchain
5. **Transaction History**: Local transaction tracking (planned feature)

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Database connectivity
- **ethers**: Ethereum/Web3 interactions
- **drizzle-orm**: Database ORM and migrations
- **@tanstack/react-query**: Async state management
- **wouter**: Lightweight React routing

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Variant-based styling

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type safety
- **tsx**: TypeScript execution for Node.js

## Deployment Strategy

### Development
- **Runtime**: Replit with Node.js 20, Web, PostgreSQL modules
- **Port**: Application runs on port 5000
- **Hot Reload**: Vite HMR for frontend, tsx for backend

### Production
- **Build Process**: 
  1. Vite builds client to `dist/public`
  2. esbuild bundles server to `dist/index.js`
- **Deployment**: Autoscale deployment target on Replit
- **Static Assets**: Served from `dist/public`

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment detection (development/production)

## Changelog
- June 15, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.