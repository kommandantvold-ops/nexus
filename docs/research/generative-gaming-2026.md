# Generative Gaming AI Research (Feb 2026)

## Key Players

### Google DeepMind — Genie 3 / Project Genie
- **What:** World model that generates interactive 3D environments from text/image prompts
- **How:** Learns physics implicitly from video data — predicts what physics would produce rather than simulating it
- **Access:** Google Labs, AI Ultra subscribers (US). API not yet public
- **Strengths:** Most advanced world model, generates explorable 3D worlds in seconds
- **Limitations:** Short sessions (minutes), 720p, cloud-only, US-only currently
- **Relevance:** Closest to "generate a problem scenario from a quest description"
- **URL:** https://deepmind.google/models/genie/

### Rosebud AI ⭐ (Recommended for Nexus)
- **What:** Browser-based prompt-to-game platform using Three.js + GPT-4 + Stable Diffusion
- **How:** "Vibe coding" — describe what you want, AI generates code + assets + logic
- **Access:** Free tier, browser-based, instant deploy
- **Strengths:** JavaScript/browser-native, already integrating Genie 3, embeddable
- **Limitations:** Generated games are simpler than traditional engines
- **Relevance:** Could embed directly in nexuscreative.net, same tech stack
- **URL:** https://rosebud.ai
- **Genie 3 integration:** https://lab.rosebud.ai/blog/google-genie-3-the-world-model-that-turns-prompts-into-playable-worlds

### Unity AI (launching GDC March 2026)
- **What:** "Prompt-to-full-casual-game" beta, native to Unity engine
- **How:** Natural language → full casual game within Unity runtime
- **Access:** Beta at GDC 2026, broader rollout unclear
- **Strengths:** Full engine integration, professional-grade output
- **Limitations:** Closed ecosystem, not browser-native, aimed at shipping games
- **Relevance:** Good long-term option but locked into Unity

### Roblox AI
- **What:** Natural language → functioning in-game 3D models
- **How:** Built into Roblox platform
- **Strengths:** Massive existing player base
- **Limitations:** Locked into Roblox ecosystem
- **Relevance:** Low — wrong platform for our use case

## Recommended Architecture for Nexus Sandbox

### Phase 1: Rosebud AI Integration
- Embed Rosebud-generated scenarios in quest pages
- Feed quest parameters as prompts to generate sandbox environments
- Example: SQ-AQ-001 → "Design a water filtration system for a village with contaminated groundwater using ceramic, sand, and biochar"
- Bees explore and experiment in-browser
- AI generates new angles/complications dynamically

### Phase 2: Genie 3 API (when available)
- Upgrade to world model for richer 3D environments
- Rosebud is already building this bridge — we ride their integration
- More realistic physics simulation via learned priors

### Phase 3: Custom World Templates
- Build quest-specific sandbox templates
- Each mainquest category gets a base environment
- AQUA → water systems, terrain, weather
- SAMPHUN → structural loads, materials, building
- Open Transport → aerodynamics, propulsion, terrain

### Key Insight
The "generative" aspect is critical for Nexus: instead of hand-crafting scenarios, the AI generates *new angles* to problems on the fly. A bee working on water filtration might get:
- "What if the soil is clay-heavy and clogs your filter?"
- "What if you need to filter for heavy metals, not just sediment?"
- "What if the community is nomadic and needs a portable solution?"
This turns a static quest into an infinite problem space.

## Market Context
- AI in gaming market: $4.54B (2025) → projected $81.19B by 2035
- 90% of game developers now integrate AI into workflows (Google Cloud/Harris Poll)
- "World models" are the convergence point — physics learned from video, not coded

## Sources
- Jenova AI: https://www.jenova.ai/en/resources/ai-game-generator
- Unity GDC 2026: https://www.ingamenews.com/2026/02/unity-announces-ai-beta-for-prompt-to.html
- Rosebud World Models: https://lab.rosebud.ai/blog/world-models-path-to-ai-game-creation
- Google Genie 3: https://deepmind.google/models/genie/
- TechCrunch Project Genie: https://techcrunch.com/2026/01/29/i-built-marshmallow-castles-in-googles-new-ai-world-generator-project-genie/
