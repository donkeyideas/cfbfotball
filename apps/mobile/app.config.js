const appJson = require('./app.json');

const config = appJson.expo;

// Allow overriding Android package name via environment variable
// Used by "production-new" EAS profile for the new Google Play listing
if (process.env.ANDROID_PACKAGE) {
  config.android = {
    ...config.android,
    package: process.env.ANDROID_PACKAGE,
  };
}

module.exports = config;
