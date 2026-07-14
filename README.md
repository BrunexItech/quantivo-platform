# 🌍 Quantivo - Virtual Learning Platform Kenya

Complete full-stack virtual field trip platform for Kenyan education.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MongoDB 7+
- Docker & Docker Compose (optional)

### Option 1: Docker (Recommended)
git clone https://github.com/your-org/quantivo-platform.git
cd quantivo-platform
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
docker-compose up -d

### Option 2: Manual Setup
cd backend
cp .env.example .env
npm install
npm run seed
npm start

cd ../frontend
cp .env.example .env
npm install
npm run dev

## Default Admin Account
Email: admin@quantivo.co.ke
Password: Admin123!

## Features
- Multi-role authentication
- Kenyan administrative structure
- Multi-currency payments
- M-Pesa integration
- 70% creator revenue share
- Admin quality approval
- VR/AR support
- Kenya DPA 2019 compliant

## Support
Email: info@quantivo.co.ke
