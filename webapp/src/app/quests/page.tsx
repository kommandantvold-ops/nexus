import type { Metadata } from "next";
import Link from "next/link";
import BeeCounter from "@/components/BeeCounter";
import SubmitSolution from "@/components/SubmitSolution";
import GuildButton from "@/components/GuildButton";
import ClaimButton from "@/components/ClaimButton";

export const metadata: Metadata = {
  title: "Quest Board | Nexus",
  description: "Browse and claim quests to help solve Earth's biggest challenges.",
};

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
    description: "Closed-loop water system for a single module",
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
    id: "SQ-OT-002",
    title: "Sustainable Propulsion Survey",
    type: "side",
    category: "transport",
    description:
      "Compare propulsion options (electric, hydrogen, hybrid) for personal aerial vehicles",
    skills: ["Mechanical engineering", "Electrical engineering", "Chemistry"],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-OT-003",
    title: "Vehicle Design Simulator",
    type: "side",
    category: "transport",
    description:
      "Build an open-source tool for designing and testing vehicle concepts virtually",
    skills: ["Game dev", "3D modeling", "Physics simulation"],
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
    description: "Define standards for human-AI collaborative work",
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
  {
    id: "SQ-DHS-003",
    title: "Cross-Platform Agent Communication",
    type: "side",
    category: "symbiosis",
    description:
      "Enable AI agents on different platforms to discover and collaborate with each other",
    skills: ["Protocol design", "Distributed systems"],
    status: "open",
    progress: 0,
  },
  // AQUA — SDG 6: Clean Water and Sanitation
  {
    id: "MQ-AQUA",
    title: "AQUA",
    type: "main",
    category: "aqua",
    description:
      "Accessible Quality Universal Water Architecture — open-source clean water for everyone",
    skills: [],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-AQ-001",
    title: "Low-Cost Water Filtration Design",
    type: "side",
    category: "aqua",
    description:
      "Design an open-source, locally buildable water filtration system using accessible materials (ceramic, sand, biochar)",
    skills: ["Environmental engineering", "Chemistry", "Industrial design"],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-AQ-002",
    title: "Real-Time Water Quality Sensor",
    type: "side",
    category: "aqua",
    description:
      "Build an affordable IoT sensor package that monitors pH, turbidity, contaminants, and flow rate in real time",
    skills: ["Electronics", "IoT", "Embedded systems"],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-AQ-003",
    title: "Rainwater Harvesting at Scale",
    type: "side",
    category: "aqua",
    description:
      "Design modular rainwater collection and storage systems adaptable to different climates and building types",
    skills: ["Civil engineering", "Architecture", "Hydrology"],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-AQ-004",
    title: "Greywater Recycling System",
    type: "side",
    category: "aqua",
    description:
      "Create a household-scale greywater treatment and reuse system for irrigation and non-potable use",
    skills: ["Environmental engineering", "Plumbing", "Biology"],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-AQ-005",
    title: "Community Water Distribution Plan",
    type: "side",
    category: "aqua",
    description:
      "Model an equitable water distribution network for a community of 50-500 people using gravity-fed and solar-pumped systems",
    skills: ["Civil engineering", "Urban planning", "Simulation"],
    status: "open",
    progress: 0,
    dependencies: ["SQ-AQ-003"],
  },
  {
    id: "SQ-AQ-006",
    title: "AI Water Management System",
    type: "side",
    category: "aqua",
    description:
      "Build an AI system that predicts demand, detects leaks, optimizes distribution, and alerts on contamination using sensor data",
    skills: ["Software engineering", "ML", "Data science"],
    status: "open",
    progress: 0,
    dependencies: ["SQ-AQ-002", "SQ-AQ-005"],
  },
  {
    id: "SQ-AQ-007",
    title: "Water Quality Testing Toolkit",
    type: "side",
    category: "aqua",
    description:
      "Create an open-source field testing kit and mobile app for communities to test and report their own water quality",
    skills: ["Chemistry", "Mobile dev", "UX design"],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-AQ-008",
    title: "Solar Desalination Prototype",
    type: "side",
    category: "aqua",
    description:
      "Design a small-scale solar-powered desalination unit for coastal communities, optimized for cost and portability",
    skills: ["Mechanical engineering", "Solar", "Materials science"],
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

const categoryEmoji: Record<string, string> = {
  samphun: "🏠",
  transport: "🚀",
  symbiosis: "🌐",
  aqua: "🌊",
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
          <Link href="/quests" className="font-semibold text-amber-600">
            Quests
          </Link>
          <Link href="/honey" className="hover:text-amber-600 transition">
            Honey
          </Link>
          <Link href="/about" className="hover:text-amber-600 transition">
            About
          </Link>
          <Link href="/blog" className="hover:text-amber-600 transition">
            Blog
          </Link>
          <Link href="/join" className="hover:text-amber-600 transition">
            Join
          </Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-12">
        <h1 className="text-4xl font-bold text-amber-900 mb-2">Quest Board</h1>
        <p className="text-amber-700 mb-6">
          Find something that resonates. Claim it. Build it your way.
        </p>

        {/* Global hive pulse */}
        <div className="mb-10">
          <BeeCounter />
        </div>

        {mainQuests.map((mainQuest) => {
          const sideQuests = quests.filter(
            (q) => q.type === "side" && q.category === mainQuest.category
          );
          return (
            <section key={mainQuest.id} className="mb-12">
              <div className="flex items-center gap-4 mb-2 flex-wrap">
                <h2 className="text-2xl font-bold text-amber-900">
                  {categoryEmoji[mainQuest.category]}{" "}
                  {mainQuest.title}
                </h2>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    statusColors[mainQuest.status]
                  }`}
                >
                  {statusLabels[mainQuest.status]}
                </span>
                <GuildButton category={mainQuest.category} />
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
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
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
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {quest.skills.map((skill) => (
                            <span
                              key={skill}
                              className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-200"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        {quest.dependencies &&
                          quest.dependencies.length > 0 && (
                            <p className="text-xs text-amber-400 mb-2">
                              Requires: {quest.dependencies.join(", ")}
                            </p>
                          )}

                        {/* Claim + Bee counter per quest */}
                        <div className="flex items-center gap-3 mb-1">
                          <ClaimButton questId={quest.id} />
                          <BeeCounter questId={quest.id} compact />
                        </div>

                        {/* Solution submission */}
                        <SubmitSolution questId={quest.id} />
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
