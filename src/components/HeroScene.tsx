import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/**
 * HeroScene — Step 2 of Portfolio Upgrade
 *
 * Renders a high-performance, lightweight 3D abstract background for the Hero section:
 * - 16 floating abstract geometric shapes (icosahedrons, torus knots, octahedrons, tetrahedrons)
 * - Uses brand tokens: Violet (#7c3aed / #6d28d9) and Cyan (#06b6d4 / #0891b2)
 * - Parallax tracking using R3F pointer state with smooth lerping
 * - Individual slow rotation & floating via useFrame and Drei Float
 * - Respects prefers-reduced-motion by falling back to a static gradient overlay
 * - Non-blocking: Canvas sits inside pointer-events: none wrapper with transparent gl
 */

export interface HeroSceneProps {
  mode?: 'dark' | 'light';
}

type ShapeType = 'icosahedron' | 'torusKnot' | 'octahedron' | 'tetrahedron';

interface ShapeData {
  id: number;
  type: ShapeType;
  position: [number, number, number];
  scale: number;
  rotSpeed: [number, number, number];
  floatSpeed: number;
  rotationIntensity: number;
  floatIntensity: number;
  darkColor: string;
  lightColor: string;
  isWireframe: boolean;
}

// ── Floating Individual Shape ──────────────────────────────────
function FloatingShape({ shape, isDark }: { shape: ShapeData; isDark: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += shape.rotSpeed[0] * delta;
      meshRef.current.rotation.y += shape.rotSpeed[1] * delta;
      meshRef.current.rotation.z += shape.rotSpeed[2] * delta;
    }
  });

  const color = isDark ? shape.darkColor : shape.lightColor;

  return (
    <Float
      speed={shape.floatSpeed}
      rotationIntensity={shape.rotationIntensity}
      floatIntensity={shape.floatIntensity}
      position={shape.position}
    >
      <mesh ref={meshRef} scale={shape.scale}>
        {shape.type === 'icosahedron' && <icosahedronGeometry args={[0.55, 0]} />}
        {shape.type === 'torusKnot' && <torusKnotGeometry args={[0.35, 0.1, 36, 8]} />}
        {shape.type === 'octahedron' && <octahedronGeometry args={[0.5, 0]} />}
        {shape.type === 'tetrahedron' && <tetrahedronGeometry args={[0.45, 0]} />}

        <meshStandardMaterial
          color={color}
          roughness={shape.isWireframe ? 0.3 : 0.35}
          metalness={shape.isWireframe ? 0.8 : 0.5}
          wireframe={shape.isWireframe}
          transparent
          opacity={isDark ? (shape.isWireframe ? 0.5 : 0.65) : (shape.isWireframe ? 0.35 : 0.55)}
          emissive={color}
          emissiveIntensity={isDark ? 0.2 : 0.1}
        />
      </mesh>
    </Float>
  );
}

// ── Scene Group with Parallax Lerp ─────────────────────────────
function SceneGroup({ shapes, isDark }: { shapes: ShapeData[]; isDark: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Normalized pointer is (-1 to 1)
    const targetX = state.pointer.x * 0.7;
    const targetY = state.pointer.y * 0.5;

    // Smooth inertia lerp
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      targetX,
      0.04
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      0.04
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetX * 0.12,
      0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -targetY * 0.12,
      0.04
    );
  });

  return (
    <group ref={groupRef}>
      {shapes.map((shape) => (
        <FloatingShape key={shape.id} shape={shape} isDark={isDark} />
      ))}
      <Sparkles
        count={24}
        scale={[14, 9, 6]}
        size={2.4}
        speed={0.3}
        color={isDark ? '#38d4f0' : '#7c3aed'}
        opacity={isDark ? 0.4 : 0.25}
      />
    </group>
  );
}

