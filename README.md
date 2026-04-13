# UniHive — Student-First Marketplace Platform

## Overview

UniHive is a student-centric marketplace designed to enable students across India to earn, trade, and support themselves through peer-to-peer commerce. It allows verified students to buy and sell physical products, digital goods, and services within a structured and trusted ecosystem.

The platform focuses on simplicity, identity, and accessibility, enabling students to participate in a self-sustaining micro-economy without the complexity of traditional e-commerce systems.

---

## Problem Statement

Students often face financial limitations during their academic journey and depend on parental support for personal expenses. At the same time, many students possess valuable skills, unused resources, or creative outputs that remain underutilized.

Existing platforms such as Amazon, Flipkart, and Instagram are not designed specifically for student-to-student commerce:

- Lack of student-specific trust and identity
- High competition and onboarding friction for new sellers
- Informal and unstructured transactions on social platforms
- No dedicated ecosystem for student economic participation

As a result, students lack a reliable, structured, and accessible platform to earn and trade.

---

## Solution

UniHive provides a student-first marketplace with a strong identity and trust layer, enabling:

- Verified students to participate in a secure ecosystem
- Structured product and service listings
- Flexible peer-to-peer transactions
- Direct communication between buyers and sellers
- Minimal friction for onboarding and usage

The platform prioritizes usability and trust over complexity, focusing on enabling real transactions rather than replicating large-scale e-commerce systems.

---

## Core Objectives

- Enable students to earn independently during their academic years
- Reduce dependency on parental financial support
- Provide a platform to showcase and monetize student skills
- Build a trusted environment for peer-to-peer transactions
- Encourage reuse and redistribution of resources

---

## Target Users

### Student Sellers

- Creators (handmade products, art, digital goods)
- Academic contributors (notes, guides)
- Service providers (design, editing, tutoring)
- Students selling unused items

### Student Buyers

- Students seeking affordable goods and services
- Individuals looking for peer-created or second-hand products

### Platform Administrators

- Responsible for verification, moderation, and platform integrity

---

## Key Features (MVP)

### Student Verification System

- Registration with student identity validation
- College ID upload or institutional email verification
- Admin approval workflow
- Status tracking (pending, approved, rejected)

### Listings System

- Support for:
    - Physical products
    - Digital products
    - Services
- Category-based organization
- Search, filtering, and sorting

### Seller Profiles

- Personalized storefronts
- Ratings and reviews
- Portfolio-style presentation

### Order Request System

- Buyers can:
    - Contact sellers via WhatsApp
    - Place structured order requests
- Sellers can accept or reject requests
- Order lifecycle tracking

### Payment Model (MVP)

- Direct payments between buyer and seller (UPI or mutually agreed method)
- Platform does not handle payments initially
- Payment system designed for future upgrade to platform-controlled flow

### Logistics Model

- Seller-managed shipping (via services such as Delhivery)
- Optional local pickup
- Platform does not manage delivery in MVP

### Admin System

- Seller verification and approval
- Product and user moderation
- Violation tracking system
- Automated ban after repeated violations

---

## Platform Principles

- Commerce-first, not social networking
- Simplicity over feature overload
- Trust before scale
- Student identity as the core differentiator
- Structured transactions with flexible execution

---

## System Architecture

### Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS

### Backend

- Node.js + Express
- REST API architecture
- Modular service-based structure

### Database

- MongoDB with Mongoose

---

## Backend Design Principles

The backend is designed to be scalable and easily upgradeable.

### Service-Based Architecture

- Controllers handle request/response
- Services contain business logic
- Models define data structure

### Extensible System Design

Key fields are introduced to support future upgrades:

- chatType: whatsapp | in-app
- paymentType: direct | platform
- deliveryType: pickup | shipping

### SOLID Principles

- Single Responsibility: Each service handles one domain
- Open/Closed: New features (payments, chat) added without modifying core logic
- Dependency Separation: Controllers do not contain business logic

### Composition Over Inheritance

- Modular services and reusable logic
- Flexible and maintainable structure

---

## Order Lifecycle

1. Buyer places an order request
2. Seller accepts or rejects
3. Buyer and seller coordinate payment (direct)
4. Seller updates order status

Order states:

- requested
- accepted
- rejected
- shipped
- delivered
- cancelled

---

## Trust and Safety

- Verified student accounts
- Admin moderation system
- Violation tracking and enforcement
- Transparent communication channels

---

## Future Roadmap

### Phase 2

- In-app chat system
- Platform-controlled payments (escrow)
- Integrated logistics APIs (e.g., Shiprocket)
- Advanced recommendation system

### Phase 3

- Campus partnerships
- Seller analytics dashboard
- Monetization (commission, premium features)
- Mobile application

---

## Revenue Model (Future)

Initial phase:

- No commission
- No platform fees

Future possibilities:

- Transaction-based commission
- Logistics service fees
- Premium seller features

---

## Legal and Compliance

UniHive will operate as an intermediary platform and comply with:

- IT Rules (India) for content moderation
- Privacy and data protection standards
- Clear Terms of Service and Privacy Policy

Future payment handling will require integration with compliant providers such as Razorpay.

---

## Vision

UniHive aims to become the foundational infrastructure for the student economy in India, enabling students to transition from consumers to contributors within a trusted and scalable ecosystem.

---

## Conclusion

UniHive is designed not as a generic marketplace, but as a focused platform addressing a specific need: enabling students to earn, trade, and grow within a structured and trusted environment.

Its strength lies in identity, simplicity, and execution.