#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";
import { runPwaBuildValidation } from "../src/lib/pwaValidator.js";
import { PWA_CONFIG } from "../src/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..", "..", "..");

async function main() {
    const outputDir = path.join(projectRoot, "docs");
    const requiredIconFiles = Array.from(new Set(PWA_CONFIG.icons.map((icon) => path.basename(icon.src))));

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
        process.exitCode = 1;
    }
}

main().catch((error: any) => {
    console.error("❌ Validation failed:", error);
    process.exit(1);
});
