"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function CrystalPrism() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const { width } = useThree().viewport;
  
  // Responsive layout: offset right on desktop, center on mobile
  const isMobile = width < 7;
  const position: [number, number, number] = isMobile ? [0, -1.2, 0] : [1.4, 0, 0];
  const scale = isMobile ? 0.95 : 1.35;

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !wireframeRef.current) return;

    const time = state.clock.getElapsedTime();
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;

    // Gentle floating translation (Y-axis)
    meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.2;
    wireframeRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.2;

    // Mouse follow rotation (spring interpolation)
    targetRotation.current.x = mouseRef.current.y * 0.4;
    targetRotation.current.y = mouseRef.current.x * 0.4;

    // Combine floating, mouse-move, and scroll-induced rotation
    const scrollFactor = scrollY * 0.002;
    meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * 0.05 + 0.001;
    meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * 0.05 + scrollFactor * 0.01;
    meshRef.current.rotation.z = time * 0.05 + scrollFactor;

    wireframeRef.current.rotation.x += (targetRotation.current.x - wireframeRef.current.rotation.x) * 0.05 + 0.001;
    wireframeRef.current.rotation.y += (targetRotation.current.y - wireframeRef.current.rotation.y) * 0.05 + scrollFactor * 0.01;
    wireframeRef.current.rotation.z = time * 0.05 + scrollFactor;
  });

  return (
    <group position={[position[0], 0, position[2]]} scale={scale}>
      {/* Core Emerald Crystal (Octahedron/Icosahedron for prism shape) */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <octahedronGeometry args={[1.6, 0]} />
        <meshPhysicalMaterial
          color="#C5A059"
          emissive="#2F2404"
          emissiveIntensity={0.5}
          roughness={0.15}
          metalness={0.2}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          transparent={true}
          opacity={0.7}
          flatShading={true}
        />
      </mesh>

      {/* Subtle outer glowing wireframe/cage */}
      <mesh ref={wireframeRef}>
        <octahedronGeometry args={[1.7, 0]} />
        <meshBasicMaterial
          color="#C5A059"
          wireframe={true}
          transparent={true}
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default function ThreeScene() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    setMounted(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.01 } // Trigger immediately when even 1% is visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!mounted) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-background -z-10 pointer-events-none">
        {/* Static fallback visual representation while canvas mounts */}
        <div className="relative w-48 h-48 rounded-full border border-accent/20 bg-accent-glow blur-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="absolute top-0 left-0 w-full h-[100vh] bg-transparent -z-10 overflow-hidden pointer-events-none">
      {/* Background ambient lighting/glow */}
      <div className="absolute top-[30%] right-[10%] w-[35rem] h-[35rem] rounded-full bg-accent-glow blur-[140px] pointer-events-none opacity-40"></div>
      
      {inView && (
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" castShadow />
          <pointLight position={[-10, -10, -5]} intensity={1.0} color="#C5A059" />
          <CrystalPrism />
        </Canvas>
      )}
    </div>
  );
}
