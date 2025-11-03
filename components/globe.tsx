"use client";

// 1. Impor 'useThree' dan 'useMemo'
import { useRef, Suspense, useState, useEffect, useMemo } from "react";
// 2. Impor 'useThree' dari R3F
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Sphere,
  useTexture,
  Html,
  Circle,
} from "@react-three/drei";
import type * as THREE from "three";
import { Vector3 } from "three";

// ✅ shadcn/ui tooltip
import {
  Tooltip,
  TooltipContent,
  // TooltipProvider, // HAPUS INI
  TooltipTrigger,
} from "@/components/ui/tooltip";

/* ---------------------- Helper ---------------------- */
const latLngToVec3 = (
  lat: number,
  lng: number,
  radius: number
): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new Vector3(x, y, z);
};

/* ------------------ CountryMarker ------------------- */
function CountryMarker({
  country,
  onCountrySelect,
  isSelected,
}: // globeRef, // Kita tidak akan pakai 'occlude' lagi
any) {
  if (!country?.latlng || country.latlng.length < 2) return null;

  const groupRef = useRef<THREE.Group>(null!);
  const pulseRef = useRef<THREE.Mesh>(null!);
  const [isHovered, setIsHovered] = useState(false);

  // 3. State baru untuk melacak sisi depan/belakang
  const [isFront, setIsFront] = useState(true);

  const radius = 2.02; // di luar glow 2.01
  const position = useMemo(
    () => latLngToVec3(country.latlng[0], country.latlng[1], radius),
    [country.latlng, radius]
  );

  // 4. Dapatkan 'camera' dan 'tempVector' (untuk optimasi)
  const { camera } = useThree();
  const tempVector = useMemo(() => new Vector3(), []);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.lookAt(position.clone().multiplyScalar(2));
    }
  }, [position]);

  useFrame(({ clock }) => {
    if (groupRef.current && pulseRef.current) {
      // 5. Kalkulasi Sisi Depan/Belakang (Pengganti 'occlude')
      // Ini adalah matematika vektor untuk mengecek apakah marker menghadap kamera
      // JAUH LEBIH RINGAN daripada raycast 'occlude'
      tempVector.copy(position).sub(camera.position);
      const isFacingCamera = tempVector.dot(position) < 0;
      setIsFront(isFacingCamera);

      // Animasi Pulse (tetap berjalan)
      const t = clock.getElapsedTime() * 1.5;
      const scale = 1 + 0.5 * Math.sin(t);
      pulseRef.current.scale.setScalar(scale);
      const material = pulseRef.current.material;
      if (!Array.isArray(material)) {
        (material as THREE.MeshBasicMaterial).opacity = 1.5 - scale;
      }
    }
  });

  const color = isSelected ? "#3b82f6" : isHovered ? "#60a5fa" : "#ffffff";

  return (
    <>
      <group ref={groupRef} position={position} renderOrder={10}>
        {/* ... (Lingkaran visual pulse & inti tidak berubah) ... */}
        <Circle ref={pulseRef} args={[0.045, 32]}>
          <meshBasicMaterial color={color} transparent opacity={0.5} />
        </Circle>
        <Circle args={[0.022, 32]}>
          <meshBasicMaterial color={color} />
        </Circle>

        {/* Hitbox tak terlihat untuk event */}
        <Circle
          args={[0.07, 32]}
          onClick={(e) => {
            if (!isFront) return; // 6. Jangan klik jika di belakang
            e.stopPropagation();
            onCountrySelect(country);
          }}
          onPointerEnter={(e) => {
            if (!isFront) return; // 7. Jangan hover jika di belakang
            e.stopPropagation();
            setIsHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerLeave={() => {
            setIsHovered(false);
            document.body.style.cursor = "auto";
          }}
        >
          <meshBasicMaterial transparent opacity={0} />
        </Circle>
      </group>

      {/* 8. Tampilkan <Html> HANYA jika di-hover DAN di depan */}
      {isHovered && !isSelected && isFront && (
        <Html
          position={position}
          center
          distanceFactor={10}
          // occlude DIHAPUS (ini penyebab lag)
          zIndexRange={[100, 0]}
          transform={false}
          pointerEvents="none"
        >
          {/* 9. HAPUS <TooltipProvider> DARI SINI */}
          {/* Anda harus meletakkannya di 'page.tsx' atau 'layout.tsx' */}
          <Tooltip open={true}>
            <TooltipTrigger asChild>
              <span
                aria-hidden
                style={{ display: "inline-block", width: 0, height: 0 }}
              />
            </TooltipTrigger>
            <TooltipContent
              side="top"
              align="center"
              className="bg-slate-900/95 border border-slate-700 text-white shadow-2xl px-3 py-1.5 rounded-md"
            >
              {country.name.common}
            </TooltipContent>
          </Tooltip>
        </Html>
      )}
    </>
  );
}

/* -------------------- GlobeMesh --------------------- */
function GlobeMesh({ globeRef, glowRef }: any) {
  // ... (Tidak berubah)
  const [mapTexture] = useTexture([
    "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
  ]);
  return (
    <group>
      <Sphere ref={globeRef} args={[2, 64, 64]} scale={1}>
        <meshPhongMaterial
          map={mapTexture}
          emissive="#0f172a"
          shininess={100}
        />
      </Sphere>
      <Sphere
        ref={glowRef}
        args={[2.01, 64, 64]}
        scale={1}
        raycast={null as any}
        renderOrder={-1}
      >
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.15}
          depthWrite={false}
          wireframe={false}
        />
      </Sphere>
    </group>
  );
}

