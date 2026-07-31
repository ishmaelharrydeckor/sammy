'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface ScrollVideoSceneProps {
  /** Total number of frames in the sequence */
  frameCount: number;
  /** Function to generate image source URLs based on frame index */
  imagePathPattern?: (index: number) => string;
  /** Original video source width (for aspect ratio calculation on canvas) */
  width?: number;
  /** Original video source height (for aspect ratio calculation on canvas) */
  height?: number;
  /** Total scroll depth for scrubbing (e.g., "300%", "400%") */
  scrollLength?: string;
  /** Custom overlay elements to render over the scene */
  children?: React.ReactNode;
}

/**
 * ScrollVideoScene Component
 * 
 * Demonstrates a high-performance Apple-style scroll-scrubbed image sequence 
 * rendered on a canvas. This pattern replaces native video elements, providing 
 * frame-accurate, zero-latency, and cross-browser consistent scrubbing.
 */
export default function ScrollVideoScene({
  frameCount,
  imagePathPattern,
  width = 1280,
  height = 720,
  scrollLength = '300%',
  children,
}: ScrollVideoSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFrame, setActiveFrame] = useState(0);

  // Preload image sequence into memory
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    const onImageLoad = () => {
      loadedCount++;
      if (loadedCount === frameCount) {
        setImages(loadedImages);
        setIsLoaded(true);
      }
    };

    const onImageError = () => {
      console.warn("Failed to load frame, falling back to canvas drawing.");
      loadedCount++;
      if (loadedCount === frameCount) {
        setImages(loadedImages);
        setIsLoaded(true);
      }
    };

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      if (imagePathPattern) {
        img.src = imagePathPattern(i);
      } else {
        // SVG Vector Frame Generator (creates dynamic rotating visuals if no assets are provided)
        const progress = i / (frameCount - 1);
        const rotationAngle = progress * 2 * Math.PI - Math.PI / 2;
        const needleX = width / 2 + 150 * Math.cos(rotationAngle);
        const needleY = height / 2 + 150 * Math.sin(rotationAngle);
        const hue = Math.round(progress * 360);
        
        const svg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
            <rect width="100%" height="100%" fill="%2309090b"/>
            <!-- Grid Lines -->
            <path d="M 0,${height/2} L ${width},${height/2} M ${width/2},0 L ${width/2},${height}" stroke="%2318181b" stroke-width="1"/>
            <circle cx="${width/2}" cy="${height/2}" r="220" stroke="%2327272a" stroke-width="2" fill="none"/>
            <!-- Dynamic Arc -->
            <path d="M ${width/2} ${height/2 - 200} A 200 200 0 ${progress > 0.5 ? 1 : 0} 1 ${width/2 + 200 * Math.cos(rotationAngle)} ${height/2 + 200 * Math.sin(rotationAngle)}" fill="none" stroke="hsl(${hue}, 80%, 60%)" stroke-width="8" stroke-linecap="round"/>
            <!-- Center Indicator -->
            <circle cx="${width/2}" cy="${height/2}" r="15" fill="hsl(${hue}, 80%, 60%)"/>
            <line x1="${width/2}" y1="${height/2}" x2="${needleX}" y2="${needleY}" stroke="hsl(${hue}, 80%, 60%)" stroke-width="4" stroke-linecap="round"/>
            <!-- Text Overlay -->
            <text x="${width/2}" y="${height/2 + 300}" fill="%23a1a1aa" font-size="18" font-family="monospace" text-anchor="middle" letter-spacing="4">FRAME ${String(i).padStart(3, '0')} / ${frameCount}</text>
            <text x="${width/2}" y="${height/2 + 15}" fill="%23ffffff" font-size="64" font-family="system-ui, sans-serif" font-weight="900" text-anchor="middle">${Math.round(progress * 100)}%</text>
          </svg>
        `;
        img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
      }
      img.onload = onImageLoad;
      img.onerror = onImageError;
      loadedImages.push(img);
    }
  }, [frameCount, imagePathPattern, width, height]);

  // Render current frame to canvas
  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    if (images[index]) {
      ctx.drawImage(images[index], 0, 0, width, height);
    } else {
      // Inline visual placeholder during initialization
      const p = index / (frameCount - 1);
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      
      // Draw progress circle outline
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, 200, 0, 2 * Math.PI);
      ctx.stroke();

      // Progress arc
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(cx, cy, 200, -Math.PI / 2, -Math.PI / 2 + p * 2 * Math.PI);
      ctx.stroke();

      // Draw % text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 56px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${Math.round(p * 100)}%`, cx, cy);
    }
  };

  // Redraw when images load
  useEffect(() => {
    renderFrame(activeFrame);
  }, [isLoaded, images, activeFrame]);

  // Hook ScrollTrigger for scrubbing the frames and cards
  useGSAP(
    () => {
      if (!containerRef.current || !isLoaded) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${scrollLength}`,
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const frameIndex = Math.min(frameCount - 1, Math.floor(self.progress * frameCount));
            setActiveFrame(frameIndex);
          },
        },
      });

      // Staggered text overlay card animations inside the pinned container.
      // Text block 1 fades out
      tl.to('.text-overlay-1', { opacity: 0, y: -30, duration: 0.2 }, 0.15);

      // Text block 2 fades in, stays, and then fades out
      tl.fromTo(
        '.text-overlay-2',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.2 },
        0.35
      );
      tl.to('.text-overlay-2', { opacity: 0, y: -30, duration: 0.2 }, 0.6);

      // Text block 3 fades in and remains visible until the end
      tl.fromTo(
        '.text-overlay-3',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.2 },
        0.75
      );

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: containerRef, dependencies: [isLoaded, frameCount, scrollLength] }
  );

  return (
    <div ref={containerRef} className="scroll-video-scene-container" style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {/* Loading state overlay */}
      {!isLoaded && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', alignItems: 'center', backgroundColor: '#09090b', zIndex: 10 }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#ffffff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <div style={{ color: '#a1a1aa', fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', letterSpacing: '0.1em' }}>PRELOADING IMAGES...</div>
          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
        </div>
      )}

      {/* Canvas Renderer */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      {/* Floating text overlays/captions */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none' }}>
        {children}
      </div>
    </div>
  );
}
