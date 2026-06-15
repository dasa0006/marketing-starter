/** @type {import('pnpm').Pnpmfile} */
module.exports = {
  hooks: {
    readPackage(pkg) {
      // Patch v8 Storybook packages to accept the v10 CLI.
      // Storybook v8 addons have not published v10 versions yet, but the v10
      // CLI is required for Next.js 16 support. This is a known upstream gap.
      if (pkg.peerDependencies?.storybook) {
        const current = pkg.peerDependencies.storybook;
        // Only patch if it requires v8 but does not already allow v10
        if (
          current.includes("^8") &&
          !current.includes("^10") &&
          !current.includes("10.4")
        ) {
          pkg.peerDependencies.storybook = `${current} || ^10.4.4`;
        }
      }

      // Patch legacy ESLint plugins to accept ESLint v10.
      // These plugins are transitive deps of eslint-config-next and have not
      // yet published v10-compatible peer dependency ranges.
      if (pkg.peerDependencies?.eslint) {
        const current = pkg.peerDependencies.eslint;
        // Only patch if the range caps at v9 but does not already allow v10
        if (
          current.includes("^9") &&
          !current.includes("^10") &&
          !current.includes(">=10")
        ) {
          pkg.peerDependencies.eslint = `${current} || ^10`;
        }
      }
      return pkg;
    },
  },
};
