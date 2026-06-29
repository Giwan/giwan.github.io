export enum PerformanceTier {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high'
}

export interface EnvironmentInfo {
  isMobile: boolean;
  isLowPower: boolean;
  prefersReducedMotion: boolean;
  connectionType: string;
  tier: PerformanceTier;
}

export function parseEnvironment(
  ua: string,
  hardwareConcurrency: number,
  prefersReducedMotion: boolean,
  connectionType: string
): EnvironmentInfo {
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua.toLowerCase());
  const isLowPower = hardwareConcurrency <= 2 || prefersReducedMotion;

  return {
    isMobile,
    isLowPower,
    prefersReducedMotion,
    connectionType,
    tier: calculateTier(hardwareConcurrency, isLowPower)
  };
}

function calculateTier(cores: number, isLowPower: boolean): PerformanceTier {
  if (isLowPower) return PerformanceTier.LOW;
  if (cores >= 8) return PerformanceTier.HIGH;
  return PerformanceTier.NORMAL;
}

export function calculateMemoryLevel(usage: number): 'low' | 'medium' | 'high' {
  if (usage > 0.8) return 'high';
  if (usage > 0.6) return 'medium';
  return 'low';
}