// ── Main HeroScene Component ───────────────────────────────────
const HeroScene: React.FC<HeroSceneProps> = ({ mode }) => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeMode, setActiveMode] = useState<'dark' | 'light'>(mode || 'dark');

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Update mode automatically if ancestor classes change
  useEffect(() => {
    if (mode) {
      setActiveMode(mode);
      return;
    }
    const updateModeFromDOM = () => {
      const isLight = !!document.querySelector('.light-mode');
      setActiveMode(isLight ? 'light' : 'dark');
    };
    updateModeFromDOM();
    const observer = new MutationObserver(updateModeFromDOM);
    const target = document.querySelector('.main-container') || document.body;
    observer.observe(target, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [mode]);

  // Deterministic set of 16 shapes positioned harmoniously around hero
  const shapes = useMemo<ShapeData[]>(() => {
    const raw: Array<Omit<ShapeData, 'id'>> = [
      // Left side floating elements
      {
        type: 'icosahedron',
        position: [-4.2, 1.8, -1.5],
        scale: 0.9,
        rotSpeed: [0.15, 0.2, 0.05],
        floatSpeed: 1.4,
        rotationIntensity: 0.5,
        floatIntensity: 0.6,
        darkColor: '#7c3aed',
        lightColor: '#6d28d9',
        isWireframe: false,
      },
      {
        type: 'torusKnot',
        position: [-3.5, -1.6, -1.0],
        scale: 0.75,
        rotSpeed: [0.1, 0.25, 0.15],
        floatSpeed: 1.2,
        rotationIntensity: 0.6,
        floatIntensity: 0.5,
        darkColor: '#06b6d4',
        lightColor: '#0891b2',
        isWireframe: false,
      },
      {
        type: 'octahedron',
        position: [-5.0, 0.2, -2.5],
        scale: 1.1,
        rotSpeed: [0.18, 0.12, 0.1],
        floatSpeed: 1.6,
        rotationIntensity: 0.4,
        floatIntensity: 0.7,
        darkColor: '#9d6bf5',
        lightColor: '#7c3aed',
        isWireframe: true,
      },
      {
        type: 'tetrahedron',
        position: [-2.2, 2.5, -2.0],
        scale: 0.7,
        rotSpeed: [0.2, 0.1, 0.2],
        floatSpeed: 1.5,
        rotationIntensity: 0.5,
        floatIntensity: 0.4,
        darkColor: '#38d4f0',
        lightColor: '#06b6d4',
        isWireframe: true,
      },
      // Center background elements (subtle, further back)
      {
        type: 'icosahedron',
        position: [0.3, 2.8, -3.5],
        scale: 1.0,
        rotSpeed: [0.1, 0.15, 0.08],
        floatSpeed: 1.1,
        rotationIntensity: 0.3,
        floatIntensity: 0.4,
        darkColor: '#7c3aed',
        lightColor: '#6d28d9',
        isWireframe: true,
      },
      {
        type: 'octahedron',
        position: [-0.6, -2.4, -2.5],
        scale: 0.85,
        rotSpeed: [0.14, 0.18, 0.06],
        floatSpeed: 1.3,
        rotationIntensity: 0.4,
        floatIntensity: 0.5,
        darkColor: '#06b6d4',
        lightColor: '#0891b2',
        isWireframe: false,
      },
      // Right side floating elements
      {
        type: 'torusKnot',
        position: [3.8, 1.9, -1.8],
        scale: 0.8,
        rotSpeed: [0.12, 0.2, 0.1],
        floatSpeed: 1.5,
        rotationIntensity: 0.7,
        floatIntensity: 0.6,
        darkColor: '#9d6bf5',
        lightColor: '#7c3aed',
        isWireframe: false,
      },
      {
        type: 'icosahedron',
        position: [4.6, -1.2, -1.5],
        scale: 0.95,
        rotSpeed: [0.18, 0.15, 0.12],
        floatSpeed: 1.3,
        rotationIntensity: 0.5,
        floatIntensity: 0.5,
        darkColor: '#06b6d4',
        lightColor: '#0891b2',
        isWireframe: true,
      },
      {
        type: 'tetrahedron',
        position: [2.5, -2.2, -1.2],
        scale: 0.75,
        rotSpeed: [0.2, 0.22, 0.1],
        floatSpeed: 1.7,
        rotationIntensity: 0.6,
        floatIntensity: 0.6,
        darkColor: '#7c3aed',
        lightColor: '#6d28d9',
        isWireframe: false,
      },
      {
        type: 'octahedron',
        position: [5.2, 0.8, -2.8],
        scale: 1.05,
        rotSpeed: [0.1, 0.16, 0.14],
        floatSpeed: 1.2,
        rotationIntensity: 0.4,
        floatIntensity: 0.6,
        darkColor: '#38d4f0',
        lightColor: '#06b6d4',
        isWireframe: false,
      },
      {
        type: 'icosahedron',
        position: [1.8, 2.6, -2.2],
        scale: 0.65,
        rotSpeed: [0.25, 0.1, 0.15],
        floatSpeed: 1.6,
        rotationIntensity: 0.5,
        floatIntensity: 0.5,
        darkColor: '#06b6d4',
        lightColor: '#0891b2',
        isWireframe: true,
      },
      {
        type: 'torusKnot',
        position: [-1.8, -2.6, -3.0],
        scale: 0.7,
        rotSpeed: [0.15, 0.18, 0.1],
        floatSpeed: 1.3,
        rotationIntensity: 0.5,
        floatIntensity: 0.4,
        darkColor: '#7c3aed',
        lightColor: '#6d28d9',
        isWireframe: true,
      },
      // Peripheral ambient depth shapes
      {
        type: 'tetrahedron',
        position: [-5.8, -1.8, -3.2],
        scale: 0.9,
        rotSpeed: [0.12, 0.14, 0.08],
        floatSpeed: 1.1,
        rotationIntensity: 0.3,
        floatIntensity: 0.5,
        darkColor: '#7c3aed',
        lightColor: '#6d28d9',
        isWireframe: false,
      },
      {
        type: 'octahedron',
        position: [5.6, -2.4, -3.5],
        scale: 0.85,
        rotSpeed: [0.16, 0.12, 0.2],
        floatSpeed: 1.4,
        rotationIntensity: 0.4,
        floatIntensity: 0.5,
        darkColor: '#9d6bf5',
        lightColor: '#7c3aed',
        isWireframe: true,
      },
      {
        type: 'icosahedron',
        position: [-3.8, 3.2, -3.0],
        scale: 0.75,
        rotSpeed: [0.14, 0.18, 0.1],
        floatSpeed: 1.2,
        rotationIntensity: 0.4,
        floatIntensity: 0.4,
        darkColor: '#06b6d4',
        lightColor: '#0891b2',
        isWireframe: false,
      },
      {
        type: 'torusKnot',
        position: [3.4, -3.0, -2.8],
        scale: 0.7,
        rotSpeed: [0.18, 0.12, 0.16],
        floatSpeed: 1.5,
        rotationIntensity: 0.6,
        floatIntensity: 0.5,
        darkColor: '#38d4f0',
        lightColor: '#06b6d4',
        isWireframe: true,
      },
    ];

    return raw.map((item, index) => ({ ...item, id: index }));
  }, []);

  const isDark = activeMode === 'dark';

  // If user prefers reduced motion, render static background gradient
  if (reducedMotion) {
    return (
      <div
        className="hero-3d-reduced-bg"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: isDark
            ? 'radial-gradient(ellipse at 50% 40%, rgba(124, 58, 237, 0.15) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 75%)'
            : 'radial-gradient(ellipse at 50% 40%, rgba(109, 40, 217, 0.1) 0%, rgba(8, 145, 178, 0.05) 50%, transparent 75%)',
        }}
      />
    );
  }

  return (
    <div
      className="hero-3d-wrapper"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      <Canvas
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 0, 7.5], fov: 50 }}
        dpr={[1, 1.5]}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={isDark ? 0.9 : 1.4} />
        <directionalLight
          position={[6, 8, 5]}
          intensity={isDark ? 1.4 : 1.8}
          color={isDark ? '#ffffff' : '#f8f8ff'}
        />
        <pointLight
          position={[-6, -4, 2]}
          intensity={isDark ? 1.2 : 0.8}
          color={isDark ? '#7c3aed' : '#6d28d9'}
        />
        <pointLight
          position={[6, -4, 2]}
          intensity={isDark ? 1.0 : 0.7}
          color={isDark ? '#06b6d4' : '#0891b2'}
        />
        <SceneGroup shapes={shapes} isDark={isDark} />
      </Canvas>
    </div>
  );
};

export default HeroScene;
