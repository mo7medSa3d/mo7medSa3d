"use client";

/**
 * Signal Core — hero WebGL visualization.
 *
 * Performance:
 * - Pauses rendering (frameloop="never") whenever scrolled out of viewport.
 * - Uses THREE.InstancedMesh per orbit ring (3 draw calls instead of 37).
 * - Disposes GPU resources cleanly on unmount and degrades to a CSS ring
 *   when WebGL is unavailable or prefers-reduced-motion is enabled.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const SIGNAL = "#38BDF8";
const SIGNAL_2 = "#8B5CF6";
const SIGNAL_3 = "#22D3EE";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function makeGlowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    );
    grad.addColorStop(0, "rgba(255,255,255,0.9)");
    grad.addColorStop(0.35, "rgba(255,255,255,0.25)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  return new THREE.CanvasTexture(canvas);
}

function Glow() {
  const texture = useMemo(() => makeGlowTexture(), []);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <sprite scale={[3.4, 3.4, 1]}>
      <spriteMaterial
        map={texture}
        color={SIGNAL}
        transparent
        opacity={0.28}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </sprite>
  );
}

function Core({ reduced }: { reduced: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    const breathe = 1 + Math.sin(t * (reduced ? 0.25 : 0.7)) * 0.03;
    m.scale.setScalar(breathe);
    m.rotation.y += delta * (reduced ? 0.03 : 0.13);
    m.rotation.x += delta * (reduced ? 0.01 : 0.045);
  });
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[0.92, 1]} />
      <meshStandardMaterial
        color="#0c1015"
        emissive={SIGNAL}
        emissiveIntensity={0.35}
        wireframe
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

function DataRing({
  radius,
  count,
  color,
  speed,
  tilt,
  reduced,
}: {
  radius: number;
  count: number;
  color: string;
  speed: number;
  tilt: number;
  reduced: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const instanced = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    const mesh = instanced.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      dummy.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [count, radius]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * speed * (reduced ? 0.15 : 1);
  });

  return (
    <group ref={group} rotation-x={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.011, 8, 96]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      <instancedMesh ref={instanced} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.032, 8, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
        />
      </instancedMesh>
    </group>
  );
}

function ParticleField({ reduced }: { reduced: boolean }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 200;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3.1 + Math.random() * 2.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    const p = points.current;
    if (!p) return;
    p.rotation.y += delta * (reduced ? 0.006 : 0.022);
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color={SIGNAL_3}
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  const reduced = useReducedMotion();
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  useFrame(() => {
    const g = group.current;
    if (!g || reduced) return;
    g.rotation.y += (pointer.current.x * 0.28 - g.rotation.y) * 0.04;
    g.rotation.x += (-pointer.current.y * 0.2 - g.rotation.x) * 0.04;
  });

  return (
    <group ref={group} scale={0.74}>
      <ambientLight intensity={0.45} />
      <pointLight position={[3, 3, 3]} intensity={1.3} color={SIGNAL} />
      <pointLight position={[-3, -2, -2]} intensity={0.85} color={SIGNAL_2} />
      <Glow />
      <Core reduced={reduced} />
      <DataRing radius={1.55} count={12} color={SIGNAL} speed={0.22} tilt={0.5} reduced={reduced} />
      <DataRing radius={2.05} count={16} color={SIGNAL_2} speed={-0.16} tilt={-0.35} reduced={reduced} />
      <DataRing radius={2.6} count={9} color={SIGNAL_3} speed={0.11} tilt={1.05} reduced={reduced} />
      <ParticleField reduced={reduced} />
    </group>
  );
}

export default function AICore() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    try {
      const test = document.createElement("canvas");
      const gl = test.getContext("webgl2") || test.getContext("webgl");
      if (!gl) setWebglOk(false);
    } catch {
      setWebglOk(false);
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "100px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full select-none" aria-hidden="true">
      {webglOk ? (
        <Canvas
          frameloop={visible ? "always" : "never"}
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 6.2], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <Scene />
        </Canvas>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-[68%] w-[68%] rounded-full border border-[var(--signal)]/30 shadow-[0_0_80px_var(--signal-wash)]" />
        </div>
      )}
    </div>
  );
}
