# Health & Wealth Club

Premium Life & Style curated experience.

## Overview

This repository contains the backend and frontend for the Health & Wealth Club storefront. It is built using the Medusa framework.

## Project Structure

- `admin/`: Medusa admin and backend logic (subscribers, services, etc.)
- `store/`: Next.js storefront

## Subscribers

We use subscribers to handle various events in the system:

### Order Notifications
Handles sending emails via Resend for:
- Order Confirmation (`order.placed`)
- Shipment Updates (`shipment.created`)
- Delivery Notifications (`delivery.created`)

