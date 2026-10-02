import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
}

interface LiveParticles3DProps {
  mousePos: { x: number; y: number };
  isMobile: boolean;
}

export const LiveParticles3D: React.FC<LiveParticles3DProps> = ({ mousePos, isMobile }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle count: 30 on mobile, 55 on desktop
    const count = isMobile ? 26 : 52;
    const colors = [
      'rgba(217, 119, 6, ', // gold/amber
      'rgba(245, 158, 11, ', // warm gold
      'rgba(52, 211, 153, ', // bright emerald
      'rgba(16, 185, 129, '  // deep emerald
    ];

    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 600 + 100, // 3D depth layer
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        vz: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 2.2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.25,
        pulseSpeed: Math.random() * 0.02 + 0.01
      });
    }

    let mouseInfluenceX = 0;
    let mouseInfluenceY = 0;
    let time = 0;

    const render = () => {
      time += 0.02;
      // Smooth interpolation for mouse parallax
      mouseInfluenceX += (mousePos.x * 35 - mouseInfluenceX) * 0.05;
      mouseInfluenceY += (mousePos.y * 35 - mouseInfluenceY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Render & update particles in simulated 3D
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Wrap around boundaries
        if (p.x < -50) p.x = width + 50;
        if (p.x > width + 50) p.x = -50;
        if (p.y < -50) p.y = height + 50;
        if (p.y > height + 50) p.y = -50;
        if (p.z < 80) p.z = 700;
        if (p.z > 700) p.z = 80;

        // 3D perspective projection factor
        const scale = 380 / p.z;
        const projX = (p.x - width / 2) * scale + width / 2 + mouseInfluenceX * (scale * 0.8);
        const projY = (p.y - height / 2) * scale + height / 2 + mouseInfluenceY * (scale * 0.8);
        const projSize = Math.max(0.6, p.size * scale);
        const currentAlpha = Math.max(0.08, p.alpha * (0.7 + Math.sin(time + i) * 0.3) * (scale * 0.9));

        // Draw luminous particle
        ctx.beginPath();
        ctx.arc(projX, projY, projSize, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.shadowBlur = projSize * 4;
        ctx.shadowColor = p.color === colors[0] || p.color === colors[1] ? '#f59e0b' : '#10b981';
        ctx.fill();

        // Connect close particles with subtle 3D hairlines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dz = p.z - p2.z;
          const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist3D < 110) {
            const scale2 = 380 / p2.z;
            const proj2X = (p2.x - width / 2) * scale2 + width / 2 + mouseInfluenceX * (scale2 * 0.8);
            const proj2Y = (p2.y - height / 2) * scale2 + height / 2 + mouseInfluenceY * (scale2 * 0.8);
            const lineAlpha = (1 - dist3D / 110) * 0.16 * Math.min(currentAlpha, p2.alpha);

            ctx.beginPath();
            ctx.moveTo(projX, projY);
            ctx.lineTo(proj2X, proj2Y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${lineAlpha})`;
            ctx.lineWidth = 0.7;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mousePos, isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-70"
    />
  );
};
