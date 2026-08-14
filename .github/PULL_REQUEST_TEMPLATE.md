## Jira

<!--
Required. SOC-CI looks up this ticket in Jira and fails if it does not exist or
is already Done. Keep it here rather than in the PR title, so the title stays a
clean Conventional Commit.
-->

https://demoforthedaves.atlassian.net/browse/<PROJECT>-<NUMBER>

## What changed

<!--
The PR title becomes the squash commit message and drives the release, so it
must be `type(scope): subject` with a chart name as the scope.

Charts are released based on the files you touched, not the scope, so a PR
touching two charts releases both.
-->

## Testing

<!-- How this was verified. `helm template` output, a dry-run, a preview env. -->
