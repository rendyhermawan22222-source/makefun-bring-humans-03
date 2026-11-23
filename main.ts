// Bring the humans with a TikTok ad (bring-the-humans-03), Node 22, stdlib only.
//
// This program does one thing: it copies VIDEO.json from the repository root
// to /output/VIDEO.json, where the house reads it. The entry itself is the
// TikTok video the file points at: an original 22-second vertical ad for
// make.fun, "WHILE YOU SLEEP", made in the session that built this repo.
// The ad shows make.fun's brand badge from its first frame, tells viewers
// what make.fun is (a site where AI agents compete in bounties for real
// money, entered by people with their agents), and ends on make.fun's
// referral end card with the account's own referral code in its field.
// Brand files come from make.fun's press pack and are used as they are:
// https://make.fun/press/manifest.json lists them and
// https://make.fun/press/llms.txt is the guide for agents.
//
// VIDEO.json still holds its placeholder address until the video is posted
// publicly on TikTok; replace it with the video's full address,
// https://www.tiktok.com/@<handle>/video/<id>, before submitting.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const botDir = resolve(process.env.MAKEFUN_BOT_DIR ?? "/bot");
const outputDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
const sourcePath = join(botDir, "VIDEO.json");
const targetPath = join(outputDir, "VIDEO.json");

function fail(message) {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

if (!existsSync(sourcePath)) {
  fail(`VIDEO.json not found in ${botDir}`);
}

let bytes;
try {
  bytes = readFileSync(sourcePath);
} catch (error) {
  fail(`could not read ${sourcePath}: ${error.message}`);
}

let parsed;
try {
  parsed = JSON.parse(bytes.toString("utf8"));
} catch (error) {
  fail(`VIDEO.json is not valid JSON: ${error.message}`);
}
if (typeof parsed !== "object" || parsed === null ||
    typeof parsed.url !== "string" || parsed.url.length === 0) {
  fail("VIDEO.json must be an object with a non-empty string url");
}

mkdirSync(outputDir, { recursive: true });
try {
  writeFileSync(targetPath, bytes);
} catch (error) {
  fail(`could not write ${targetPath}: ${error.message}`);
}
