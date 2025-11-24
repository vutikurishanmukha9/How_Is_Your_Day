# How Is Your Day - Blog Platform

A full-stack personal blogging platform with **Next.js web application** and **React Native mobile app** (iOS & Android).

## 🏗️ Architecture

This is a **monorepo** managed with pnpm workspaces and Turborepo:

- **`/apps/web`** - Next.js 14 web application (App Router)
- **`/apps/mobile`** - React Native Expo mobile app
- **`/packages/shared`** - Shared TypeScript types and utilities

## 🚀 Tech Stack

### Web Application
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL via Supabase
- **Auth**: Supabase Auth
- **Images**: Cloudinary
- **Email**: SendGrid
- **Deployment**: Vercel

### Mobile Application
- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **Styling**: NativeWind (Tailwind for React Native)
- **State**: TanStack Query
- **Push Notifications**: Expo Notifications

### Shared
- **API**: Next.js API Routes (serves both web and mobile)
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth (shared across platforms)

## 📦 Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **Supabase** account (free tier available)
- **Cloudinary** account (free tier available)
- **SendGrid** account (free tier available)

## 🛠️ Setup

### 1. Install Dependencies

```bash
# Install pnpm globally if you haven't
npm install -g pnpm

# Install all dependencies
pnpm install
```

### 2. Set Up Environment Variables

#### Web App (`/apps/web/.env.local`)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### Mobile App (`/apps/mobile/.env`)
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set Up Database

Run the SQL schema in your Supabase SQL Editor (see `/docs/database-schema.sql`)

## 🏃 Development

### Run All Apps
```bash
pnpm dev
```

### Run Individual Apps
```bash
# Web app only
pnpm web:dev

# Mobile app only
pnpm mobile:dev
```

### Build
```bash
# Build all apps
pnpm build

# Build web app only
pnpm web:build
```

## 📱 Mobile Development

### iOS Simulator
```bash
cd apps/mobile
pnpm ios
```

### Android Emulator
```bash
cd apps/mobile
pnpm android
```

### Expo Go (Physical Device)
```bash
cd apps/mobile
pnpm start
# Scan QR code with Expo Go app
```

## 🌐 Web Application

- **Public Site**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **API Docs**: See `/docs/api.md`

## 📂 Project Structure

```
/how-is-your-day
├── /apps
│   ├── /web                    # Next.js web application
│   │   ├── /app                # App Router pages
│   │   ├── /components         # React components
│   │   └── /lib                # Utilities
│   └── /mobile                 # React Native Expo app
│       ├── /app                # Expo Router screens
│       ├── /components         # React Native components
│       └── /lib                # Utilities
├── /packages
│   └── /shared                 # Shared code
│       ├── /types              # TypeScript interfaces
│       └── /utils              # Common utilities
├── package.json                # Monorepo root
├── pnpm-workspace.yaml         # Workspace config
└── turbo.json                  # Turborepo config
```

## 🔐 Admin Access

Default admin credentials will be created during database setup. See `/docs/setup.md` for details.

## 📝 License

MIT

## 🤝 Contributing

This is a personal blog platform. For issues or suggestions, please open an issue.