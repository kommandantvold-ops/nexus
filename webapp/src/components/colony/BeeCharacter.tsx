"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { axialToPixel } from "./hexUtils";

interface Props {
  q: number;
  r: number;
}

export default function BeeCharacter({ q, r }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const targetPos = axialToPixel(q, r);
  const wingRef1 = useRef<THREE.Mesh>(null);
  const wingRef2 = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const target = new THREE.Vector3(targetPos[0], 0.7, targetPos[2]);
    groupRef.current.position.lerp(target, Math.min(1, delta * 8));

    // Wing flap
    const t = Date.now() * 0.015;
    if (wingRef1.current) wingRef1.current.rotation.z = Math.sin(t) * 0.5 + 0.3;
    if (wingRef2.current) wingRef2.current.rotation.z = -Math.sin(t) * 0.5 - 0.3;
  });

  return (
    <group ref={groupRef} position={[targetPos[0], 0.7, targetPos[2]]}>
      {/* Body */}
      <mesh position={[0, 0.2, 0]}>
        <capsuleGeometry args={[0.15, 0.3, 4, 8]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      {/* Stripes */}
      <mesh position={[0, 0.15, 0]}>
        <torusGeometry args={[0.155, 0.03, 8, 16]} />
        <meshStandardMaterial color="#2C1A00" />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <torusGeometry args={[0.14, 0.03, 8, 16]} />
        <meshStandardMaterial color="#2C1A00" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.13, 8, 8]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.06, 0.58, 0.1]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[-0.06, 0.58, 0.1]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {/* Antennae */}
      <mesh position={[0.05, 0.7, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.01, 0.01, 0.2]} />
        <meshStandardMaterial color="#2C1A00" />
      </mesh>
      <mesh position={[-0.05, 0.7, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.01, 0.01, 0.2]} />
        <meshStandardMaterial color="#2C1A00" />
      </mesh>
      {/* Wings */}
      <mesh ref={wingRef1} position={[0.2, 0.35, -0.05]}>
        <planeGeometry args={[0.25, 0.15]} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={wingRef2} position={[-0.2, 0.35, -0.05]}>
        <planeGeometry args={[0.25, 0.15]} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
