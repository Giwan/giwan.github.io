import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import { runPwaBuildValidation } from "../lib/pwaValidator";
import { PWA_CONFIG } from "../config";

export default function pwaValidationIntegration(): AstroIntegration {
    return {
        name: "pwa-validation",
        hooks: {
            "astro:build:done": async ({ dir }) => {
                const outputDir = fileURLToPath(dir);
                const requiredIconFiles = Array.from(
                    new Set(PWA_CONFIG.icons.map((icon) => path.basename(icon.src))),
                );

                const result = await runPwaBuildValidation({
                    outputDir,
                    requiredIconFiles,
                    manifestExpectations: {
                        name: PWA_CONFIG.name,
                        shortName: PWA_CONFIG.shortName,
                        themeColor: PWA_CONFIG.themeColor,
                        backgroundColor: PWA_CONFIG.backgroundColor,
                        display: PWA_CONFIG.display,
                        startUrl: PWA_CONFIG.startUrl,
                        scope: PWA_CONFIG.scope,
                    },
                });

                if (!result.success) {
                    throw new Error(`PWA validation failed with ${result.errors.length} error(s).`);
                }
            },
        },
    };
}
