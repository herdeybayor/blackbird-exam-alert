# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Exam Alert System built with Next.js 15, TypeScript, and Prisma. The application manages exam schedules, student notifications, and faculty administration for academic institutions. It features separate authentication systems for students and administrators.

## Development Commands

### Core Commands
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

### Database Commands
- `npm run seed-faculties` - Seed database with faculty data using tsx

## Architecture Overview

### Application Structure
The app follows Next.js 15 App Router structure with clear separation between admin and student functionality:

- `/app/admin/` - Administrative interface (dashboard, student/faculty management, exam setup)
- `/app/student/` - Student interface (dashboard, exam details, profile management)
- `/app/helpers/` - Authentication and business logic utilities
- `/components/ui/` - Reusable UI components (shadcn/ui with "new-york" style)
- `/lib/` - Core utilities and Prisma client setup
- `/types/` - TypeScript type definitions

### Database Architecture
Uses PostgreSQL with Prisma ORM. Key models:
- **Admin** - Administrative users with email/password auth
- **Student** - Students with matric number-based login, faculty/department associations
- **Faculty** - Academic faculties with related halls and timetables
- **FacultyHall** - Exam venues with capacity management
- **TimeTable** - Exam schedules per faculty/session
- **TimeTableCourse** - Individual course exam details

### Authentication System
Custom authentication using cookies and bcryptjs:
- **Admin Auth** - Email-based with default password flow that forces hash update on first login
- **Student Auth** - Matric number-based login system
- Auth helpers located in `app/helpers/auth.ts` with session management via Next.js cookies

### Key Configuration Details
- **Prisma Client** - Generated to `app/generated/prisma/` (custom output path)
- **Path Aliases** - `@/*` maps to project root for imports
- **UI Framework** - shadcn/ui components with Radix UI primitives
- **Styling** - Tailwind CSS with CSS variables for theming

### Important Technical Notes
- Uses Prisma with custom client output path (`app/generated/prisma/`)
- Database uses UUID primary keys with PostgreSQL-specific functions
- Authentication tokens stored in HTTP-only cookies
- Admin passwords undergo special handling for default → hashed migration
- Faculty seeding available via dedicated script in `prisma/faculty-seed.ts`

## Development Workflow
1. Database changes require updating `prisma/schema.prisma` and running migrations
2. UI components follow shadcn/ui patterns with TypeScript
3. Authentication flows use the centralized AuthHelper class
4. All database queries go through the shared Prisma client in `lib/prisma.ts`