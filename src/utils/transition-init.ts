import {transitionController} from './transitionController';

const noop = () => {};

export function initializeTransitions(): void {
    if (typeof window === 'undefined')
        return;
    
    if (import.meta.env.DEV)
        document.addEventListener('astro:before-preparation', noop);
}

export const getTransitionController = () => transitionController;

export function isViewTransitionSupported(): boolean {
    return transitionController.isTransitionSupported();
}

export function initializeTransitionErrorHandling(): void {
    if (typeof window === 'undefined')
        return;
}

export {
    transitionController,
};
