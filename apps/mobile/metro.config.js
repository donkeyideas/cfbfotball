const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

// Resolve symlinks so Metro and the bundler agree on paths.
// On macOS /var -> /private/var; without this, path.relative() in Metro
// produces broken ../../ chains when the project root and entry file
// disagree on the /var vs /private/var prefix (EAS local builds).
const projectRoot = fs.realpathSync(__dirname);
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Check if we're inside a monorepo (dev) or a flat EAS build directory
const isMonorepo = fs.existsSync(path.join(monorepoRoot, 'pnpm-workspace.yaml'));

if (isMonorepo) {
  const realMonorepoRoot = fs.realpathSync(monorepoRoot);
  config.watchFolders = [realMonorepoRoot];
  config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(realMonorepoRoot, 'node_modules'),
  ];
  config.resolver.disableHierarchicalLookup = true;
}
// In EAS local builds the project is extracted flat — use Metro defaults

module.exports = config;
