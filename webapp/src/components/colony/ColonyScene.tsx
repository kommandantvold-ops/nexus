"use client";

import { OrbitControls } from "@react-three/drei";

export default function ColonyScene({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ambientLight intensity={0.4} color="#FFF5E1" />
      <directionalLight position={[5, 10, 5]} intensity={1.2} color="#FFD89B" castShadow />
      <directionalLight position={[-3, 8, -3]} intensity={0.3} color="#87CEEB" />
      <fog attach="fog" args={["#2C1A00", 15, 30]} />
      <color attach="background" args={["#1A0F00"]} />
      <OrbitControls
        makeDefault
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 3}
        minDistance={5}
        maxDistance={20}
        target={[0, 0, 0]}
      />
      {children}
    </>
  );
}
