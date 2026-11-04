import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const run = promisify(execFile);
const url = process.env.AUDIT_URL || "http://127.0.0.1:4322";
const cli = fileURLToPath(new URL("../node_modules/lighthouse/cli/index.js", import.meta.url));
await mkdir(".astro", { recursive: true });
await mkdir("docs/audits", { recursive: true });
const samples = [];
for (let index = 1; index <= 3; index++) {
  const output = `.astro/lighthouse-load-${index}.json`;
  await run(process.execPath, [cli, url, "--chrome-flags=--headless=new", "--only-categories=performance", "--output=json", `--output-path=${output}`, "--quiet"], { timeout: 120000 });
  const report = JSON.parse(await readFile(output, "utf8"));
  if (report.runtimeError) throw new Error(report.runtimeError.message);
  const metrics = report.audits.metrics.details.items[0];
  samples.push({ score: Math.round(report.categories.performance.score * 100), fcpMs: metrics.firstContentfulPaint, lcpMs: metrics.largestContentfulPaint, tbtMs: metrics.totalBlockingTime, cls: metrics.cumulativeLayoutShift, speedIndexMs: metrics.speedIndex, bytes: report.audits["total-byte-weight"].numericValue });
  console.log(`Run ${index}: ${JSON.stringify(samples.at(-1))}`);
}
const median = Object.fromEntries(Object.keys(samples[0]).map((key) => [key, samples.map((sample) => sample[key]).sort((a, b) => a - b)[1]]));
const result = { testedAt: new Date().toISOString(), url, profile: "Lighthouse mobile, simulated Slow 4G, CPU x4, three sequential cold-cache runs", samples, median };
await writeFile("docs/audits/load.json", JSON.stringify(result, null, 2) + "\n");
console.log(`Median: ${JSON.stringify(median)}`);
