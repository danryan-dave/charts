# Contributing

Chart versions are no longer edited by hand. Merging to `master` decides what
gets released, from the commit messages.

## Setup

```sh
npm ci
```

`npm ci` installs the git hooks via lefthook. Do it once per clone.

## Jira tickets

Put the ticket in the **PR description**, not the title. The PR template has a
field for it.

SOC-CI accepts a ticket in either the PR title or the PR body, so using the body
keeps the title a clean Conventional Commit with nothing extra to strip out.

SOC-CI does more than pattern-match. It looks the ticket up in Jira and fails if
the ticket does not exist or is already in a Done status, so a made-up reference
like `ABC-1` will not pass. It scans for `PROJECT-123` shaped references and
passes as soon as one of them resolves to a valid open ticket.

SOC-CI never looks at the branch name, so branch naming is yours to choose.
Something like `SRE-7229-add-node-selector` is still a courtesy to reviewers.

## Commit and PR titles

```
type(scope): subject
```

`scope` must be a chart directory name (`common`, `gatewayapi`, ...) or one of
the non-chart scopes `ci`, `deps`, `docs`, `release`, `repo`, `tooling`.

| Type | Release |
|---|---|
| `feat` | minor |
| `fix`, `perf` | patch |
| anything with `BREAKING CHANGE:` in the body, or `type(scope)!:` | major |
| `chore`, `docs`, `refactor`, `style`, `test`, `build`, `ci` | none |

Examples:

```
feat(common): support minReadySeconds on the reverse proxy
fix(gatewayapi): correct sectionName rendering for wildcard hosts
feat(job)!: drop support for the legacy schedule field
```

Do not put the ticket in the header. `[BEI-2101]: add policy` is rejected by
commitlint, and it is not needed: SOC-CI reads the ticket from the PR body.

**The PR title is what counts.** PRs are squash merged, so the PR title becomes
the commit message that semantic-release reads. Local hooks check your individual
commits, and the required `lint-pr-title` check enforces the title itself.

Squash merge collapses a PR into one changelog entry with one type. If a PR needs
several distinct entries in the changelog, use rebase-and-merge so each commit
survives, or split it into separate PRs.

## How a chart gets released

Release attribution is by **file path**, not by scope. A commit releases a chart
when it touches a file under that chart's directory. The scope is a readability
convention that keeps changelog labels accurate; it does not steer the release.

So a single PR touching `charts/common` and `charts/job` releases both charts,
independently, at their own version numbers, even though the header carries one
scope.

### Sweeping changes

The flip side is that on a PR touching a file in *every* chart directory, the
commit type decides whether every chart gets released. Adding a shared file, a
repo-wide lint fix, or a bulk rename under `charts/` will bump all of them if the
title says `feat` or `fix`.

Use `chore` or `refactor` for that kind of change unless you genuinely want every
chart to get a new version. Reviewers should watch for this: the diff looks
harmless, and the damage is a pile of releases nobody asked for, each one a new
version consumers have to reason about.

If a sweeping change really does need to ship with a chart-affecting type, split
it: one `chore` PR for the mechanical part, one scoped PR per chart that needs a
release.

On every push to `master` the release workflow walks every chart and, for each:

1. works out the next version from the commits touching that chart since its last
   release tag,
2. writes that version into `Chart.yaml` and regenerates `CHANGELOG.md`,
3. runs `helm dependency update`, `helm lint`, `helm package`,
4. tags `<chart>-<version>`, commits the version bump and changelog back to
   `master`, and creates the GitHub Release with the `.tgz` attached,
5. republishes `index.yaml` on `gh-pages`.

Charts with no releasable commits are skipped. Nothing to do by hand.

## Adding a chart

1. Create `charts/<name>/` with a `Chart.yaml` whose `name` matches the directory.
2. Add `charts/<name>/.releaserc.json`:

```json
{
  "extends": "../../tools/releaserc.base.json",
  "tagFormat": "<name>-${version}"
}
```

3. If the chart should not start its published history at `1.0.0`, create a
   stable tag first, for example `git tag <name>-0.1.0 && git push origin <name>-0.1.0`.
   semantic-release ignores prerelease tags on `master`, so a chart with only
   `-beta.N` tags is treated as never released and jumps straight to `1.0.0`.

The commitlint scope list and the release workflow both read the `charts/`
directory, so nothing else needs updating. `lint.yml` fails the PR if the config
is missing or the `tagFormat` does not match the directory name.

## Beta / prerelease testing

The old flow (hand-editing `Chart.yaml` to `1.0.0-bei-719` and publishing a beta
from a branch) is gone. `master` only produces stable versions.

To test an unreleased chart, point your consuming chart at the local path:

```yaml
dependencies:
  - name: common
    version: 0.11.1
    repository: "file://../charts/charts/common"
```

then `helm dependency update && helm template .`.

If you need a real published prerelease, raise it with SRE. It needs a prerelease
branch added to `tools/releaserc.base.json`, which is a deliberate decision rather
than something to do ad hoc.
