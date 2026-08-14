# Release tooling

`releaserc.base.json` holds the shared semantic-release config. Each chart's
`.releaserc.json` extends it and supplies only its own `tagFormat`.

`semantic-release-path-filter.mjs` decides which commits belong to the chart
being released. It wraps `@semantic-release/commit-analyzer` and
`@semantic-release/release-notes-generator`, passing them only the commits that
touched files under the chart's directory. The chart directory is derived from
the process working directory, so it needs no per-chart configuration.

## Constraints that look like mistakes but are not

Each of these was found by a failing run. Please do not "fix" them back.

**Shell env vars use `$VAR`, not `${env.VAR}`.**
`@semantic-release/exec` renders commands through a Lodash template, which
interpolates `${...}`. It destructures `env` out of the object it passes to that
template, so `${env.CR_TOKEN}` throws `ReferenceError: env is not defined`. The
command already runs in a shell with the environment attached, so plain
`$CR_TOKEN` works. Braces would be captured by the template, so leave them off.

`${nextRelease.version}` is different and correct: `nextRelease` really is in the
template context.

**`publishCmd` redirects stdout to stderr.**
semantic-release validates the `publish` step's return value with
`(output) => !output || isPlainObject(output)`, and `@semantic-release/exec`
returns the command's trimmed stdout. `cr` prints progress to stdout, so without
`1>&2` the step returns a non-empty string and the release fails validation after
the version bump has already been committed. Redirecting to stderr keeps the
output visible in CI logs while returning nothing.

**The plugin skips merge commits.**
`git diff-tree -m` diffs a merge against *every* parent and concatenates the
results, so a merge reports files from both sides and would attribute unrelated
charts. It also returns nothing at all for a root commit. The plugin uses
`git log -1 --format=%P --name-only --first-parent` instead and drops commits
with more than one parent, since a merge's contents are already covered by the
commits being merged.

**Releases run in one job, in sequence.**
`@semantic-release/git` pushes with a plain `git push --tags origin HEAD:master`
and never rebases. A job matrix would give every chart the same immutable
`github.sha` to check out, so the second chart to push is always based on a stale
master and is rejected. Sequential releases in a single checkout keep every push
a fast-forward.

## Running it locally

```sh
cd charts/<name>
npx semantic-release --dry-run --repository-url https://github.com/dave-inc/charts.git
```

If a local run hangs, check your global git config. `core.editor` values that
block (`code --wait`) and `commit.gpgsign` will stall a release that CI runs
fine, because a GitHub runner has no global git config.
