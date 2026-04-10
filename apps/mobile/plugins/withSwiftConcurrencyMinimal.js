/**
 * Expo config plugin that disables Swift strict concurrency checking
 * for all CocoaPods targets AND the project itself.
 *
 * Key fix: injects settings AFTER the react_native_post_install call
 * so RN's own post_install hooks can't override our settings.
 *
 * Also forces Swift 5 language mode to avoid Swift 6 compiler errors
 * in expo-modules-core and other native modules on Xcode 16+.
 */
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withSwiftConcurrencyMinimal(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(
        config.modRequest.platformProjectRoot,
        'Podfile'
      );

      let contents = fs.readFileSync(podfilePath, 'utf8');

      const makeSnippet = (varName) => [
        '',
        '    # [CFB Social] Force Swift 5 language mode + disable strict concurrency (Xcode 16+)',
        `    ${varName}.pods_project.build_configurations.each do |bc|`,
        `      bc.build_settings['SWIFT_STRICT_CONCURRENCY'] = 'minimal'`,
        `      bc.build_settings['SWIFT_VERSION'] = '5.0'`,
        '    end',
        `    ${varName}.pods_project.targets.each do |target|`,
        '      target.build_configurations.each do |bc|',
        `        bc.build_settings['SWIFT_STRICT_CONCURRENCY'] = 'minimal'`,
        `        bc.build_settings['SWIFT_VERSION'] = '5.0'`,
        '      end',
        '    end',
      ].join('\n');

      // Strategy 1: Find react_native_post_install and inject AFTER it
      const rnPostInstallRegex = /^(.*react_native_post_install.*)$/m;
      const rnMatch = contents.match(rnPostInstallRegex);

      if (rnMatch) {
        // Figure out the installer variable name from the post_install block
        const postInstallMatch = contents.match(/post_install\s+do\s+\|(\w+)\|/);
        const varName = postInstallMatch ? postInstallMatch[1] : 'installer';
        const snippet = makeSnippet(varName);

        // Inject right after the react_native_post_install line
        contents = contents.replace(
          rnPostInstallRegex,
          `$1${snippet}`
        );
        console.log(
          '[withSwiftConcurrencyMinimal] Injected Swift 5 + SWIFT_STRICT_CONCURRENCY=minimal AFTER react_native_post_install'
        );
      } else {
        // Strategy 2: No react_native_post_install found, inject at start of post_install
        const postInstallRegex = /post_install\s+do\s+\|(\w+)\|/;
        const match = contents.match(postInstallRegex);

        if (match) {
          const varName = match[1];
          const snippet = makeSnippet(varName);
          contents = contents.replace(
            postInstallRegex,
            `post_install do |${varName}|${snippet}`
          );
          console.log(
            '[withSwiftConcurrencyMinimal] Injected at START of post_install (no react_native_post_install found)'
          );
        } else {
          // Strategy 3: No post_install at all — append one
          contents += [
            '',
            '# [CFB Social] Force Swift 5 + disable strict concurrency (Xcode 16+)',
            'post_install do |installer|',
            makeSnippet('installer'),
            'end',
            '',
          ].join('\n');
          console.log(
            '[withSwiftConcurrencyMinimal] Appended new post_install block'
          );
        }
      }

      // Log the Podfile for debugging
      console.log('[withSwiftConcurrencyMinimal] === Podfile post_install section ===');
      const lines = contents.split('\n');
      const postInstallIdx = lines.findIndex(l => l.match(/post_install/));
      if (postInstallIdx !== -1) {
        const slice = lines.slice(postInstallIdx, Math.min(postInstallIdx + 30, lines.length));
        console.log(slice.join('\n'));
      }
      console.log('[withSwiftConcurrencyMinimal] === End Podfile section ===');

      fs.writeFileSync(podfilePath, contents);
      return config;
    },
  ]);
};
