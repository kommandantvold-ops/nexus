# Nexus Sandbox — Build vs Integrate Analysis

## The Core Idea
A consistent physics sandbox environment where quest parameters define the *problem*, but the world feels the same every time. Like Human Fall Flat — same wobbly character, same art style, different level. The AI generates new *angles* and *complications*, not entirely new universes.

## Option A: Build Our Own (Recommended)

### Why
- **Consistent theme** — same art style, controls, world across all quests
- **Quest-aware** — deeply integrated with Nexus quest data
- **Open source** — MIT, community can extend it
- **No vendor lock-in** — we own everything
- **Embeddable** — runs on nexuscreative.net directly

### Recommended Stack

**React Three Fiber + Rapier** (our webapp is already Next.js/React)

| Layer | Tech | Why |
|-------|------|-----|
| 3D Rendering | React Three Fiber (Three.js) | Same React stack as our webapp |
| Physics | @react-three/rapier (Rust/WASM) | Fast, accurate, browser-native |
| AI Scene Generation | LLM (API call) | Generates scenario JSON from quest description |
| Art Style | Low-poly with consistent palette | Warm amber/honey tones matching Nexus brand |
| Player Controls | First-person or third-person | Consistent across all quests |
| UI | React overlays | Meters, scores, objectives |

### How the AI Part Works
The AI doesn't generate the *engine* — it generates *scenario configs*:

```json
{
  "quest_id": "SQ-AQ-001",
  "scenario": "Village Water Filtration",
  "environment": {
    "terrain": "riverside_village",
    "water_source": { "type": "river", "contamination": ["sediment", "bacteria"] },
    "weather": "dry_season"
  },
  "available_materials": ["ceramic_clay", "sand", "gravel", "biochar", "pvc_pipe"],
  "objectives": [
    { "goal": "Build filter achieving >80% purity", "metric": "water_quality" },
    { "goal": "Process 100L within time limit", "metric": "flow_rate" }
  ],
  "complications": [
    { "trigger": "after_first_success", "event": "Heavy rain increases turbidity by 3x" },
    { "trigger": "random", "event": "Only local clay available — no commercial ceramic" }
  ]
}
```

The LLM generates these configs. The engine interprets them. Same engine, infinite scenarios.

### Development Phases

**Phase 1: Core Engine (MVP)**
- Fixed sandbox environment (one biome: riverside village)
- Basic physics: water flow, gravity, material placement
- One quest type: water filtration (SQ-AQ-001)
- Simple objective system
- Works in browser via iframe on quest page

**Phase 2: Quest Templates**
- AQUA template (water systems, terrain, weather)
- SAMPHUN template (structural loads, building materials, wind)
- Transport template (aerodynamics, propulsion)
- LLM generates scenario configs per quest

**Phase 3: Dynamic Complications**
- AI introduces new constraints mid-session
- "What if the soil is clay?" "What if it's monsoon season?"
- Adapts difficulty based on player performance

**Phase 4: Multiplayer**
- Multiple bees collaborate in same sandbox
- Real-time problem solving
- Solutions feed back to quest deliverables

### Effort Estimate
- Phase 1 MVP: ~2-4 weeks (experienced dev) or sub-agent sprint
- Phase 2: ~2-4 weeks per template
- Phase 3-4: Longer term

### Key Dependencies
- `@react-three/fiber` — React renderer for Three.js
- `@react-three/rapier` — Rapier physics bindings
- `@react-three/drei` — Helpers (controls, environment, etc.)
- Any LLM API for scenario generation

## Option B: Integrate Rosebud AI

### Pros
- Zero engine development
- Already works
- Large community (2.1M+ games)

### Cons
- **No consistent theme** — every generation looks different
- **No deep quest integration** — we'd have to prompt-engineer every scenario
- **Vendor dependency** — they could change terms, pricing, availability
- **Limited physics** — more game-like than simulation
- **Can't embed cleanly** — separate platform, not part of nexuscreative.net
- **Not open source**

### Verdict
Good for inspiration and prototyping. Not suitable as the Nexus sandbox long-term.

## Option C: Godot (WebAssembly)

### Pros
- Professional game engine, open source (MIT)
- Jolt physics engine (as of 4.4)
- Exports to HTML5/WebAssembly
- GDScript is approachable
- Massive community

### Cons
- Different tech stack from our webapp (not React)
- Harder to embed seamlessly
- Heavier initial load
- Steeper learning curve for web integration
- Build pipeline more complex (compile → deploy WASM)

### Verdict
Better for standalone game. Worse for embedded web sandbox.

## Recommendation

**Build our own with React Three Fiber + Rapier.**

Reasons:
1. Same stack as nexuscreative.net (React/Next.js) — one codebase
2. Consistent theme baked into the engine, not generated per-run
3. AI generates *scenario configs*, not entire games — much more reliable
4. Open source, community-extensible
5. Embeddable directly in quest pages
6. The "generative" part is the problem definition, not the engine itself

**Fallback:** If building our own proves too resource-intensive in Phase 1, integrate Rosebud for prototyping while we develop the custom engine in parallel.

## Sources
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber
- @react-three/rapier: https://github.com/pmndrs/react-three-rapier
- Rapier physics: https://rapier.rs/
- LLM game generation research: https://arxiv.org/abs/2404.08706
- Godot 4.4 Jolt physics: https://godotengine.org/
- Three.js Journey (physics tutorials): https://threejs-journey.com/lessons/physics
