"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

const mix = (a: number[], b: number[], t: number) => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

const pseudoRandom = (x: number, y: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
};

const smoothNoise2D = (x: number, y: number) => {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const xf = x - x0;
  const yf = y - y0;

  const topLeft = pseudoRandom(x0, y0);
  const topRight = pseudoRandom(x0 + 1, y0);
  const bottomLeft = pseudoRandom(x0, y0 + 1);
  const bottomRight = pseudoRandom(x0 + 1, y0 + 1);

  const top = topLeft + (topRight - topLeft) * xf;
  const bottom = bottomLeft + (bottomRight - bottomLeft) * xf;

  return top + (bottom - top) * yf;
};

const fractalNoise = (x: number, y: number, octaves = 4) => {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;

  for (let i = 0; i < octaves; i++) {
    value += smoothNoise2D(x * frequency, y * frequency) * amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return value;
};

let cachedEarthTexture: THREE.CanvasTexture | null = null;

const createEarthTexture = () => {
  if (cachedEarthTexture) {
    return cachedEarthTexture;
  }

  if (typeof window === "undefined") {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  const { width, height } = canvas;
  const imageData = context.createImageData(width, height);
  const data = imageData.data;
  const degToRad = Math.PI / 180;

  type ContinentBlob = {
    center: [number, number];
    radius: [number, number];
    weight: number;
    sharpness?: number;
  };

  const continentBlobs: ContinentBlob[] = [
    { center: [-100, 48], radius: [55, 32], weight: 1.25 },
    { center: [-60, -10], radius: [40, 28], weight: 1.12 },
    { center: [0, 18], radius: [60, 36], weight: 1.3 },
    { center: [35, 55], radius: [75, 34], weight: 1.16 },
    { center: [95, 32], radius: [85, 32], weight: 1.1 },
    { center: [115, -8], radius: [55, 24], weight: 0.8 },
    { center: [135, -26], radius: [40, 22], weight: 0.74 },
    { center: [25, -32], radius: [42, 22], weight: 0.74 },
    { center: [-20, 66], radius: [30, 16], weight: 0.52 },
    { center: [30, 72], radius: [35, 18], weight: 0.5 },
    { center: [-150, 62], radius: [36, 18], weight: 0.44 },
    { center: [170, -45], radius: [60, 18], weight: 0.35 },
    { center: [60, -70], radius: [80, 20], weight: 0.38 },
    { center: [150, 58], radius: [28, 12], weight: 0.32 },
    { center: [78, 15], radius: [36, 22], weight: 0.86 },
    { center: [-15, 40], radius: [28, 18], weight: 0.64 },
    { center: [45, 35], radius: [32, 18], weight: 0.62 },
    { center: [-150, -30], radius: [40, 20], weight: 0.3 },
    { center: [140, 10], radius: [40, 20], weight: 0.48 },
  ];

  const ridgeOffsetX = 20.5;
  const ridgeOffsetY = 2.3;
  const vegetationOffsetX = 4.3;
  const vegetationOffsetY = 9.8;

  for (let y = 0; y < height; y++) {
    const v = y / (height - 1);
    const lat = 90 - v * 180;
    const latRad = lat * degToRad;
    const cosLat = Math.max(Math.cos(latRad), 0.12);

    for (let x = 0; x < width; x++) {
      const u = x / (width - 1);
      const lon = -180 + u * 360;
      const lonRad = lon * degToRad;

      let elevation = -0.42;

      for (const blob of continentBlobs) {
        const deltaLon = ((lon - blob.center[0] + 540) % 360) - 180;
        const lonFactor = deltaLon / (blob.radius[0] * cosLat);
        const latFactor = (lat - blob.center[1]) / blob.radius[1];
        const sharpness = blob.sharpness ?? 1;
        const falloff = lonFactor * lonFactor + latFactor * latFactor;
        elevation += Math.exp(-falloff * sharpness) * blob.weight;
      }

      const baseNoise = fractalNoise(u * 6.2 + 0.12, v * 6.2 + 0.34) - 0.5;
      const ridgeNoise =
        Math.max(
          0,
          fractalNoise(u * 18 + ridgeOffsetX, v * 18 + ridgeOffsetY) - 0.58
        ) * 1.4;
      const continentalShear =
        Math.sin(lonRad * 3.2) * Math.sin(latRad * 1.6) * 0.18;

      elevation += baseNoise * 0.55 + ridgeNoise * 0.55 + continentalShear;

      const elevationMask = smoothstep(-0.08, 0.12, elevation);
      const coastline = elevationMask * (1 - elevationMask);

      const landAltitude = clamp((elevation - 0.02) / 1.1, 0, 1);
      const moistureNoise = fractalNoise(u * 3.6 + 200.1, v * 3.6 + 99.7);
      const vegetationNoise = fractalNoise(
        u * 12 + vegetationOffsetX,
        v * 12 + vegetationOffsetY
      );

      let color: number[];

      if (elevationMask <= 0.5) {
        const depth = clamp((-elevation + 0.18) / 1.1, 0, 1);
        const oceanDeep = [3, 22, 51];
        const oceanMid = [12, 56, 99];
        const oceanShallow = [26, 118, 163];
        const shelf = smoothstep(0.35, 0.82, depth);
        color = mix(oceanDeep, oceanMid, Math.pow(depth, 0.6));
        color = mix(color, oceanShallow, Math.pow(1 - depth, 2) * 0.65);
        color = mix(color, [144, 210, 227], shelf * 0.25 + coastline * 0.6);
        const swell = Math.sin(lonRad * 2.6 + latRad * 1.5) * 0.08;
        color = mix(color, [12, 68, 120], clamp(swell, 0, 1) * 0.12);
      } else {
        const climate = clamp(1 - Math.abs(lat) / 75, 0, 1);
        const equatorial = smoothstep(0.4, 0.95, climate);
        const dryness = clamp(
          0.55 - (moistureNoise - 0.5) * 0.9 + Math.abs(lat) * 0.006,
          0,
          1
        );
        const desertMask =
          smoothstep(0.45, 0.72, dryness) *
          smoothstep(0.08, 0.38, 1 - equatorial) *
          smoothstep(-0.05, 0.32, landAltitude);
        const tundraMask = smoothstep(52, 72, Math.abs(lat));
        const snowMask =
          smoothstep(0.62, 1, landAltitude) * 0.65 +
          smoothstep(70, 85, Math.abs(lat)) * 0.75;

        const fertileBase = mix([62, 102, 64], [92, 148, 82], equatorial);
        const lushVariation = mix(
          [44, 90, 52],
          [78, 142, 72],
          clamp(vegetationNoise + equatorial * 0.3, 0, 1)
        );
        const aridBase = [196, 176, 132];
        const tundraBase = [112, 132, 104];

        color = mix(fertileBase, lushVariation, 0.55);
        color = mix(color, aridBase, desertMask);
        color = mix(color, tundraBase, tundraMask * 0.7);
        color = mix(color, [238, 243, 245], snowMask);
        const mountainMask = Math.pow(landAltitude, 1.6);
        color = mix(color, [142, 118, 90], mountainMask * 0.35);
        color = mix(color, [232, 236, 198], coastline * 0.55);
      }

      const lightDir = new THREE.Vector3(-0.6, 0.4, 0.7).normalize();
      const normal = new THREE.Vector3(
        Math.cos(latRad) * Math.cos(lonRad),
        Math.sin(latRad),
        Math.cos(latRad) * Math.sin(lonRad)
      );
      const lambert = clamp(normal.dot(lightDir) * 0.6 + 0.4, 0, 1);
      color = mix([12, 18, 32], color, lambert);

      const offset = (y * width + x) * 4;
      data[offset] = Math.round(clamp(color[0], 0, 255));
      data[offset + 1] = Math.round(clamp(color[1], 0, 255));
      data[offset + 2] = Math.round(clamp(color[2], 0, 255));
      data[offset + 3] = 255;
    }
  }

  context.putImageData(imageData, 0, 0);

  const sunlight = context.createLinearGradient(0, 0, width, height);
  sunlight.addColorStop(0, "rgba(255,255,255,0.28)");
  sunlight.addColorStop(0.45, "rgba(255,255,255,0.05)");
  sunlight.addColorStop(0.75, "rgba(6,30,60,0.08)");
  sunlight.addColorStop(1, "rgba(6,18,40,0.28)");
  context.fillStyle = sunlight;
  context.fillRect(0, 0, width, height);

  const rimLight = context.createRadialGradient(
    width * 0.48,
    height * 0.48,
    width * 0.18,
    width * 0.48,
    height * 0.48,
    width * 0.56
  );
  rimLight.addColorStop(0, "transparent");
  rimLight.addColorStop(1, "rgba(148,197,253,0.25)");
  context.fillStyle = rimLight;
  context.fillRect(0, 0, width, height);

  const polarGlow = context.createLinearGradient(0, 0, 0, height);
  polarGlow.addColorStop(0, "rgba(228, 242, 255, 0.35)");
  polarGlow.addColorStop(0.08, "rgba(214, 238, 255, 0.15)");
  polarGlow.addColorStop(0.92, "rgba(214, 238, 255, 0.15)");
  polarGlow.addColorStop(1, "rgba(228, 242, 255, 0.35)");
  context.fillStyle = polarGlow;
  context.globalAlpha = 0.45;
  context.fillRect(0, 0, width, height);
  context.globalAlpha = 1;

  const highClouds = context.createLinearGradient(0, 0, width, 0);
  highClouds.addColorStop(0, "rgba(255,255,255,0)");
  highClouds.addColorStop(0.5, "rgba(255,255,255,0.08)");
  highClouds.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = highClouds;
  context.globalAlpha = 0.35;
  context.fillRect(0, 0, width, height);
  context.globalAlpha = 1;

  const leftEdge = context.getImageData(0, 0, 1, height);
  const rightEdge = context.getImageData(width - 1, 0, 1, height);
  const blendedEdge = context.createImageData(1, height);

  for (let i = 0; i < blendedEdge.data.length; i += 4) {
    blendedEdge.data[i] = Math.round((leftEdge.data[i] + rightEdge.data[i]) / 2);
    blendedEdge.data[i + 1] = Math.round(
      (leftEdge.data[i + 1] + rightEdge.data[i + 1]) / 2
    );
    blendedEdge.data[i + 2] = Math.round(
      (leftEdge.data[i + 2] + rightEdge.data[i + 2]) / 2
    );
    blendedEdge.data[i + 3] = Math.round(
      (leftEdge.data[i + 3] + rightEdge.data[i + 3]) / 2
    );
  }

  context.putImageData(blendedEdge, 0, 0);
  context.putImageData(blendedEdge, width - 1, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;

  cachedEarthTexture = texture;
  return texture;
};

const useEarthTexture = () => {
  return useMemo(createEarthTexture, []);
};

const textureCache = new Map<string, THREE.CanvasTexture | null>();

const createCanvasTexture = (
  cacheKey: string,
  drawer: (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void
) => {
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey) ?? null;
  }

  if (typeof document === "undefined") {
    return null;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 160;
  const context = canvas.getContext("2d");

  if (!context) {
    textureCache.set(cacheKey, null);
    return null;
  }

  drawer(context, canvas);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;

  textureCache.set(cacheKey, texture);
  return texture;
};

const addFlagShading = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  const sheen = context.createLinearGradient(0, 0, canvas.width, 0);
  sheen.addColorStop(0, "rgba(255,255,255,0.25)");
  sheen.addColorStop(0.25, "rgba(255,255,255,0.08)");
  sheen.addColorStop(0.55, "rgba(255,255,255,0.18)");
  sheen.addColorStop(1, "rgba(255,255,255,0)");

  context.save();
  context.globalCompositeOperation = "overlay";
  context.globalAlpha = 0.5;
  context.fillStyle = sheen;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.restore();

  const folds = context.createLinearGradient(0, 0, 0, canvas.height);
  folds.addColorStop(0, "rgba(15,23,42,0.35)");
  folds.addColorStop(0.25, "rgba(15,23,42,0.05)");
  folds.addColorStop(0.75, "rgba(15,23,42,0.05)");
  folds.addColorStop(1, "rgba(15,23,42,0.3)");

  context.save();
  context.globalAlpha = 0.18;
  context.fillStyle = folds;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.restore();

  const poleShade = context.createLinearGradient(0, 0, canvas.width * 0.35, 0);
  poleShade.addColorStop(0, "rgba(15,23,42,0.22)");
  poleShade.addColorStop(0.6, "rgba(15,23,42,0)");

  context.save();
  context.globalAlpha = 0.35;
  context.fillStyle = poleShade;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.restore();

  context.strokeStyle = "rgba(15,23,42,0.45)";
  context.lineWidth = 4;
  context.strokeRect(0, 0, canvas.width, canvas.height);
};

const createStripedFlag = (cacheKey: string, colors: string[]) =>
  createCanvasTexture(cacheKey, (context, canvas) => {
    const stripeHeight = canvas.height / colors.length;

    colors.forEach((color, index) => {
      context.fillStyle = color;
      context.fillRect(0, index * stripeHeight, canvas.width, stripeHeight);
    });

    addFlagShading(context, canvas);
  });

const createUSAFlag = () =>
  createCanvasTexture("usa", (context, canvas) => {
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
    const rowSpacing = cantonHeight / 10;
    for (let row = 0; row < 9; row++) {
      const starsInRow = row % 2 === 0 ? 6 : 5;
      const offsetX = cantonWidth / (starsInRow + 1);
      const baseY = (row + 1) * rowSpacing;

      for (let col = 0; col < starsInRow; col++) {
        const baseX = (col + 1) * offsetX + (row % 2 === 0 ? 0 : offsetX / 2);
        context.save();
        context.translate(baseX, baseY);
        context.rotate(-Math.PI / 18);
        context.font = `${stripeHeight * 0.7}px "Segoe UI Symbol", sans-serif`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText("★", 0, 0);
        context.restore();
      }
    }

    addFlagShading(context, canvas);
  });

const createQuestionFlag = () =>
  createCanvasTexture("question", (context, canvas) => {
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#1e3a8a");
    gradient.addColorStop(1, "#2563eb");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const emblem = context.createRadialGradient(
      canvas.width * 0.65,
      canvas.height * 0.48,
      canvas.height * 0.1,
      canvas.width * 0.65,
      canvas.height * 0.48,
      canvas.height * 0.28
    );
    emblem.addColorStop(0, "rgba(255,255,255,0.95)");
    emblem.addColorStop(1, "rgba(255,255,255,0.1)");
    context.fillStyle = emblem;
    context.beginPath();
    context.ellipse(
      canvas.width * 0.65,
      canvas.height * 0.5,
      canvas.width * 0.22,
      canvas.height * 0.34,
      -0.2,
      0,
      Math.PI * 2
    );
    context.fill();

    context.fillStyle = "#0f172a";
    context.font = `${canvas.height * 0.52}px "Fira Sans", sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("?", canvas.width * 0.63, canvas.height * 0.53);

    context.save();
    context.globalAlpha = 0.55;
    context.strokeStyle = "rgba(148, 163, 184, 0.75)";
    context.lineWidth = 6;
    context.beginPath();
    context.moveTo(canvas.width * 0.18, canvas.height * 0.15);
    context.lineTo(canvas.width * 0.32, canvas.height * 0.35);
    context.lineTo(canvas.width * 0.18, canvas.height * 0.55);
    context.closePath();
    context.stroke();
    context.restore();

    addFlagShading(context, canvas);
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
      <sphereGeometry args={[1.4, 48, 48]} />
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
      germany: createStripedFlag("germany", ["#000000", "#dd0000", "#ffce00"]),
      spain: createCanvasTexture("spain", (context, canvas) => {
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

        addFlagShading(context, canvas);
      }),
      poland: createStripedFlag("poland", ["#ffffff", "#dc2626"]),
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
        <sphereGeometry args={[1.4, 48, 48]} />
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
  const flagWidth = size * 1.45;
  const flagHeight = size;
  const flagMeshRef = useRef<
    THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>
  >(null);
  const basePositions = useRef<Float32Array | null>(null);
  const quaternion = useMemo(() => {
    const normal = position.clone().normalize();
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
    return q;
  }, [position]);

  useFrame(({ clock }) => {
    const mesh = flagMeshRef.current;
    if (!mesh || !texture) {
      return;
    }

    const geometry = mesh.geometry as THREE.PlaneGeometry;
    const positionAttr = geometry.attributes.position;
    if (!basePositions.current) {
      basePositions.current = new Float32Array(positionAttr.array as Float32Array);
    }

    const time = clock.getElapsedTime();
    for (let i = 0; i < positionAttr.count; i++) {
      const baseX = basePositions.current[i * 3];
      const baseY = basePositions.current[i * 3 + 1];
      const progress = clamp((baseX + flagWidth / 2) / flagWidth, 0, 1);
      const wave = Math.sin(progress * Math.PI * 1.4 + time * 2.1);
      const ripple = Math.sin(baseY * 8 + time * 3.2);
      const displacement = (wave * 0.045 + ripple * 0.02) * Math.pow(progress, 1.5);
      positionAttr.setZ(i, displacement);
    }

    positionAttr.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  if (!texture) {
    return null;
  }

  return (
    <group position={position} quaternion={quaternion}>
      <mesh position={[0, poleHeight / 2, 0]}>
        <cylinderGeometry args={[0.01, 0.01, poleHeight, 12]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh
        ref={flagMeshRef}
        position={[flagWidth / 2 + 0.02, poleHeight - flagHeight / 2, 0]}
        castShadow
      >
        <planeGeometry args={[flagWidth, flagHeight, 24, 12]} />
        <meshStandardMaterial
          map={texture}
          transparent
          toneMapped={false}
          roughness={0.78}
          metalness={0.05}
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
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        className="bg-transparent"
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.1} color="#ffffff" />
        <directionalLight position={[-4, 3, -5]} intensity={0.45} color="#4f83ff" />
        <Suspense fallback={null}>
          <EarthModel />
          <Stars radius={80} depth={40} count={900} factor={3.5} saturation={0} fade speed={0.3} />
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  );
};

export default EarthCanvas;
