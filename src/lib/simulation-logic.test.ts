import { describe, it, expect } from 'vitest';
import { getNextTargetServer, calculateNewServerLoad } from './simulation-logic';

describe('Simulation Logic', () => {
  describe('Round Robin Algorithm', () => {
    it('should cycle through healthy servers', () => {
      const serverStatuses = [true, true, true];
      const serverLoad = [0, 0, 0];
      
      expect(getNextTargetServer({ algorithm: 'round-robin', tick: 0, serverLoad, clientIdx: 0, serverStatuses }).targetIdx).toBe(0);
      expect(getNextTargetServer({ algorithm: 'round-robin', tick: 1, serverLoad, clientIdx: 0, serverStatuses }).targetIdx).toBe(1);
      expect(getNextTargetServer({ algorithm: 'round-robin', tick: 2, serverLoad, clientIdx: 0, serverStatuses }).targetIdx).toBe(2);
      expect(getNextTargetServer({ algorithm: 'round-robin', tick: 3, serverLoad, clientIdx: 0, serverStatuses }).targetIdx).toBe(0);
    });

    it('should skip down servers', () => {
      const serverStatuses = [true, false, true];
      const serverLoad = [0, 0, 0];
      
      // Tick 1 would normally be Server 1 (index 1), but it's down. Should fallback or skip.
      // My implementation falls back to the first available if preferred is down.
      const result = getNextTargetServer({ algorithm: 'round-robin', tick: 1, serverLoad, clientIdx: 0, serverStatuses });
      expect(result.targetIdx).not.toBe(1);
      expect(serverStatuses[result.targetIdx]).toBe(true);
    });
  });

  describe('Least Connection Algorithm', () => {
    it('should pick the server with minimal load', () => {
      const serverStatuses = [true, true, true];
      const serverLoad = [10, 2, 8];
      
      const result = getNextTargetServer({ algorithm: 'least-conn', tick: 0, serverLoad, clientIdx: 0, serverStatuses });
      expect(result.targetIdx).toBe(1);
    });

    it('should only consider healthy servers', () => {
      const serverStatuses = [true, false, true];
      const serverLoad = [10, 1, 8]; // Index 1 has "least connections" but is DOWN
      
      const result = getNextTargetServer({ algorithm: 'least-conn', tick: 0, serverLoad, clientIdx: 0, serverStatuses });
      expect(result.targetIdx).toBe(2); // Should pick index 2 (8 < 10)
    });
  });

  describe('IP Hash Algorithm', () => {
    it('should pin clients to specific servers', () => {
      const serverStatuses = [true, true, true];
      const serverLoad = [0, 0, 0];
      
      const resA = getNextTargetServer({ algorithm: 'ip-hash', tick: 0, serverLoad, clientIdx: 0, serverStatuses });
      const resB = getNextTargetServer({ algorithm: 'ip-hash', tick: 1, serverLoad, clientIdx: 0, serverStatuses });
      
      expect(resA.targetIdx).toBe(0);
      expect(resB.targetIdx).toBe(0); // Tick change shouldn't affect IP Hash
    });

    it('should failover if pinned server is down', () => {
      const serverStatuses = [false, true, true]; // Index 0 is down
      const serverLoad = [0, 0, 0];
      
      const result = getNextTargetServer({ algorithm: 'ip-hash', tick: 0, serverLoad, clientIdx: 0, serverStatuses });
      expect(result.targetIdx).not.toBe(0);
      expect(serverStatuses[result.targetIdx]).toBe(true);
    });
  });

  describe('Server Load Calculation', () => {
    it('should increase load for targeted server and decay others', () => {
      const initialLoad = [5, 5, 5];
      const nextLoad = calculateNewServerLoad(initialLoad, 1, false);
      
      expect(nextLoad[1]).toBeGreaterThan(5); // Increased
      expect(nextLoad[0]).toBeLessThan(5);    // Decayed
      expect(nextLoad[2]).toBeLessThan(5);    // Decayed
    });

    it('should cap load at 10 before applying decay', () => {
      const initialLoad = [9.5, 9.5, 9.5];
      const nextLoad = calculateNewServerLoad(initialLoad, 1, false);
      // 10 (capped) - 0.35 (decay) = 9.65
      expect(nextLoad[1]).toBeCloseTo(9.65);
    });
  });
});
