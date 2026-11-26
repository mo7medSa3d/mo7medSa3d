import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataFile = fs.readFileSync(path.join(root, "constants/data.ts"), "utf8");
const portfolioFile = fs.readFileSync(path.join(root, "components/Portfolio.tsx"), "utf8");

// 1. Verify every /images/... and /resume.pdf path exists in public/
const assetPaths = [...dataFile.matchAll(/["'](\/(?:images\/[^"']+|resume\.pdf))["']/g)].map((m) => m[1]);
assert.ok(assetPaths.length >= 8, `Expected at least 8 asset references, found ${assetPaths.length}`);
for (const rel of assetPaths) {
  const full = path.join(root, "public", rel);
  assert.ok(fs.existsSync(full), `Missing public asset: ${rel}`);
}

// 2. Verify no stale .git suffix on GitHub URLs
assert.ok(!dataFile.includes(".git\""), "Found trailing .git in a GitHub URL");

// 3. Verify every declared terminal command is handled in Portfolio.tsx
const cmdBlock = dataFile.match(/TERMINAL_COMMANDS\s*=\s*\[([\s\S]*?)\]/);
assert.ok(cmdBlock, "Could not locate TERMINAL_COMMANDS");
const commands = [...cmdBlock[1].matchAll(/"([a-z]+)"/g)].map((m) => m[1]);
for (const cmd of commands) {
  const handled =
    portfolioFile.includes(`case "${cmd}":`) ||
    portfolioFile.includes(`cmd === "${cmd}"`);
  assert.ok(handled, `Terminal command "${cmd}" is not handled in Portfolio.tsx`);
}

// 4. Verify known regression anti-patterns are absent
for (const bad of ["object-full", "feTurbulence", "cursor-none", "gsap", "LoaderScreen"]) {
  assert.ok(!portfolioFile.includes(bad), `Regression found in Portfolio.tsx: ${bad}`);
}

console.log(`OK: verified ${assetPaths.length} public assets, ${commands.length} terminal commands, and zero regressions.`);
