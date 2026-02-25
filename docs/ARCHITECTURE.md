# Nexus Architecture

## Overview

Nexus follows a modular, layered architecture designed for rapid MVP development with clear scaling paths.

```
┌─────────────────────────────────────────────┐
│                  Frontend                     │
│  Next.js App Router + React Components        │
│  - Quest Browser (interactive tree/map)       │
│  - Contributor Dashboard                      │
│  - "How can I help?" Interface                │
│  - Real-time progress tracking                │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────┴──────────────────────────┐
│                 API Layer                     │
│  Next.js API Routes (REST)                   │
│  - /api/quests     — CRUD, search, filter    │
│  - /api/match      — AI skill matching       │
│  - /api/monitor    — Tag feed & signals      │
│  - /api/progress   — Updates & milestones    │
│  - /api/auth       — User auth (NextAuth)    │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────┴──────────────────────────┐
│              Core Services                    │
│                                               │
│  ┌─────────────┐  ┌──────────────────────┐  │
│  │ Quest Engine │  │ Tag Monitor          │  │
│  │ - Tree mgmt  │  │ - Twitter/X API      │  │
│  │ - Dependencies│  │ - Moltbook API       │  │
│  │ - Progress    │  │ - GitHub Events      │  │
│  │ - Matching    │  │ - RSS/Atom feeds     │  │
│  └─────────────┘  │ - AI noise filter     │  │
│                    └──────────────────────┘  │
│  ┌──────────────────────────────────────┐   │
│  │ AI Integration                        │   │
│  │ - Natural language quest matching     │   │
│  │ - Skill extraction from profiles      │   │
│  │ - Content categorization              │   │
│  │ - Recommendation engine               │   │
│  └──────────────────────────────────────┘   │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────┴──────────────────────────┐
│              Data Layer                       │
│  MongoDB (Atlas)                              │
│  - quests (tree structure, metadata)          │
│  - users (profiles, skills, contributions)    │
│  - signals (monitored tag hits)               │
│  - progress (updates, milestones)             │
└─────────────────────────────────────────────┘
```

## MVP Scope (Phase 1)

Focus: Get a working quest browser with manual quest creation and basic "How can I help?" matching.

### Must Have
- Landing page with project vision
- Quest list/tree view (read from database)
- Quest detail page (description, status, dependencies)
- Simple user registration (GitHub OAuth via NextAuth)
- "How can I help?" form → basic keyword matching to open quests
- Admin interface for quest creation/editing
- Mobile-responsive design

### Nice to Have (Phase 1.5)
- Tag monitoring (Twitter, Moltbook)
- AI-powered quest matching
- Interactive roadmap visualization (React Flow)
- Real-time progress updates
- Contributor profiles with skill tags

### Phase 2
- Full tag monitoring pipeline with AI filtering
- Advanced quest dependencies and unlock mechanics
- Reputation/contribution tracking
- API for external integrations
- Discord bot for quest notifications

## Data Models

### Quest
```typescript
interface Quest {
  _id: ObjectId;
  title: string;
  type: 'main' | 'side';
  description: string;          // Markdown
  status: 'open' | 'in_progress' | 'review' | 'complete';
  skills: string[];             // Required/relevant skills
  parentQuest?: ObjectId;       // For sidequests
  dependencies?: ObjectId[];    // Must complete before this
  assignees?: ObjectId[];       // Users working on it
  progress: number;             // 0-100
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
```

### User
```typescript
interface User {
  _id: ObjectId;
  name: string;
  email: string;
  githubId?: string;
  skills: string[];
  contributions: ObjectId[];    // Completed quests
  joinedAt: Date;
}
```

### Signal
```typescript
interface Signal {
  _id: ObjectId;
  source: 'twitter' | 'moltbook' | 'github' | 'rss';
  content: string;
  url: string;
  relevanceScore: number;       // AI-assigned
  linkedQuest?: ObjectId;       // If categorized
  capturedAt: Date;
}
```

## Key Decisions

1. **Next.js over plain React** — Server components, API routes, and Vercel deployment in one package. Fastest path to MVP.
2. **MongoDB over Postgres** — Flexible schema fits evolving quest structures. Free Atlas tier for MVP.
3. **GitHub OAuth first** — Our target audience (builders, devs, agents) already has GitHub accounts.
4. **Quest definitions in DB, not files** — Enables community creation and dynamic updates. Seed from YAML during dev.
5. **AI matching as optional layer** — MVP works with keyword matching; AI enhancement comes in Phase 1.5.
