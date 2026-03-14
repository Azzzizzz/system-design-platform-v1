import { BaseEdge, getBezierPath } from "reactflow";
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
          stroke: isActive ? 'rgba(112,93,232,0.8)' : 'rgba(255,255,255,0.1)',
        }}
      />
      {/* 
        This is the glowing "packet" moving along the line.
        We use strokeDasharray and CSS animation in diagram.css to make it move.
      */}
      {isActive && (
        <path
          d={edgePath}
          fill="none"
          stroke="rgba(112, 93, 232, 1)"
          strokeWidth={4}
          className="animate-flow-packet"
          style={{
            filter: 'drop-shadow(0 0 6px rgba(112,93,232,0.8))',
          }}
        />
      )}
    </>
  );
}
