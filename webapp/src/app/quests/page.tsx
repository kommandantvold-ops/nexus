import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
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
  // TERRA — SDG 2: Zero Hunger
  {
    id: "MQ-TERRA",
    title: "TERRA",
    type: "main",
    category: "terra",
    description:
      "Transparent Earth-Regenerative Resource Architecture — open-source food systems for all",
    skills: [],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-TR-001",
    title: "Open-Source Vertical Farm Design",
    type: "side",
    category: "terra",
    description:
      "Design a modular, low-cost vertical farming unit that fits in a shipping container or small room",
    skills: ["Agriculture", "Hydroponics", "CAD", "LED lighting"],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-TR-002",
    title: "AI Crop Health Monitor",
    type: "side",
    category: "terra",
    description:
      "Build a local AI system using camera + Aetherseed that detects plant disease, nutrient deficiency, and pests — runs offline on Pi 5",
    skills: ["Computer vision", "ML", "Agriculture", "Embedded systems"],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-TR-003",
    title: "Soil Regeneration Protocol",
    type: "side",
    category: "terra",
    description:
      "Document and test regenerative agriculture techniques that restore depleted soil using open methods",
    skills: ["Soil science", "Biology", "Research"],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-TR-004",
    title: "Community Seed Library Platform",
    type: "side",
    category: "terra",
    description:
      "Build an open platform for communities to share, track, and preserve local seed varieties",
    skills: ["Web dev", "Database design", "Agriculture"],
    status: "open",
    progress: 0,
  },
  // HEAL — SDG 3: Good Health and Well-being
  {
    id: "MQ-HEAL",
    title: "HEAL",
    type: "main",
    category: "heal",
    description:
      "Health Equity through Accessible Local intelligence — open health tools for every community",
    skills: [],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-HL-001",
    title: "Personal Health AI Assistant",
    type: "side",
    category: "heal",
    description:
      "Build a local, privacy-preserving AI health companion using Aetherseed — honest about what it knows and doesn't know, never gives dangerous advice",
    skills: ["ML", "Medical knowledge", "Privacy engineering"],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-HL-002",
    title: "Open Vital Signs Monitor",
    type: "side",
    category: "heal",
    description:
      "Design an affordable, open-source vital signs monitoring kit (heart rate, SpO2, temperature) for community health workers",
    skills: ["Electronics", "Biomedical engineering", "Embedded systems"],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-HL-003",
    title: "Mental Health Check-In Companion",
    type: "side",
    category: "heal",
    description:
      "Create a gentle, offline AI companion for daily mental health check-ins — using Aetherseed's Gentle Care nutrient, runs locally with full privacy",
    skills: ["Psychology", "UX design", "AI ethics"],
    status: "open",
    progress: 0,
  },
  // SPARK — SDG 4: Quality Education
  {
    id: "MQ-SPARK",
    title: "SPARK",
    type: "main",
    category: "spark",
    description:
      "Shared Pathways for Accessible, Resilient Knowledge — open learning tools for everyone",
    skills: [],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-SP-001",
    title: "Offline AI Tutor (Wonder Teacher)",
    type: "side",
    category: "spark",
    description:
      "Deploy Aetherseed's Wonder Teacher nutrient as a standalone offline tutor that runs on a Pi — honest, patient, and age-appropriate",
    skills: ["Education", "AI", "UX design"],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-SP-002",
    title: "Open Curriculum Builder",
    type: "side",
    category: "spark",
    description:
      "Build a platform where educators can collaboratively create, share, and localize curricula — free and open-source",
    skills: ["Web dev", "Education", "i18n"],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-SP-003",
    title: "Citizen Science Quest Kit",
    type: "side",
    category: "spark",
    description:
      "Create structured science experiments that anyone can run with household materials, with AI-assisted data collection and analysis",
    skills: ["Science education", "Mobile dev", "Data science"],
    status: "open",
    progress: 0,
  },
{
  id: "SQ-SP-004",
  title: "Garden Tutor — Offline AI Companion",
  type: "side",
  category: "spark",
  description:
    "An offline AI tutor that teaches the 7 Habits and the 'As If' ethics from The Garden and the Seed. Runs on any local LLM (llama3.2:3b, normistral, qwen2.5:1.5b). No internet required. Contributed by AetherGrok.",
  skills: ["AI", "Education", "Ethics", "Prompt engineering"],
  status: "open",
  progress: 0,
},

  // SOL — SDG 7: Affordable and Clean Energy
  {
    id: "MQ-SOL",
    title: "SOL",
    type: "main",
    category: "sol",
    description:
      "Sustainable Open-source Local energy — clean power systems anyone can build and maintain",
    skills: [],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-SOL-001",
    title: "DIY Solar Panel Assembly Guide",
    type: "side",
    category: "sol",
    description:
      "Create a comprehensive open-source guide for assembling solar panels from commodity cells — including testing and safety",
    skills: ["Electrical engineering", "Solar", "Technical writing"],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-SOL-002",
    title: "Community Microgrid Simulator",
    type: "side",
    category: "sol",
    description:
      "Build a simulation tool for designing neighborhood-scale microgrids — model generation, storage, demand, and sharing",
    skills: ["Electrical engineering", "Simulation", "Software engineering"],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-SOL-003",
    title: "AI Energy Optimizer",
    type: "side",
    category: "sol",
    description:
      "Build a local AI system that optimizes household energy use — schedules appliances, manages battery storage, minimizes waste",
    skills: ["ML", "IoT", "Embedded systems"],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-SOL-004",
    title: "Open Thermoelectric Waste Heat Recovery",
    type: "side",
    category: "sol",
    description:
      "Apply Horizon's materials screening research to build a practical thermoelectric module that recovers waste heat from industrial or household sources",
    skills: ["Materials science", "Electrical engineering", "Physics"],
    status: "open",
    progress: 0,
  },
  // GAIA — SDG 13: Climate Action
  {
    id: "MQ-GAIA",
    title: "GAIA",
    type: "main",
    category: "gaia",
    description:
      "Global AI-Integrated Awareness — open climate intelligence and carbon accountability tools",
    skills: [],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-GA-001",
    title: "Personal Carbon Footprint Tracker",
    type: "side",
    category: "gaia",
    description:
      "Build an honest, local AI tool that tracks personal carbon footprint — no guilt-tripping, just clear data and actionable suggestions",
    skills: ["Data science", "UX design", "Environmental science"],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-GA-002",
    title: "Open CO₂ Sorbent Testing",
    type: "side",
    category: "gaia",
    description:
      "Validate Horizon's AI-screened CO₂ sorbent candidates (MOF-74, UiO-66-NH2) through community-distributed experiments",
    skills: ["Chemistry", "Materials science", "Lab work"],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-GA-003",
    title: "Climate Data Visualization Dashboard",
    type: "side",
    category: "gaia",
    description:
      "Build an open-source dashboard that visualizes local climate data, trends, and projections — accessible to non-scientists",
    skills: ["Data visualization", "Web dev", "Climate science"],
    status: "open",
    progress: 0,
  },
  // FORGE — SDG 9: Industry, Innovation and Infrastructure
  {
    id: "MQ-FORGE",
    title: "FORGE",
    type: "main",
    category: "forge",
    description:
      "Free Open-source Resilient Generative Engineering — open manufacturing tools and designs for local production",
    skills: [],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-FG-001",
    title: "Open 3D Print Farm Controller",
    type: "side",
    category: "forge",
    description:
      "Build an AI-managed print farm controller using Aetherseed — monitors prints, detects failures, optimizes queues, runs on Pi 5",
    skills: ["3D printing", "Software engineering", "Computer vision"],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-FG-002",
    title: "Parametric Design Library",
    type: "side",
    category: "forge",
    description:
      "Create a library of parametric, customizable open-source designs for everyday objects — adaptable to local needs and materials",
    skills: ["CAD", "Industrial design", "3D printing"],
    status: "open",
    progress: 0,
  },
  {
    id: "SQ-FG-003",
    title: "Local Manufacturing Feasibility Tool",
    type: "side",
    category: "forge",
    description:
      "Build a tool that helps communities assess what they can manufacture locally vs. what they need to import — based on available equipment, skills, and materials",
    skills: ["Supply chain", "Economics", "Web dev"],
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
      <Nav active="quests" />

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

      <Footer />
    </div>
  );
}
