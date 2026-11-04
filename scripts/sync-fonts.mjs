import { mkdir, writeFile } from "node:fs/promises";

// Run explicitly to refresh vendored fonts. Builds do not need Google Fonts.
const url = "https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Saira:ital,wdth,wght@0,75..125,600..900;1,75..125,600..800&display=swap";
const response = await fetch(url, {
  headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36" },
  signal: AbortSignal.timeout(30000),
});
if (!response.ok) throw new Error(`Google Fonts: ${response.status}`);
const source = await response.text();
await mkdir("public/fonts", { recursive: true });
const rules = [];
for (const match of source.matchAll(/\/\* (latin(?:-ext)?) \*\/\s*(@font-face\s*\{[^}]+\})/g)) {
  const [, subset, rule] = match;
  const family = rule.match(/font-family: '([^']+)'/)[1].toLowerCase();
  const style = rule.match(/font-style: ([^;]+)/)[1];
  const weight = rule.match(/font-weight: ([^;]+)/)[1].replaceAll(" ", "-");
  const remote = rule.match(/url\(([^)]+\.woff2)\)/)[1];
  const filename = `${family}-${style}-${weight}-${subset}.woff2`;
  const font = await fetch(remote, { signal: AbortSignal.timeout(30000) });
  if (!font.ok) throw new Error(`Font download: ${font.status}`);
  const bytes = Buffer.from(await font.arrayBuffer());
  if (bytes.subarray(0, 4).toString() !== "wOF2") throw new Error(`Invalid WOFF2: ${filename}`);
  await writeFile(`public/fonts/${filename}`, bytes);
  rules.push(`/* ${subset} */\n${rule.replace(remote, `/fonts/${filename}`)}`);
  console.log(`${filename}: ${bytes.length} bytes`);
}
if (rules.length !== 16) throw new Error(`Expected 16 font subsets, received ${rules.length}`);
for (const family of ["barlow", "saira"]) {
  const license = await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${family}/OFL.txt`, { signal: AbortSignal.timeout(30000) });
  if (!license.ok) throw new Error(`Font license: ${license.status}`);
  await writeFile(`public/fonts/${family}-OFL.txt`, await license.text());
}
await writeFile("src/styles/fonts.css", `/* Self-hosted Google Fonts. Licenses in public/fonts. Refresh: npm run sync:fonts */\n${rules.join("\n\n")}\n`);
