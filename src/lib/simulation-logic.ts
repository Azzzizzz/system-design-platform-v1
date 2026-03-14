export type Algorithm = "round-robin" | "least-conn" | "ip-hash";

interface BalancerInput {
  algorithm: Algorithm;
  tick: number;
  serverLoad: number[];
  clientIdx: number;
  serverStatuses: boolean[];
}

interface BalancerResult {
  targetIdx: number;
  reason: string;
  isDropped: boolean;
}

const clientNames = ['Client A', 'Client B', 'Client C'];

export function getNextTargetServer({
  algorithm,
  tick,
  serverLoad,
  clientIdx,
  serverStatuses
}: BalancerInput): BalancerResult {
  const activeServerIndices = serverStatuses
    .map((status, i) => status ? i : -1)
    .filter(i => i !== -1);

  if (activeServerIndices.length === 0) {
    return {
      targetIdx: -1,
      reason: "CRITICAL: All servers are DOWN. Request dropped.",
      isDropped: true
    };
  }

  let targetIdx = 0;
  let reason = "";

  if (algorithm === "round-robin") {
    // Find next active server in sequence starting from tick
    const potentialTarget = tick % serverStatuses.length;
    if (serverStatuses[potentialTarget]) {
      targetIdx = potentialTarget;
    } else {
      // Fallback to first available active server
      targetIdx = activeServerIndices[0];
    }
    reason = `Round Robin: Routing to Server ${targetIdx + 1}.`;
  } else if (algorithm === "least-conn") {
    // Only consider active servers for load calculation
    const activeLoads = activeServerIndices.map(i => serverLoad[i]);
    const minLoad = Math.min(...activeLoads);
    const candidates = activeServerIndices.filter(i => serverLoad[i] === minLoad);
    // Pick randomly among candidates with same minimum load
    targetIdx = candidates[Math.floor(Math.random() * candidates.length)];
    reason = `Least Conn: Server ${targetIdx + 1} has lowest load among active nodes.`;
  } else if (algorithm === "ip-hash") {
    // Sticky but fails over if target is down
    const preferredIdx = clientIdx % serverStatuses.length;
    if (serverStatuses[preferredIdx]) {
      targetIdx = preferredIdx;
      reason = `IP Hash (Sticky): ${clientNames[clientIdx]} -> Server ${targetIdx + 1}.`;
    } else {
      targetIdx = activeServerIndices[clientIdx % activeServerIndices.length];
      reason = `IP Hash (Failover): Client pinned Server ${preferredIdx + 1} is DOWN. Redirecting to ${targetIdx + 1}.`;
    }
  }

  return { targetIdx, reason, isDropped: false };
}

export function calculateNewServerLoad(
  currentLoad: number[],
  targetIdx: number,
  isDropped: boolean
): number[] {
  const next = [...currentLoad];
  
  if (!isDropped && targetIdx !== -1) {
    // Each request adds a stable unit of load, capped at 10 (100%)
    next[targetIdx] = Math.min(10, next[targetIdx] + 2);
  }
  
  // Constant decay to simulate "finished" requests
  return next.map(l => Math.max(0, l - 0.35));
}
