"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

const useEarthTexture = () => {
  return useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const context = canvas.getContext("2d");

    if (!context) {
      return null;
    }

    const { width, height } = canvas;

    const oceanGradient = context.createLinearGradient(0, 0, 0, height);
    oceanGradient.addColorStop(0, "#041329");
    oceanGradient.addColorStop(0.45, "#083164");
    oceanGradient.addColorStop(1, "#06224a");
    context.fillStyle = oceanGradient;
    context.fillRect(0, 0, width, height);

    const topGlow = context.createRadialGradient(
      width * 0.25,
      height * 0.18,
      width * 0.05,
      width * 0.25,
      height * 0.18,
      width * 0.65
    );
    topGlow.addColorStop(0, "rgba(56,189,248,0.35)");
    topGlow.addColorStop(1, "transparent");
    context.fillStyle = topGlow;
    context.fillRect(0, 0, width, height);

    const project = (lat: number, lon: number) => ({
      x: ((lon + 180) / 360) * width,
      y: ((90 - lat) / 180) * height,
    });

    type Landmass = {
      fill: string;
      alpha: number;
      strokeAlpha: number;
      coordinates: Array<[number, number]>;
    };

    const drawPolygon = ({ fill, alpha, strokeAlpha, coordinates }: Landmass) => {
      if (!coordinates.length) {
        return;
      }

      context.save();
      context.beginPath();

      const firstPoint = project(coordinates[0][1], coordinates[0][0]);
      context.moveTo(firstPoint.x, firstPoint.y);

      for (let i = 1; i < coordinates.length; i++) {
        const { x, y } = project(coordinates[i][1], coordinates[i][0]);
        context.lineTo(x, y);
      }

      context.closePath();

      context.globalAlpha = alpha;
      context.fillStyle = fill;
      context.fill();

      if (strokeAlpha > 0) {
        context.globalAlpha = alpha * strokeAlpha;
        context.lineWidth = 1.3;
        context.strokeStyle = "#f8fbff";
        context.stroke();
      }

      context.restore();
    };

    const continents: Landmass[] = [
      {
        fill: "#2f9a68",
        alpha: 0.94,
        strokeAlpha: 0.5,
        coordinates: [
          [-168, 72],
          [-152, 70],
          [-140, 66],
          [-132, 60],
          [-124, 54],
          [-118, 48],
          [-106, 42],
          [-100, 35],
          [-105, 25],
          [-112, 20],
          [-110, 16],
          [-103, 18],
          [-96, 24],
          [-90, 30],
          [-84, 34],
          [-78, 38],
          [-74, 45],
          [-75, 52],
          [-80, 59],
          [-92, 64],
          [-112, 66],
          [-135, 68],
          [-150, 70],
        ],
      },
      {
        fill: "#3ab97f",
        alpha: 0.88,
        strokeAlpha: 0.5,
        coordinates: [
          [-46, 60],
          [-40, 65],
          [-32, 70],
          [-22, 72],
          [-14, 70],
          [-20, 60],
          [-30, 56],
        ],
      },
      {
        fill: "#3ab97f",
        alpha: 0.82,
        strokeAlpha: 0.45,
        coordinates: [
          [-10, 59],
          [-6, 62],
          [-2, 60],
          [0, 57],
          [-1, 53],
          [-4, 51],
          [-7, 54],
        ],
      },
      {
        fill: "#3ab97f",
        alpha: 0.9,
        strokeAlpha: 0.55,
        coordinates: [
          [-82, 12],
          [-74, 9],
          [-70, 5],
          [-75, -5],
          [-80, -12],
          [-77, -20],
          [-71, -28],
          [-65, -33],
          [-63, -40],
          [-60, -48],
          [-53, -55],
          [-47, -50],
          [-45, -40],
          [-50, -30],
          [-54, -22],
          [-60, -12],
          [-66, -4],
          [-72, 5],
        ],
      },
      {
        fill: "#44c487",
        alpha: 0.94,
        strokeAlpha: 0.55,
        coordinates: [
          [-10, 72],
          [15, 74],
          [40, 70],
          [60, 66],
          [85, 64],
          [105, 60],
          [130, 60],
          [150, 62],
          [162, 58],
          [170, 54],
          [160, 48],
          [150, 42],
          [140, 38],
          [132, 32],
          [125, 28],
          [120, 20],
          [110, 16],
          [102, 12],
          [90, 8],
          [80, 4],
          [70, 2],
          [60, 6],
          [50, 12],
          [46, 18],
          [42, 26],
          [36, 32],
          [28, 40],
          [20, 48],
          [12, 54],
          [5, 60],
          [0, 62],
          [-6, 60],
          [-12, 56],
          [-16, 52],
          [-20, 48],
          [-22, 44],
          [-18, 40],
          [-12, 36],
          [-8, 32],
          [-5, 28],
          [-3, 22],
          [-5, 16],
          [-4, 8],
          [-6, 2],
          [-10, 2],
          [-18, 10],
          [-24, 16],
          [-28, 22],
          [-30, 28],
          [-30, 34],
          [-26, 40],
          [-20, 46],
          [-14, 52],
        ],
      },
      {
        fill: "#34ad75",
        alpha: 0.92,
        strokeAlpha: 0.5,
        coordinates: [
          [-17, 34],
          [-20, 28],
          [-18, 22],
          [-16, 16],
          [-10, 10],
          [-4, 6],
          [2, 4],
          [10, 0],
          [18, -6],
          [24, -12],
          [28, -20],
          [32, -28],
          [38, -32],
          [42, -26],
          [46, -18],
          [48, -8],
          [50, 2],
          [46, 12],
          [40, 20],
          [34, 26],
          [28, 30],
          [20, 32],
          [14, 30],
          [8, 26],
          [2, 20],
          [-2, 14],
          [-6, 10],
          [-10, 16],
          [-12, 24],
          [-12, 30],
        ],
      },
      {
        fill: "#2a9d68",
        alpha: 0.78,
        strokeAlpha: 0.45,
        coordinates: [
          [24, -12],
          [28, -20],
          [32, -28],
          [34, -34],
          [32, -40],
          [26, -40],
          [20, -34],
          [16, -26],
          [10, -18],
          [6, -10],
          [4, -4],
          [10, -2],
          [18, -6],
          [22, -8],
        ],
      },
      {
        fill: "#2d9a68",
        alpha: 0.85,
        strokeAlpha: 0.5,
        coordinates: [
          [44, 28],
          [48, 24],
          [54, 22],
          [58, 18],
          [60, 12],
          [64, 10],
          [70, 12],
          [74, 16],
          [72, 22],
          [66, 26],
          [58, 28],
          [52, 30],
        ],
      },
      {
        fill: "#2d9a68",
        alpha: 0.84,
        strokeAlpha: 0.45,
        coordinates: [
          [70, 24],
          [78, 20],
          [86, 18],
          [90, 10],
          [88, 4],
          [80, 0],
          [72, 0],
          [66, 4],
          [64, 10],
          [66, 18],
        ],
      },
      {
        fill: "#3cb781",
        alpha: 0.85,
        strokeAlpha: 0.45,
        coordinates: [
          [98, 24],
          [102, 20],
          [108, 16],
          [112, 10],
          [110, 4],
          [104, 2],
          [96, 6],
          [94, 12],
        ],
      },
      {
        fill: "#2f9a68",
        alpha: 0.85,
        strokeAlpha: 0.45,
        coordinates: [
          [110, -10],
          [118, -8],
          [126, -12],
          [132, -18],
          [134, -26],
          [128, -32],
          [118, -34],
          [110, -30],
          [106, -22],
        ],
      },
      {
        fill: "#3ab97f",
        alpha: 0.82,
        strokeAlpha: 0.42,
        coordinates: [
          [112, -42],
          [120, -36],
          [130, -34],
          [140, -38],
          [146, -44],
          [150, -52],
          [144, -58],
          [134, -56],
          [124, -48],
          [116, -44],
        ],
      },
      {
        fill: "#46c687",
        alpha: 0.88,
        strokeAlpha: 0.45,
        coordinates: [
          [110, -22],
          [118, -18],
          [126, -18],
          [132, -22],
          [130, -28],
          [122, -28],
          [114, -26],
        ],
      },
      {
        fill: "#44c487",
        alpha: 0.78,
        strokeAlpha: 0.4,
        coordinates: [
          [135, 55],
          [142, 52],
          [150, 50],
          [158, 52],
          [160, 58],
          [150, 60],
        ],
      },
      {
        fill: "#2f9a68",
        alpha: 0.78,
        strokeAlpha: 0.4,
        coordinates: [
          [145, -17],
          [152, -18],
          [160, -20],
          [166, -24],
          [170, -30],
          [164, -34],
          [156, -32],
          [148, -26],
        ],
      },
      {
        fill: "#2f9a68",
        alpha: 0.6,
        strokeAlpha: 0.3,
        coordinates: [
          [-170, -70],
          [-120, -72],
          [-90, -68],
          [-60, -70],
          [-20, -68],
          [20, -70],
          [60, -72],
          [110, -74],
          [150, -72],
          [170, -68],
          [170, -80],
          [120, -82],
          [60, -84],
          [0, -84],
          [-60, -82],
          [-120, -80],
        ],
      },
    ];

    continents.forEach(drawPolygon);

    const islandGroups: Array<{
      center: [number, number];
      radius: number;
      alpha: number;
    }> = [
      { center: [-78, 26], radius: 6, alpha: 0.7 },
      { center: [-64, 18], radius: 4, alpha: 0.6 },
      { center: [-61, 13], radius: 3, alpha: 0.6 },
      { center: [-18, 65], radius: 3.5, alpha: 0.65 },
      { center: [-150, -15], radius: 3, alpha: 0.55 },
      { center: [-150, 52], radius: 3.5, alpha: 0.55 },
      { center: [139, 35], radius: 5, alpha: 0.7 },
      { center: [142, 33], radius: 4, alpha: 0.65 },
      { center: [146, 32], radius: 4, alpha: 0.6 },
      { center: [130, -5], radius: 4, alpha: 0.65 },
      { center: [150, -3], radius: 3, alpha: 0.6 },
      { center: [166, -20], radius: 3, alpha: 0.55 },
      { center: [165, -15], radius: 2.5, alpha: 0.55 },
      { center: [172, -42], radius: 3, alpha: 0.55 },
      { center: [178, -38], radius: 2.6, alpha: 0.5 },
      { center: [105, 22], radius: 4.5, alpha: 0.65 },
      { center: [110, 20], radius: 3.5, alpha: 0.6 },
      { center: [118, -8], radius: 3.2, alpha: 0.6 },
    ];

    islandGroups.forEach(({ center, radius, alpha }) => {
      const { x, y } = project(center[1], center[0]);
      const islandGradient = context.createRadialGradient(
        x,
        y,
        radius * 0.4,
        x,
        y,
        radius
      );
      islandGradient.addColorStop(0, "rgba(74,222,128,0.9)");
      islandGradient.addColorStop(1, "rgba(34,197,94,0.2)");
      context.save();
      context.globalAlpha = alpha;
      context.fillStyle = islandGradient;
      context.beginPath();
      context.ellipse(x, y, radius * 2.2, radius * 1.4, 0, 0, Math.PI * 2);
      context.fill();
      context.restore();
    });

    context.save();
    context.globalAlpha = 0.35;
    context.strokeStyle = "rgba(226, 244, 255, 0.35)";
    context.lineWidth = 1.4;
    context.lineCap = "round";
    for (let lat = -60; lat <= 60; lat += 15) {
      const y = ((lat + 90) / 180) * height;
      context.beginPath();
      context.ellipse(width / 2, y, width / 2.05, 16, 0, 0, Math.PI * 2);
      context.stroke();
    }

    for (let lon = 0; lon < 360; lon += 15) {
      const x = (lon / 360) * width;
      context.beginPath();
      context.moveTo(x, 40);
      context.lineTo(x + 18, height / 2);
      context.lineTo(x, height - 40);
      context.stroke();
    }
    context.restore();

    const sunlight = context.createLinearGradient(0, 0, width, height);
    sunlight.addColorStop(0, "rgba(255, 255, 255, 0.35)");
    sunlight.addColorStop(0.4, "rgba(255, 255, 255, 0.08)");
    sunlight.addColorStop(0.65, "rgba(8, 47, 73, 0.05)");
    sunlight.addColorStop(1, "rgba(8, 28, 54, 0.25)");
    context.fillStyle = sunlight;
    context.fillRect(0, 0, width, height);

    const rimLight = context.createRadialGradient(
      width * 0.48,
      height * 0.48,
      width * 0.2,
      width * 0.48,
      height * 0.48,
      width * 0.55
    );
    rimLight.addColorStop(0, "transparent");
    rimLight.addColorStop(1, "rgba(148, 197, 253, 0.25)");
    context.fillStyle = rimLight;
    context.fillRect(0, 0, width, height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;

    return texture;
  }, []);
};

