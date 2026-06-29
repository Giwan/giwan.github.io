import type { NavigationContext } from './context.domain';
import { getTransitionContextName } from './optimization.domain';

export interface TransitionAttributeBlueprint {
  attributes: Record<string, string>;
  cssVariables: Record<string, string>;
}

export function calculateTransitionAttributes(
  context: NavigationContext,
  isReducedMotion: boolean,
  isLowPower: boolean
): TransitionAttributeBlueprint {
  return {
    attributes: getDomainAttributes(context, isReducedMotion, isLowPower),
    cssVariables: {}
  };
}

function getDomainAttributes(
  context: NavigationContext,
  isReducedMotion: boolean,
  isLowPower: boolean
): Record<string, string> {
  return {
    'data-transition-direction': context.direction,
    'data-transition-from-type': context.fromPageType,
    'data-transition-to-type': context.toPageType,
    'data-transition-relationship': context.relationship,
    'data-transition-context': getTransitionContextName(context.direction, context.relationship),
    'data-reduced-motion': isReducedMotion.toString(),
    'data-low-power': isLowPower.toString()
  };
}

export function calculateOptimizationStyles(
  duration: number,
  easing: string,
  type: string
): TransitionAttributeBlueprint {
  return {
    attributes: { 'data-transition-optimized': type },
    cssVariables: {
      '--transition-duration-optimized': `${duration}ms`,
      '--transition-easing-optimized': easing
    }
  };
}
