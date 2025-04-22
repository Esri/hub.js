const fs = require("fs");
const path = require("path");

// Define the root directory
const packagesDir = path.join(__dirname, "../packages");

// Get the version from the command-line argument
const newVersion = process.argv[2];

if (!newVersion) {
  console.error("Error: Please provide a version as an argument.");
  console.error("Usage: node update-peer-dependencies.js ^17.0.0");
  process.exit(1);
}

// Function to recursively find all package.json files
function findPackageJsonFiles(dir) {
  const files = fs.readdirSync(dir);
  let packageJsonFiles = [];

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      packageJsonFiles = packageJsonFiles.concat(findPackageJsonFiles(fullPath));
    } else if (file === "package.json") {
      packageJsonFiles.push(fullPath);
    }
  });

  return packageJsonFiles;
}

// Update the peerDependencies in each package.json file
function updatePeerDependencyVersion(files) {
  files.forEach((file) => {
    const packageJson = JSON.parse(fs.readFileSync(file, "utf8"));

    if (packageJson.peerDependencies && packageJson.peerDependencies["@esri/hub-common"]) {
      packageJson.peerDependencies["@esri/hub-common"] = newVersion;
      fs.writeFileSync(file, JSON.stringify(packageJson, null, 2) + "\n", "utf8");
      console.log(`Updated @esri/hub-common to ${newVersion} in ${file}`);
    }
  });
}

// Find and update all package.json files
const packageJsonFiles = findPackageJsonFiles(packagesDir);
updatePeerDependencyVersion(packageJsonFiles);