const createCanvasTexture = (
  drawer: (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void
) => {
  if (typeof document === "undefined") {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 160;
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  drawer(context, canvas);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;

  return texture;
};

const createStripedFlag = (colors: string[]) =>
  createCanvasTexture((context, canvas) => {
    const stripeHeight = canvas.height / colors.length;

    colors.forEach((color, index) => {
      context.fillStyle = color;
      context.fillRect(0, index * stripeHeight, canvas.width, stripeHeight);
    });

    context.strokeStyle = "rgba(0,0,0,0.25)";
    context.lineWidth = 4;
    context.strokeRect(0, 0, canvas.width, canvas.height);
  });

const createUSAFlag = () =>
  createCanvasTexture((context, canvas) => {
    const stripeHeight = canvas.height / 13;
    context.fillStyle = "#b22234";
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 13; i += 2) {
      context.fillStyle = "#ffffff";
      context.fillRect(0, i * stripeHeight, canvas.width, stripeHeight);
    }

    const cantonWidth = canvas.width * 0.45;
    const cantonHeight = stripeHeight * 7;
    context.fillStyle = "#3c3b6e";
    context.fillRect(0, 0, cantonWidth, cantonHeight);

    context.fillStyle = "#ffffff";
    context.font = `${stripeHeight * 0.8}px sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    const rows = 5;
    const cols = 6;
    const offsetX = cantonWidth / (cols + 1);
    const offsetY = cantonHeight / (rows + 1);
    for (let row = 1; row <= rows; row++) {
      for (let col = 1; col <= cols; col++) {
        context.fillText("★", col * offsetX, row * offsetY);
      }
    }

    context.strokeStyle = "rgba(0,0,0,0.25)";
    context.lineWidth = 4;
    context.strokeRect(0, 0, canvas.width, canvas.height);
  });

const createQuestionFlag = () =>
  createCanvasTexture((context, canvas) => {
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#64748b");
    gradient.addColorStop(1, "#94a3b8");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "rgba(15, 23, 42, 0.7)";
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(canvas.width * 0.2, 0);
    context.lineTo(canvas.width * 0.35, canvas.height * 0.5);
    context.lineTo(canvas.width * 0.2, canvas.height);
    context.lineTo(0, canvas.height);
    context.closePath();
    context.fill();

    context.fillStyle = "#f8fafc";
    context.font = `${canvas.height * 0.55}px sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("?", canvas.width * 0.62, canvas.height * 0.55);

    context.strokeStyle = "rgba(15,23,42,0.4)";
    context.lineWidth = 4;
    context.strokeRect(0, 0, canvas.width, canvas.height);
  });

const latLonToVector3 = (lat: number, lon: number, radius: number) => {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);

  const x = radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(-x, y, -z);
};

