const noop = () => {};

/**
 * Monitoring utilities for transition optimization
 */
/**
 * Setup battery monitoring
 */
export function setupBatteryMonitoring(): void {
    if (typeof window === 'undefined')
        return;

    if ('getBattery' in navigator) {
        const navWithBattery = navigator as { getBattery(): Promise<{ level: number; charging: boolean; addEventListener: (event: string, listener: () => void) => void; removeEventListener: (event: string, listener: () => void) => void }> };
        navWithBattery
            .getBattery()
            .then((battery) => {
                const updateBatteryStatus = () => {
                    const root = document.documentElement;

                    root.setAttribute('data-battery-level', Math
                        .round(battery.level * 100)
                        .toString());
                    root.setAttribute('data-battery-charging', battery.charging.toString());
                    root.setAttribute('data-battery-low', (battery.level < 0.2).toString());
                };

                updateBatteryStatus();

                battery.addEventListener('levelchange', updateBatteryStatus);
                battery.addEventListener('chargingchange', updateBatteryStatus);
            })
            .catch(noop);
    }
}

/**
 * Setup network monitoring
 */
export function setupNetworkMonitoring(): void {
    if (typeof window === 'undefined')
        return;

    const navWithConnection = navigator as { connection?: { effectiveType?: string; downlink?: number; saveData?: boolean }; mozConnection?: { effectiveType?: string; downlink?: number; saveData?: boolean }; webkitConnection?: { effectiveType?: string; downlink?: number; saveData?: boolean } };
    const connection = navWithConnection.connection || navWithConnection.mozConnection || navWithConnection.webkitConnection;

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
    if (typeof document === 'undefined')
        return false;

    const batteryLevel = document.documentElement.getAttribute('data-battery-level');

    return batteryLevel && parseInt(batteryLevel) < 20;
}

/**
 * Check if network is slow
 */
export function isSlowNetwork(): boolean {
    if (typeof document === 'undefined')
        return false;

    const connectionType = document.documentElement.getAttribute('data-connection-type');

    return connectionType === 'slow-2g' || connectionType === '2g';
}
