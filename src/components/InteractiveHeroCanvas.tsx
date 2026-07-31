"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const particleCount = 1200;
  const positions = new Float32Array(particleCount * 3);

  // Initialize random point positions in a 3D grid
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
  }

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const positionAttribute = pointsRef.current.geometry.attributes.position;
    
    for (let i = 0; i < particleCount; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const zOriginal = positions[i * 3 + 2];
      
      // Multi-frequency wave calculation
      const wave = Math.sin(x * 0.4 + time * 0.5) * 0.3 + Math.cos(y * 0.4 + time * 0.3) * 0.3;
      
      // Calculate mouse displacement force
      const dx = mouse.x * 6 - x;
      const dy = mouse.y * 6 - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      const maxDist = 3.5;
      const force = Math.max(0, maxDist - dist) * 0.08;
      
      // Displace particles slightly away from mouse cursor on X and Y, and modulate Z height
      positionAttribute.setXYZ(
        i,
        x - (dx / (dist + 0.1)) * force,
        y - (dy / (dist + 0.1)) * force,
        zOriginal + wave + force * 2
      );
    }
    positionAttribute.needsUpdate = true;
    
    // Ambient rotations
    pointsRef.current.rotation.y = time * 0.015;
    pointsRef.current.rotation.x = time * 0.005;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#C5A059"
        size={0.035}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function InteractiveHeroCanvas() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0 bg-black -z-10" />;
  }

  return (
    <div className="absolute inset-0 bg-black -z-10 opacity-60">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <Particles />
      </Canvas>
    </div>
  );
}
