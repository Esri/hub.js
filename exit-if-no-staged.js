const spawnSync = require('child_process').spawnSync;

const result = spawnSync('git', ['diff', '--name-only', '--cached']);
const stagedFiles = result.stdout.toString().trim();

if (!stagedFiles) {
  console.error("**********************");
  console.error("");
  console.error("No staged changes!");
  console.error("");
  console.error("**********************");
  process.exit(1);
}
