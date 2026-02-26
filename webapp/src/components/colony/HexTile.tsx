"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { axialToPixel, HEX_SIZE } from "./hexUtils";
import type { HexTile as HexTileData } from "./gameTypes";

const COLORS: Record<string, string> = {
  empty: "#8B7355",
  "hive-core": "#FFD700",
  forest: "#2D5A27",
  clay: "#A0522D",
  metal: "#708090",
  housing: "#DAA520",
  farm: "#228B22",
  solar: "#4169E1",
  "water-collector": "#4682B4",
  workshop: "#8B4513",
  fog: "#555555",
};

// Create pointy-top hex shape
function createHexShape(size: number): THREE.Shape {
  const shape = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = size * Math.cos(angle);
    const y = size * Math.sin(angle);
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

interface Props {
  tile: HexTileData;
  isSelected: boolean;
  isBeeHere: boolean;
  isAdjToBee: boolean;
  onClick: () => void;
}

export default function HexTile({ tile, isSelected, isBeeHere, isAdjToBee, onClick }: Props) {
  const ref = useRef<THREE.Group>(null);
  const [x, , z] = axialToPixel(tile.q, tile.r);
  const hexShape = useMemo(() => createHexShape(HEX_SIZE * 0.95), []);

  const height = tile.type === "hive-core" ? 0.4 : tile.type === "fog" ? 0.05 : 0.2;
  const color = COLORS[tile.type] || "#8B7355";
  const opacity = tile.type === "fog" ? 0.3 : 1;

  return (
    <group ref={ref} position={[x, 0, z]} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* Base hex tile */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, height / 2, 0]}>
        <extrudeGeometry args={[hexShape, { depth: height, bevelEnabled: false }]} />
        <meshStandardMaterial
          color={isSelected ? "#FFE4B5" : color}
          transparent={opacity < 1}
          opacity={opacity}
        />
      </mesh>

      {/* Selection ring */}
      {isAdjToBee && tile.type !== "fog" && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, height + 0.02, 0]}>
          <ringGeometry args={[HEX_SIZE * 0.7, HEX_SIZE * 0.85, 6]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.4} />
        </mesh>
      )}

      {/* Module models */}
      {tile.type === "housing" && (
        <mesh position={[0, height + 0.3, 0]}>
          <sphereGeometry args={[0.4, 8, 6]} />
          <meshStandardMaterial color="#DAA520" />
        </mesh>
      )}
      {tile.type === "farm" && (
        <group position={[0, height + 0.05, 0]}>
          {[-0.3, 0, 0.3].map((zz, i) => (
            <mesh key={i} position={[0, 0.05, zz]}>
              <boxGeometry args={[0.8, 0.1, 0.15]} />
              <meshStandardMaterial color="#32CD32" />
            </mesh>
          ))}
        </group>
      )}
      {tile.type === "solar" && (
        <group position={[0, height, 0]}>
          <mesh position={[0, 0.35, 0]}>
            <boxGeometry args={[0.8, 0.05, 0.6]} />
            <meshStandardMaterial color="#6495ED" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.17, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.35]} />
            <meshStandardMaterial color="#888" />
          </mesh>
        </group>
      )}
      {tile.type === "water-collector" && (
        <mesh position={[0, height + 0.15, 0]}>
          <cylinderGeometry args={[0.5, 0.3, 0.3, 8]} />
          <meshStandardMaterial color="#4682B4" transparent opacity={0.8} />
        </mesh>
      )}
      {tile.type === "workshop" && (
        <group position={[0, height, 0]}>
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[0.6, 0.5, 0.6]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[0, 0.55, 0]}>
            <coneGeometry args={[0.45, 0.3, 4]} />
            <meshStandardMaterial color="#A0522D" />
          </mesh>
        </group>
      )}
      {tile.type === "hive-core" && (
        <mesh position={[0, height + 0.4, 0]}>
          <octahedronGeometry args={[0.45]} />
          <meshStandardMaterial color="#FFD700" emissive="#FF8C00" emissiveIntensity={0.5} />
        </mesh>
      )}
      {/* Trees for forest */}
      {tile.type === "forest" && (
        <group position={[0, height, 0]}>
          {[[-0.3, 0.2], [0.2, -0.2], [0.0, 0.0]].map(([tx, tz], i) => (
            <group key={i} position={[tx, 0, tz]}>
              <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.03, 0.04, 0.4]} />
                <meshStandardMaterial color="#5C4033" />
              </mesh>
              <mesh position={[0, 0.5, 0]}>
                <coneGeometry args={[0.2, 0.4, 6]} />
                <meshStandardMaterial color="#228B22" />
              </mesh>
            </group>
          ))}
        </group>
      )}
      {/* Clay deposit - rocks */}
      {tile.type === "clay" && (
        <group position={[0, height, 0]}>
          <mesh position={[-0.2, 0.1, 0.1]}>
            <sphereGeometry args={[0.15, 5, 4]} />
            <meshStandardMaterial color="#CD853F" />
          </mesh>
          <mesh position={[0.2, 0.08, -0.1]}>
            <sphereGeometry args={[0.12, 5, 4]} />
            <meshStandardMaterial color="#D2691E" />
          </mesh>
        </group>
      )}
      {/* Metal vein - crystals */}
      {tile.type === "metal" && (
        <group position={[0, height, 0]}>
          <mesh position={[0, 0.2, 0]} rotation={[0.2, 0, 0.1]}>
            <octahedronGeometry args={[0.2]} />
            <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0.25, 0.12, 0.1]} rotation={[0, 0.5, 0.3]}>
            <octahedronGeometry args={[0.12]} />
            <meshStandardMaterial color="#A8A8A8" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      )}
    </group>
  );
}
