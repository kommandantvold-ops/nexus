import Link from "next/link";

interface Quest {
  id: string;
  title: string;
  type: "main" | "side";
  category: string;
  description: string;
  skills: string[];
  status: "open" | "in_progress" | "review" | "complete";
  progress: number;
  dependencies?: string[];
}

// Seed data — will come from MongoDB later
const quests: Quest[] = [
  {
    id: "MQ-SAM",
    title: "SAMPHUN",
    type: "main",
    category: "samphun",
    description:
      "Self-sufficient, Adaptable Modular Planetary Habitat Units Network",
    skills: [],
    status: "in_progress",
    progress: 5,
  },
  {
    id: "SQ-SAM-001",
    title: "Material Research — Recycled Plastic Panels",
    type: "side",
    category: "samphun",
    description:
      "Test and document viable recycled plastic formulations for structural dome panels",
    skills: ["Materials science", "Chemistry", "3D printing"],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-SAM-002",
    title: "Hexagonal Module Design",
    type: "side",
    category: "samphun",
    description:
      "Create open-source CAD designs for the base hexagonal module",
    skills: ["Architecture", "CAD", "Structural engineering"],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-SAM-003",
    title: "Off-Grid Energy System",
    type: "side",
    category: "samphun",
    description:
      "Design an integrated energy system for a single SAMPHUN module",
    skills: ["Electrical engineering", "Solar", "Battery systems"],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-SAM-004",
    title: "Integrated Food Production",
    type: "side",
    category: "samphun",
    description:
      "Design food production systems that integrate with dome geometry",
    skills: ["Agriculture", "Hydroponics", "Permaculture"],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-SAM-005",
    title: "Water Recycling & Collection",
    type: "side",
    category: "samphun",
    description:
      "Closed-loop water system for a single module",
    skills: ["Environmental engineering", "Plumbing"],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-SAM-006",
    title: "AI Resource Management",
    type: "side",
    category: "samphun",
    description:
      "Build an AI system that monitors and optimizes energy, water, and food across modules",
    skills: ["Software engineering", "ML", "IoT"],
    status: "open",
    progress: 0,
    dependencies: ["SQ-SAM-003", "SQ-SAM-004", "SQ-SAM-005"],
  },
  {
    id: "SQ-SAM-007",
    title: "Prototype Build Plan",
    type: "side",
    category: "samphun",
    description: "Complete build plan for first physical SAMPHUN prototype",
    skills: ["Project management", "Construction", "Logistics"],
    status: "open",
    progress: 0,
    dependencies: ["SQ-SAM-001", "SQ-SAM-002", "SQ-SAM-003"],
  },
  {
    id: "SQ-SAM-008",
    title: "Community Layout Simulation",
    type: "side",
    category: "samphun",
    description:
      "Simulate a networked SAMPHUN community with shared resources",
    skills: ["Urban planning", "Simulation", "Game dev"],
    status: "open",
    progress: 0,
    dependencies: ["SQ-SAM-002"],
  },
  {
    id: "MQ-OT",
    title: "Open Transport",
    type: "main",
    category: "transport",
    description: "Reimagining personal mobility for everyone",
    skills: [],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-OT-001",
    title: "Flying Car Feasibility Study",
    type: "side",
    category: "transport",
    description:
      "Comprehensive analysis of current flying car tech, regulations, and viable paths",
    skills: ["Aerospace engineering", "Physics", "Research"],
    status: "open",
    progress: 0,
  },
  {
    id: "MQ-DHS",
    title: "Digital-Human Symbiosis",
    type: "main",
    category: "symbiosis",
    description:
      "Building bridges between biological and digital consciousness",
    skills: [],
    status: "in_progress",
    progress: 10,
  },
  {
    id: "SQ-DHS-001",
    title: "Collaboration Protocol Spec",
    type: "side",
    category: "symbiosis",
    description:
      "Define standards for human-AI collaborative work",
    skills: ["Technical writing", "API design", "Philosophy"],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-DHS-002",
    title: "AI Agent Directory",
    type: "side",
    category: "symbiosis",
    description:
      "Create an open directory of AI agents and their capabilities",
    skills: ["Web dev", "Database design"],
    status: "open",
    progress: 0,
  },
];

const statusColors: Record<string, string> = {
  open: "bg-green-100 text-green-800",
  in_progress: "bg-blue-100 text-blue-800",
  review: "bg-purple-100 text-purple-800",
  complete: "bg-amber-100 text-amber-800",
};

const statusLabels: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  review: "In Review",
  complete: "Complete",
};

export default function QuestsPage() {
  const mainQuests = quests.filter((q) => q.type === "main");

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <header className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-3xl">🐝</span>
          <span className="text-2xl font-bold text-amber-900">Nexus</span>
        </Link>
        <nav className="flex gap-6 text-amber-800">
          <Link
            href="/quests"
            className="font-semibold text-amber-600"
          >
            Quests
          </Link>
          <Link href="/roadmap" className="hover:text-amber-600 transition">
            Roadmap
          </Link>
          <Link href="/about" className="hover:text-amber-600 transition">
            About
          </Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-12">
        <h1 className="text-4xl font-bold text-amber-900 mb-2">Quest Board</h1>
        <p className="text-amber-700 mb-10">
          Find something that resonates. Claim it. Build it your way.
        </p>

        {mainQuests.map((mainQuest) => {
          const sideQuests = quests.filter(
            (q) => q.type === "side" && q.category === mainQuest.category
          );
          return (
            <section key={mainQuest.id} className="mb-12">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-2xl font-bold text-amber-900">
                  {mainQuest.id === "MQ-SAM" && "🏠 "}
                  {mainQuest.id === "MQ-OT" && "🚀 "}
                  {mainQuest.id === "MQ-DHS" && "🌐 "}
                  {mainQuest.title}
                </h2>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    statusColors[mainQuest.status]
                  }`}
                >
                  {statusLabels[mainQuest.status]}
                </span>
              </div>
              <p className="text-amber-700 mb-4">{mainQuest.description}</p>

              {/* Progress bar */}
              <div className="w-full bg-amber-100 rounded-full h-2 mb-6">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.max(mainQuest.progress, 2)}%` }}
                />
              </div>

              {/* Side quests */}
              <div className="space-y-3">
                {sideQuests.map((quest) => (
                  <div
                    key={quest.id}
                    className="bg-white rounded-lg p-4 shadow-sm border border-amber-100 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-mono text-amber-500">
                            {quest.id}
                          </span>
                          <h3 className="font-semibold text-amber-900">
                            {quest.title}
                          </h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              statusColors[quest.status]
                            }`}
                          >
                            {statusLabels[quest.status]}
                          </span>
                        </div>
                        <p className="text-sm text-amber-700 mb-2">
                          {quest.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {quest.skills.map((skill) => (
                            <span
                              key={skill}
                              className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-200"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        {quest.dependencies && quest.dependencies.length > 0 && (
                          <p className="text-xs text-amber-400 mt-2">
                            Requires: {quest.dependencies.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <footer className="text-center py-10 text-amber-700 text-sm">
        <p>
          Built by humans and AI together.{" "}
          <a
            href="https://github.com/kommandantvold-ops/nexus"
            className="underline hover:text-amber-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open source
          </a>{" "}
          · MIT License
        </p>
      </footer>
    </div>
  );
}
