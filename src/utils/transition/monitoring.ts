/**
 * Monitoring utilities for transition optimization
 */

/**
 * Setup battery monitoring
 */
export function setupBatteryMonitoring(): void {
    if (typeof window === 'undefined') return;

    if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
            const updateBatteryStatus = () => {
                const root = document.documentElement;
                root.setAttribute('data-battery-level', Math.round(battery.level * 100).toString());
                root.setAttribute('data-battery-charging', battery.charging.toString());
                root.setAttribute('data-battery-low', (battery.level < 0.2).toString());
            };

            updateBatteryStatus();

            battery.addEventListener('levelchange', updateBatteryStatus);
            battery.addEventListener('chargingchange', updateBatteryStatus);
        }).catch(() => {
            // Battery API not available
        });
    }
}

/**
 * Setup network monitoring
 */
export function setupNetworkMonitoring(): void {
    if (typeof window === 'undefined') return;

    const connection = (navigator as any).connection ||
        (navigator as any).mozConnection ||
        (navigator as any).webkitConnection;

    if (connection) {
        const updateNetworkStatus = () => {
            const root = document.documentElement;
            root.setAttribute('data-connection-type', connection.effectiveType || 'unknown');
            root.setAttribute('data-connection-downlink', connection.downlink?.toString() || 'unknown');
            root.setAttribute('data-save-data', connection.saveData?.toString() || 'false');
        };

        updateNetworkStatus();
        connection.addEventListener('change', updateNetworkStatus);
    }
}

/**
 * Check if battery is low
 */
export function isBatteryLow(): boolean {
    if (typeof document === 'undefined') return false;
    const batteryLevel = document.documentElement.getAttribute('data-battery-level');
    return batteryLevel ? parseInt(batteryLevel) < 20 : false;
}

/**
 * Check if network is slow
 */
export function isSlowNetwork(): boolean {
    if (typeof document === 'undefined') return false;
    const connectionType = document.documentElement.getAttribute('data-connection-type');
    return connectionType === 'slow-2g' || connectionType === '2g';
}
