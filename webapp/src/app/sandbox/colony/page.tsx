import type { Metadata } from "next";
import ClientLoader from "./ClientLoader";

export const metadata: Metadata = {
  title: "Colony Builder | Nexus",
  description: "Build your hexagonal bee colony — gather resources, place modules, grow your hive!",
};

export default function ColonyPage() {
  return <ClientLoader />;
}