/* ------------------ SceneContent -------------------- */
function SceneContent({ countries, onCountrySelect, selectedCountry }: any) {
  const orbitControlsRef = useRef<any>(null);
  const { camera } = useThree(); // <--- 'camera' sudah ada di sini

  const globeRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  useEffect(() => {
    // ... (Logika zoom kamera tidak berubah)
    if (selectedCountry && orbitControlsRef.current) {
      if (!selectedCountry.latlng || selectedCountry.latlng.length < 2) {
        console.warn(
          "Selected country has no valid latlng data:",
          selectedCountry
        );
        return;
      }
      const targetPosition = latLngToVec3(
        selectedCountry.latlng[0],
        selectedCountry.latlng[1],
        2.5
      );
      camera.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
      camera.lookAt(0, 0, 0);
      orbitControlsRef.current.target.set(0, 0, 0);
      orbitControlsRef.current.update();
    }
  }, [selectedCountry, camera]);

  return (
    <>
      <GlobeMesh globeRef={globeRef} glowRef={glowRef} />
      {countries?.map((country: any) => (
        <CountryMarker
          key={country.cca3}
          country={country}
          onCountrySelect={onCountrySelect}
          isSelected={selectedCountry?.cca3 === country.cca3}
          // globeRef={globeRef} // Tidak diperlukan lagi
        />
      ))}
      <OrbitControls
        ref={orbitControlsRef}
        enableZoom
        enablePan
        enableRotate
        autoRotate={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI - Math.PI / 4}
      />
    </>
  );
}

/* ----------------------- Globe ---------------------- */
export function Globe({ countries, onCountrySelect, selectedCountry }: any) {
  return (
    <Canvas
      // ... (Prop Canvas tidak berubah)
      camera={{ position: [0, 0, 5], fov: 75 }}
      className="w-full h-full"
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
    >
      {/* ... (Lampu dan Bintang tidak berubah) ... */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-10, -10, 5]} intensity={0.8} color="#3b82f6" />
      <Stars
        radius={100}
        depth={50}
        count={1000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      <Suspense fallback={null}>
        <SceneContent
          countries={countries}
          onCountrySelect={onCountrySelect}
          selectedCountry={selectedCountry}
        />
      </Suspense>
    </Canvas>
  );
}
