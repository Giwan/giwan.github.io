import { TIME_CONSTANTS } from '../../constants/storage';
import { isNot } from '../common/logic.domain';

export function isStale(timestamp: number, now: number): boolean {
  return (now - timestamp) >= TIME_CONSTANTS.FIVE_MINUTES_MS;
}

export function isFresh(timestamp: number, now: number): boolean {
  return isNot(isStale(timestamp, now));
}

export function isBlogPath(path: string): boolean {
  return path.startsWith("/blog");
}

export interface ScrollBlueprint {
  top: number;
  behavior: 'smooth' | 'auto';
  isLegacy: boolean;
}

export function getScrollToTopBlueprint(supportsSmooth: boolean): ScrollBlueprint {
  return buildBlueprint(0, supportsSmooth);
}

export function getRestoreScrollBlueprint(pos: number, supportsSmooth: boolean): ScrollBlueprint {
  return buildBlueprint(pos, supportsSmooth);
}

const buildBlueprint = (top: number, supportsSmooth: boolean): ScrollBlueprint => ({
  top,
  behavior: 'smooth',
  isLegacy: isNot(supportsSmooth)
});
