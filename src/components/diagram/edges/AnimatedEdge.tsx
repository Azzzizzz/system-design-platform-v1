import { useState, useEffect, useRef } from "react";
import { BaseEdge, getBezierPath, EdgeLabelRenderer } from "reactflow";
import type { EdgeProps } from "reactflow";

export function AnimatedEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isActive = data?.active;

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: isActive ? 2 : 1,
          stroke: isActive ? 'rgba(112, 93, 232, 0.4)' : 'rgba(255, 255, 255, 0.1)',
        }}
      />
      {isActive && (
        <EdgeLabelRenderer>
          <ParticleSystem edgePath={edgePath} />
        </EdgeLabelRenderer>
      )}
    </>
  );
}

const ParticleSystem = ({ edgePath }: { edgePath: string }) => {
  const [particles, setParticles] = useState<{ id: number; key: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => [...prev.slice(-15), { id: Math.random(), key: Date.now() }]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none', top: 0, left: 0 }}>
      {particles.map((p) => (
        <Particle key={p.key} path={edgePath} />
      ))}
    </svg>
  );
};

const Particle = ({ path }: { path: string }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let start: number;
    const duration = 3000;
    
    const animate = (time: number) => {
      if (!start) start = time;
      const progress = (time - start) / duration;
      
      if (progress < 1) {
        if (pathRef.current) {
          const point = pathRef.current.getPointAtLength(progress * pathRef.current.getTotalLength());
          setPos({ x: point.x, y: point.y });
          setVisible(true);
        }
        requestAnimationFrame(animate);
      } else {
        setVisible(false);
      }
    };
    
    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [path]);

  return (
    <>
      <path ref={pathRef} d={path} fill="none" style={{ display: 'none' }} />
      {visible && (
        <g transform={`translate(${pos.x}, ${pos.y})`}>
          <circle r="2" fill="#705DE8" />
          <circle r="4" fill="#705DE8" opacity="0.3">
            <animate attributeName="r" from="4" to="8" dur="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.3" to="0" dur="1s" repeatCount="indefinite" />
          </circle>
        </g>
      )}
    </>
  );
};