const Atmosphere = () => {
  return (
    <mesh scale={1.04}>
      <sphereGeometry args={[1.4, 64, 64]} />
      <meshPhongMaterial
        color="#4f9efc"
        transparent
        opacity={0.25}
        shininess={30}
        emissive="#1c58d9"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
};

const EarthModel = () => {
  const earthGroupRef = useRef<THREE.Group>(null);
  const texture = useEarthTexture();
  const flags = useMemo(() => {
    const assets = {
      usa: createUSAFlag(),
      germany: createStripedFlag(["#000000", "#dd0000", "#ffce00"]),
      spain: createCanvasTexture((context, canvas) => {
        const bandHeight = canvas.height / 4;
        context.fillStyle = "#c60b1e";
        context.fillRect(0, 0, canvas.width, bandHeight);
        context.fillRect(0, canvas.height - bandHeight, canvas.width, bandHeight);
        context.fillStyle = "#ffc400";
        context.fillRect(0, bandHeight, canvas.width, canvas.height - bandHeight * 2);

        context.fillStyle = "#a30f1a";
        context.font = `${bandHeight * 1.2}px serif`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText("☼", canvas.width * 0.23, canvas.height * 0.52);

        context.strokeStyle = "rgba(0,0,0,0.25)";
        context.lineWidth = 4;
        context.strokeRect(0, 0, canvas.width, canvas.height);
      }),
      poland: createStripedFlag(["#ffffff", "#dc2626"]),
      unknown: createQuestionFlag(),
    };

    const baseRadius = 1.42;

    return [
      { lat: 38, lon: -97, texture: assets.usa, size: 0.22 },
      { lat: 52.5, lon: 13.4, texture: assets.germany, size: 0.2 },
      { lat: 40.4, lon: -3.7, texture: assets.spain, size: 0.2 },
      { lat: 52.2, lon: 21.0, texture: assets.poland, size: 0.2 },
      { lat: -23, lon: -133, texture: assets.unknown, size: 0.18 },
      { lat: 12, lon: 110, texture: assets.unknown, size: 0.18 },
      { lat: 64, lon: -40, texture: assets.unknown, size: 0.18 },
    ].map((flag) => ({
      ...flag,
      position: latLonToVector3(flag.lat, flag.lon, baseRadius),
    }));
  }, []);

  useFrame((_, delta) => {
    if (earthGroupRef.current) {
      earthGroupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={earthGroupRef}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1.4, 64, 64]} />
        <meshStandardMaterial
          map={texture ?? undefined}
          color={texture ? undefined : "#1D4ED8"}
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>
      <Atmosphere />
      {flags.map(({ position, texture, size }, index) => (
        <FlagMarker key={index} position={position} texture={texture} size={size} />
      ))}
    </group>
  );
};

type FlagMarkerProps = {
  position: THREE.Vector3;
  texture: THREE.Texture | null;
  size: number;
};

const FlagMarker = ({ position, texture, size }: FlagMarkerProps) => {
  const poleHeight = size * 1.6;
  const flagWidth = size * 1.4;
  const flagHeight = size;
  const quaternion = useMemo(() => {
    const normal = position.clone().normalize();
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
    return q;
  }, [position]);

  if (!texture) {
    return null;
  }

  return (
    <group position={position} quaternion={quaternion}>
      <mesh position={[0, poleHeight / 2, 0]}>
        <cylinderGeometry args={[0.01, 0.01, poleHeight, 8]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[flagWidth / 2 + 0.02, poleHeight - flagHeight / 2, 0]}>
        <planeGeometry args={[flagWidth, flagHeight]} />
        <meshBasicMaterial
          map={texture}
          transparent
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, poleHeight, 0]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.2} roughness={0.4} />
      </mesh>
    </group>
  );
};

const EarthCanvas = () => {
  return (
    <div className="relative h-[320px] sm:h-[380px] lg:h-[420px] w-full max-w-xl mx-auto">
      <Canvas
        shadows
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        className="bg-transparent"
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.1} color="#ffffff" />
        <directionalLight position={[-4, 3, -5]} intensity={0.45} color="#4f83ff" />
        <Suspense fallback={null}>
          <EarthModel />
          <Stars radius={80} depth={40} count={1600} factor={4} saturation={0} fade speed={0.3} />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  );
};

export default EarthCanvas;
