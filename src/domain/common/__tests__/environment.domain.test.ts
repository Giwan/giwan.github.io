import { parseEnvironment, PerformanceTier, calculateMemoryLevel } from '../environment.domain';

describe('Environment Domain', () => {
  describe('Environment Parsing', () => {
    it('detects mobile devices', () => {
      const env = parseEnvironment('Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X)', 8, false, 'wifi');
      expect(env.isMobile).toBe(true);
    });

    it('identifies performance tiers', () => {
      const high = parseEnvironment('desktop', 8, false, 'wifi');
      const low = parseEnvironment('desktop', 2, false, 'wifi');
      const reduced = parseEnvironment('desktop', 8, true, 'wifi');

      expect(high.tier).toBe(PerformanceTier.HIGH);
      expect(low.tier).toBe(PerformanceTier.LOW);
      expect(reduced.tier).toBe(PerformanceTier.LOW);
    });
  });

  describe('Memory Calculation', () => {
    it('categorizes memory usage correctly', () => {
      expect(calculateMemoryLevel(0.9)).toBe('high');
      expect(calculateMemoryLevel(0.7)).toBe('medium');
      expect(calculateMemoryLevel(0.4)).toBe('low');
    });
  });
});
