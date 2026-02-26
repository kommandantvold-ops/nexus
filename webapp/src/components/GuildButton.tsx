"use client";

const guildNames: Record<string, string> = {
  samphun: "SAMPHUN Hive",
  transport: "Transport Hive",
  symbiosis: "Symbiosis Hive",
};

export default function GuildButton({ category }: { category: string }) {
  return (
    <button
      onClick={() => {
        const name = guildNames[category] || category;
        alert(
          `🏛️ ${name}\n\nGuild channels coming soon!\n\nFor now, join the conversation on GitHub:\nhttps://github.com/kommandantvold-ops/nexus/discussions`
        );
      }}
      className="text-xs border border-amber-300 hover:border-amber-500 hover:bg-amber-100 px-3 py-1 rounded-full transition text-amber-700"
    >
      🏛️ Join {guildNames[category] || "Guild"}
    </button>
  );
}
