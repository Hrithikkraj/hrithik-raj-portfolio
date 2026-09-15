import React, { Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATH = `${process.env.PUBLIC_URL || ''}/models/lamp.glb`;

// Preload the GLB model at module level so it begins loading immediately
useGLTF.preload(MODEL_PATH);

interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ModelErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn(`Failed to load 3D model at ${MODEL_PATH}:`, error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * Ensures OrbitControls auto-rotation continues ticking smoothly
 * when Canvas frameloop="demand" is active.
 */
function AutoRotateInvalidator({ active }: { active: boolean }) {
  const { invalidate } = useThree();
  useFrame(() => {
    if (active) {
      invalidate();
    }
  });
  return null;
}

/**
 * 3D Model component that loads the lamp GLB and gives its individual parts
 * a colourful enamel finish, while retaining brass hardware accents.
 */
function LampModel() {
  // Keep this in sync with the preload path. A leading slash breaks when the
  // portfolio is served from its GitHub Pages project path.
  const { scene } = useGLTF(MODEL_PATH);

  useEffect(() => {
    if (!scene) return;

    const enamelTeal = new THREE.MeshStandardMaterial({
      color: '#0f9fa8',
      metalness: 0.45,
      roughness: 0.24,
    });
    const enamelCoral = new THREE.MeshStandardMaterial({
      color: '#ef5b5b',
      // The shade itself is the light source, so it glows without needing a
      // separate mesh that can drift away from the model.
      emissive: '#ff3d52',
      emissiveIntensity: 0.85,
      metalness: 0.4,
      roughness: 0.26,
    });
    const brassMaterial = new THREE.MeshStandardMaterial({
      color: '#c99232',
      metalness: 0.7,
      roughness: 0.35,
    });

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;

        // The Fusion export occasionally drops the `Body1:1` mesh name, so
        // identify the broad, shallow shade by its bounding box as a fallback.
        mesh.geometry.computeBoundingBox();
        const bounds = mesh.geometry.boundingBox;
        const width = bounds ? bounds.max.x - bounds.min.x : 0;
        const depth = bounds ? bounds.max.z - bounds.min.z : 0;
        const isShade = mesh.name === 'Body1:1' || (width > 350 && depth < 500);

        mesh.material = isShade
          ? enamelCoral
          : mesh.name === 'Body1'
            ? enamelTeal
            : brassMaterial;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <Center>
      <primitive object={scene} scale={0.0035} />
    </Center>
  );
}

const LampViewer: React.FC = () => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div
      className="lamp-viewer-canvas-wrapper"
      aria-label="Interactive 3D model of a vintage table lamp — click and drag to rotate"
    >
      <ModelErrorBoundary
        fallback={
          <div className="lamp-viewer__fallback" role="alert">
            <span className="lamp-viewer__fallback-icon" aria-hidden="true">💡</span>
            <p className="lamp-viewer__fallback-text">3D model unavailable</p>
          </div>
        }
      >
        <Suspense
          fallback={
            <div className="lamp-viewer__loading" role="status" aria-live="polite">
              <span className="lamp-viewer__loading-spinner" aria-hidden="true" />
              <p>Loading model...</p>
            </div>
          }
        >
          <Canvas
            frameloop="demand"
            gl={{
              alpha: true,
              antialias: true,
              powerPreference: 'high-performance',
            }}
            camera={{ position: [2.5, 1.8, 3.2], fov: 45 }}
            dpr={[1, 2]}
            style={{ background: 'transparent', width: '100%', height: '100%' }}
          >
            {/* Low-intensity ambient light prevents shadow areas from going completely black */}
            <ambientLight intensity={0.55} color="#fff8f0" />

            {/* Warm amber key light positioned upper-left to simulate lamp glow */}
            <directionalLight
              position={[-3, 4.5, 3.5]}
              intensity={1.8}
              color="#ffcc88"
            />

            {/* Cooler blue-grey fill light positioned lower-right for depth & contrast */}
            <directionalLight
              position={[3.5, -2, -2.5]}
              intensity={0.9}
              color="#aabbff"
            />

            {/* Studio environment preset for surface reflections without visible background */}
            <Environment preset="studio" background={false} />

            {/* Frame invalidator for demand frameloop when autoRotate is active */}
            <AutoRotateInvalidator active={!reducedMotion} />

            {/* Interactive orbit controls: auto-rotates slowly, draggable by user */}
            <OrbitControls
              enableDamping={true}
              dampingFactor={0.06}
              autoRotate={!reducedMotion}
              autoRotateSpeed={1.2}
              enablePan={false}
              enableZoom={true}
              minDistance={1.8}
              maxDistance={6.5}
              // Permit a complete orbit around the model. The previous polar
              // limits made the drag stop around the halfway point.
              minAzimuthAngle={-Infinity}
              maxAzimuthAngle={Infinity}
              minPolarAngle={0}
              maxPolarAngle={Math.PI}
            />

            <LampModel />
          </Canvas>
        </Suspense>
      </ModelErrorBoundary>
    </div>
  );
};

export default LampViewer;
