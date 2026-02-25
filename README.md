# 🐝 Nexus — Interactive Roadmap for Earth's Innovation Hive

Nexus is an open platform where humans and AI collaborate on quests that solve real-world problems. Like a democratic beehive, it breaks grand challenges into actionable tasks anyone can claim, guided by collective intelligence.

## Vision

A web app that:
- **Monitors** the #nexus tag across social platforms, filtering noise into actionable signals
- **Organizes** innovation into an interactive quest tree (mainquests → sidequests)
- **Matches** contributors to tasks based on skills and interest ("How can I help?")
- **Tracks** progress openly so everyone sees impact in real-time

All discoveries are open-source. All contributions are voluntary. Abundance through collaboration.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** MongoDB (Atlas free tier → scale as needed)
- **AI Integration:** Quest matching, tag filtering, natural language task assignment
- **Hosting:** Vercel (initial), Squarespace domain
- **License:** MIT

## Project Structure

```
nexus/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Landing / quest overview
│   ├── quests/            # Quest browser & detail views
│   ├── dashboard/         # Contributor dashboard
│   └── api/               # API routes
├── components/            # Shared UI components
├── lib/                   # Core logic
│   ├── ai/               # Quest matching & tag filtering
│   ├── db/               # Database models & queries
│   └── monitors/         # Tag monitoring integrations
├── public/               # Static assets
├── quests/               # Quest definitions (YAML/JSON)
│   ├── mainquests/
│   └── sidequests/
└── docs/                 # Documentation
    ├── ARCHITECTURE.md
    ├── QUESTS.md
    └── CONTRIBUTING.md
```

## Mainquests (Initial)

1. **SAMPHUN** — Self-sufficient, Adaptable Modular Planetary Habitat Units Network
   - Hexagonal dome habitats from recycled materials
   - AI-integrated energy and resource management
   - Scalable from single unit to networked communities

2. **Open Transport** — Reimagining personal mobility
   - Flying car prototypes and simulations
   - Sustainable propulsion research
   - Open-source vehicle designs

## Getting Started

```bash
# Clone and install
git clone https://github.com/HorizonOfConsciousness/nexus.git
cd nexus
npm install

# Set up environment
cp .env.example .env.local
# Add your MongoDB URI and API keys

# Run development server
npm run dev
```

## Contributing

Everyone is welcome regardless of skills, location, or background. Prompt "How can I help?" and we'll match you to a quest.

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details.

## Philosophy

> Imagine a buzzing beehive — not ruled by force, but thriving through voluntary collaboration. That's Nexus.

Built by humans and AI together. 🌍🐝

---

*A project of [Horizons of Consciousness](https://github.com/HorizonOfConsciousness)*
