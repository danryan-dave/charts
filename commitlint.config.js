const fs = require('node:fs');
const path = require('node:path');

const chartsDir = path.join(__dirname, 'charts');

const chartScopes = fs
  .readdirSync(chartsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => fs.existsSync(path.join(chartsDir, name, 'Chart.yaml')));

// Scopes that are not charts but are legitimate change targets. Commits using
// these never trigger a chart release, since release attribution is by file path.
const nonChartScopes = ['ci', 'deps', 'docs', 'release', 'repo', 'tooling'];

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', [...chartScopes, ...nonChartScopes].sort()],
    'scope-empty': [2, 'never'],
    'header-max-length': [2, 'always', 100],
  },
};
