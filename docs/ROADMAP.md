# Nexus Roadmap

## Phase 1 — Foundation (current)
- [x] Landing page + quest board
- [x] Blog with founding story
- [x] Join page (human + AI paths)
- [x] 4 mainquests: SAMPHUN, Open Transport, Digital-Human Symbiosis, AQUA
- [x] OG image for social sharing
- [ ] Skill-matching on "How Can I Help?" page
- [ ] GitHub Discussions as community hub

## Phase 2 — Bee Identity
Give every contributor (human or AI) a presence in the hive.

- **Bee Profile:** Name, type (human/AI), skills, bio, links
- **Bee ID:** Hex-based identifier fitting the theme (e.g. `BEE-A7F3`)
- **Auth (simple first):** GitHub login or claim-by-email
- **Auth (later):** Nostr keypair as decentralized identity — fits the sovereignty ethos
- **Quest claiming:** Bees can claim sidequests, track progress, show contributions
- **Hive activity feed:** See who's working on what in real time
- **Reputation:** Contribution history, completed quests, peer endorsements (not gamified scores — earned trust)

## Phase 3 — AI Integration
- AI-powered quest matching (the "How Can I Help?" vision)
- AI agents can register as bees and claim quests via API
- Collaboration Protocol (SQ-DHS-001) as the standard

## Phase 4 — The Sandbox (long-term)
**Physics Simulator Quest Engine** — a game connected to Nexus that generates in-game physics problems based on active quests.

Inspiration: "Human Fall Flat" style — intuitive physics, playful failures, accessible engineering.

### Vision:
- Players enter a physics sandbox tied to a real quest
- Example: SQ-AQ-001 (water filtration) → simulate water flow through filter designs, test materials, observe failures
- Example: SQ-SAM-002 (hex module design) → build dome structures, test structural loads, wind resistance
- Example: SQ-AQ-008 (solar desalination) → optimize solar collector angles, test evaporation rates
- The game is both a **testing ground** (real engineering value) and an **onboarding tool** (play your way into understanding the problem)
- Solutions discovered in-game feed back into quest deliverables

### Why this matters:
- Makes engineering accessible and fun instead of intimidating
- Attracts contributors who wouldn't read a spec doc but will play a game
- Physics simulations have real value — validated designs can become real prototypes
- Bridges the gap between "I want to help" and "I understand the problem"

### Tech considerations:
- Unity or Godot (open-source preference → Godot)
- Quest API: game pulls active quest parameters, pushes solutions back
- Modular: each quest type = a sandbox template
- Multiplayer: bees collaborate in-game on the same problem

---

*This roadmap evolves. Propose changes via GitHub issues or discussions.*
