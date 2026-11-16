// Run Jest with ESM support
const { execSync } = require('child_process');

try {
  execSync('node --experimental-vm-modules node_modules/jest/bin/jest.js ' + process.argv.slice(2).join(' '), {
    stdio: 'inherit'
  });
} catch (err) {
  process.exit(1);
}
