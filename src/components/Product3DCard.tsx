'use client';

import React, { useState, useRef, MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Product3DCardProps {
  image: string;
  name: string;
}

export default function Product3DCard({ image, name }: Product3DCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  // Mouse position state
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring animation for tilt
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  // Calculate rotation based on mouse position
  // Range: -20 to 20 degrees
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [20, -20]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-20, 20]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    // We allow movement tracking even if zoomed, to pan/rotate the zoomed image slightly or just for effect.
    // But if you prefer to lock it when zoomed, uncomment the check below.
    // if (isZoomed) return;

    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate normalized mouse position from center (-0.5 to 0.5)
    const mouseXPos = (e.clientX - rect.left) / width - 0.5;
    const mouseYPos = (e.clientY - rect.top) / height - 0.5;

    x.set(mouseXPos);
    y.set(mouseYPos);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div 
      className="w-full h-[500px] flex items-center justify-center"
      style={{ perspective: '1000px' }}
    >
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={toggleZoom}
        className={`
          relative w-full max-w-md aspect-square bg-white rounded-2xl shadow-xl border border-gray-100 
          flex items-center justify-center overflow-hidden cursor-zoom-in transition-all duration-300
          ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}
        `}
      >
        <motion.div
          style={{
            rotateX: rotateX,
            rotateY: rotateY,
            transformStyle: 'preserve-3d',
            cursor: isZoomed ? 'zoom-out' : 'zoom-in',
          }}
          animate={{
            scale: isZoomed ? 2 : 1,
            z: isZoomed ? 50 : 0, // Bring it closer when zoomed
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="w-full h-full flex items-center justify-center p-8"
        >
          <motion.img
            src={image}
            alt={name}
            className="w-full h-full object-contain drop-shadow-xl"
            draggable={false}
          />
        </motion.div>

        {/* Instructions Overlay (fades out on interaction) */}
        <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
          <span className="bg-black/5 text-black/50 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
            {isZoomed ? 'Click to Reset' : 'Move to Rotate • Click to Zoom'}
          </span>
        </div>
      </div>
    </div>
  );
}
