const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Check if we're inside a monorepo (dev) or a flat EAS build directory
const isMonorepo = fs.existsSync(path.join(monorepoRoot, 'pnpm-workspace.yaml'));

if (isMonorepo) {
  // Dev / CI checkout: watch the whole monorepo and resolve from both node_modules
  config.watchFolders = [monorepoRoot];
  config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(monorepoRoot, 'node_modules'),
  ];
  config.resolver.disableHierarchicalLookup = true;
}
// In EAS local builds the project is extracted flat — use Metro defaults

module.exports = config;
