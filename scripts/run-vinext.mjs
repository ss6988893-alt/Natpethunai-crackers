import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const command = process.argv[2];
const supportedCommands = new Set(["dev", "build", "start"]);

if (!supportedCommands.has(command)) {
  console.error("Usage: node scripts/run-vinext.mjs <dev|build|start>");
  process.exit(1);
}

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const vinextCli = resolve(projectRoot, "node_modules", "vinext", "dist", "cli.js");

const child = spawn(process.execPath, [vinextCli, command], {
  cwd: projectRoot,
  stdio: "inherit",
  env: {
    ...process.env,
    WRANGLER_LOG_PATH: resolve(projectRoot, ".wrangler", "wrangler.log"),
  },
});

child.on("error", (error) => {
  console.error(`Unable to start vinext: ${error.message}`);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
